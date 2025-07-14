/**
 * This module provides comprehensive CRUD (Create, Read, Update, Delete) operations
 * for managing JSON data in Oracle Database. It leverages Oracle's native JSON
 * capabilities to store, query, and manipulate JSON documents efficiently.
 *
 * Features:
 * - JSON data insertion (single and bulk operations)
 * - JSON data retrieval (all records and by ID)
 * - JSON data updates by ID
 * - JSON data deletion by ID
 * - Proper error handling and connection management
 * - Oracle DB_TYPE_JSON for optimal JSON storage
 *
 */

import "dotenv/config";
import oracledb from "oracledb";
import type { Housing } from "./types";

const credentials = {
	user: process.env.ORCL_USER,
	password: process.env.ORCL_PSWD,
	connectString: process.env.ORCL_PDB,
} as const;

const db = "housing_json_data" as const;
let connection: oracledb.Connection | null;

async function getConnection() {
	if (!connection) {
		connection = await oracledb.getConnection(credentials);
		console.log(`Connected to ${db} at ${credentials.connectString}`);
	}
	return connection;
}

export async function insert(data: Housing) {
	const connection = await getConnection();
	try {
		const result = await connection.execute(
			` INSERT INTO ${db} (json_data) VALUES
			(:bv)
		`,
			{ bv: { val: data, type: oracledb.DB_TYPE_JSON } },
			{ autoCommit: true }
		);
		console.log(`Inserted: ${result.rows?.length} row`);
		return result;
	} catch (error) {
		console.error("insert failed: " + error);
		throw error;
	} finally {
		await connection.close();
	}
}

export async function insertBulk(data: Housing[]) {
	const connection = await getConnection();
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
	const connection = await getConnection();
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

function cap(word: string) {
	return word.charAt(0).toUpperCase() + word.substring(1);
}

/**
 * 
o [x]	Use dot-notation for simple lookup.
o	 Use JSON Query for returning arrays.
o	Utilize JSON Table to flatten JSON arrays into relational views.
 */
export async function readByDotNotation(
	columns: string[],
	where?: { col: string; value: string; isString?: boolean }
) {
	const connection = await getConnection();
	let binds = [];
	try {
		const abbr = db.charAt(0).toLocaleLowerCase();
		const dotQuery =
			columns.length > 0
				? columns.map((col) => {
					const splitted = col.split(".");
					const last = splitted[splitted.length -1 ];
					const cappedCol = splitted.map( col => cap(col)).join(".")
					return `'${cap(col)}' value ${abbr}.json_data.${cappedCol}`
				}).join(", ")
				: "json_data";

		let sql = `SELECT JSON_OBJECT(${dotQuery}) as json_data from ${db} ${abbr} `;
		if (where) {
			const operator = where.isString ? "LIKE" : "=";
			sql += `WHERE ${db}.json_data.${cap(where.col)} ${operator} :whereValue `;
			binds.push(where.value);
		}
		console.log("Generated SQL:", sql);

		const result = await connection.execute(sql, binds, {
			outFormat: oracledb.OUT_FORMAT_OBJECT,
		});
		return result;
	} catch (error) {
		console.error(error);
		throw error;
	} finally {
		await connection.close();
	}
}

export async function readByJsonQuery(
	columns: string[],
	where?: { col: string; value: string; isString?: boolean }
) {
	const connection = await getConnection();
	try {
		// const abbr = db.charAt(0).toLowerCase();
		let binds = [];
		const jsonQuery =
			columns.length > 0
				? columns
						.map((col) => {
							const splitted = col.split(".");
							const cappedCol = splitted.map((str) => cap(str)).join(".");
							const last = splitted[splitted.length - 1];
							return `'${cap(last)}' value json_query(json_data, '$.${cappedCol}')`;
						})
						.join(", ")
				: "json_data";

		let sql = `SELECT json_object(${jsonQuery}) as json_data from ${db} `;

		if (where) {
			const operator = where.isString ? "LIKE" : "=";
			const cappedWhereCol = where.col
				.split(".")
				.map((str) => cap(str))
				.join(".");
			sql += `WHERE json_data.${cappedWhereCol} ${operator} :whereValue `;
			binds.push(where.value);
		}
		console.log("Generated SQL:", sql);
		const result = await connection.execute(sql, binds, {
			outFormat: oracledb.OUT_FORMAT_OBJECT,
		});
		console.log(`Read with JSON_QUERY: ${result.rows?.length} rows.`);
		return result;
	} catch (error) {
		console.error(error);
		throw error;
	} finally {
		await connection.close();
	}
}

export async function update(id: number, data: Housing) {
	const connection = await getConnection();
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
	const connection = await getConnection();
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
