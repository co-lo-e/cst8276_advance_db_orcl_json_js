import "dotenv/config";
import oracledb from "oracledb";

const credentials = {
	user: process.env.ORCL_USER,
	password: process.env.ORCL_PSWD,
	connectString: process.env.ORCL_PDB,
} as const;

async function conn() {
	const connection = await oracledb.getConnection(credentials);

	await connection.close();
}

export async function testHR(id: number) {
	if (credentials.user === "hr" && credentials.password === "hr") {
		const connection = await oracledb.getConnection(credentials);

		const result = await connection.execute(
			`SELECT manager_id, department_id, department_name
         FROM departments
         WHERE manager_id = :id`,
			[id] // bind value for :id
		);

		console.log(result.rows);
		await connection.close()
	}
}
