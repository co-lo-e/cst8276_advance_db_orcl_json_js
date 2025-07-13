import express from "express";

import "dotenv/config";
import oracledb from "oracledb";


const config = {
	user: process.env.ORCL_USER,
	password: process.env.ORCL_PSWD,
	pdb: process.env.ORCL_PDB,
}

async function conn() {
	const connection = await oracledb.getConnection({
		user: config.user,
		password: config.password,
		connectString: config.pdb,
	});

	const result = await connection.execute(
        `SELECT manager_id, department_id, department_name
         FROM departments
         WHERE manager_id = :id`,
        [103],  // bind value for :id
    );

    console.log(result.rows);
    await connection.close();
}


const app = express();

app.get("/", (req, resp) => {
	resp.send("Hello world")
})

const port = 8000;
app.listen(port, async () => {
	console.log(process.env.ORCL_USER)
	console.log(process.env.ORCL_PSWD)
	
	console.log("listening on " + port);

	await conn();
});