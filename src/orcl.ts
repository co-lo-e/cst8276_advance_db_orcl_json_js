import "dotenv/config";
import oracledb from "oracledb";

const credentials = {
	user: process.env.ORCL_USER,
	password: process.env.ORCL_PSWD,
	connectString: process.env.ORCL_PDB,
} as const;

const db = "housing_json_data" as const;

export async function insert(data: Housing) {
	const connection = await oracledb.getConnection(credentials);
	try {
		const result = await connection.execute(
			` INSERT INTO ${db} (json_data) VALUES
			(:bv)
		`,
			{ bv: { val: data, type: oracledb.DB_TYPE_JSON } },
			{ autoCommit: true }
		);
		console.log(`Inserted: ${result.rows?.length} row` )
		return result;
	} catch (error) {
		console.error("insert failed: " + error);
		throw error;
	} finally {
		await connection.close();
	}
}

export async function insertBulk(data: Housing[]) {
	const connection = await oracledb.getConnection(credentials);
	try {
		const sql = `INSERT INTO ${db} (json_data) VALUES (:json)`;
		const binds = data.map((item) => ({ json: item as any }));
		const options = {
			autoCommit: true,
			bindDefs: {
				json: {
					type: oracledb.DB_TYPE_JSON,
				},
			},
		};
		const result = await connection.executeMany(sql, binds, options);
		console.log(`Inserted: ${result.rowsAffected} rows.`);
		return result;
	} catch (error) {
		console.error("Bulk insert failed: " + error);
		throw error;
	} finally {
		await connection.close();
	}
}

export async function readAll() {
	const connection = await oracledb.getConnection(credentials);
	try {
		const sql = `SELECT json_data from ${db}`;
		const result = await connection.execute<Housing[]>(sql, [], {
			outFormat: oracledb.OUT_FORMAT_OBJECT,
		});
		console.log(`Read: ${result.rows?.length} rows.`);
		return result;
	} catch (error) {
		console.error("Read All failed: " + error);
		throw error;
	} finally {
		await connection.close();
	}
}

export async function readById(id: number) {
	const connection = await oracledb.getConnection(credentials);
	try {
		const sql = `SELECT json_data from ${db} WHERE id = :id`;
		const result = await connection.execute<Housing>(sql, [id], {
			outFormat: oracledb.OUT_FORMAT_OBJECT,
		});
		console.log(`Read: ${result.rows}.`);
		console.log(`Read: ${result.rowsAffected} rows.`);
		return result;
	} catch (error) {
		console.error("Read by Id failed: " + error);
		throw error;
	} finally {
		await connection.close();
	}
}

export async function update(id: number, data: Housing) {
	const connection = await oracledb.getConnection(credentials);
	try {
		const result = await connection.execute(
			` UPDATE ${db} SET json_data = :bv WHERE id = :id`,
			{ bv: { val: data, type: oracledb.DB_TYPE_JSON }, id: id },
			{
				autoCommit: true,
				outFormat: oracledb.OUT_FORMAT_OBJECT,
			}
		);
		console.log(`Updated: ${result.rowsAffected} row(s).`);
		return result;
	} catch (error) {
		console.error("Update failed: " + error);
		throw error;
	} finally {
		await connection.close();
	}
}

export async function deleteById(id: number) {
	const connection = await oracledb.getConnection(credentials);
	try {
		const result = await connection.execute(
			`DELETE FROM ${db} WHERE id = :id `,
			[id],
			{ autoCommit: true }
		);
		console.log(`Delete: ${result.rowsAffected} row.`);
		return result;
	} catch (error) {
		console.error("Delete failed: " + error);
		throw error;
	} finally {
		await connection.close();
	}
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
		await connection.close();
	}
}
