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
import { cap } from "./utils";

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
		const sql = `SELECT JSON_SERIALIZE(json_data PRETTY) from ${db}`;
		const result = await connection.execute(sql);
		const rows = result.rows?.map((r: any) => JSON.parse(r));
		console.dir(rows, { depth: null });
		console.log(`Read: ${result.rows?.length} rows.`);
		return rows;
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
		const sql = `SELECT JSON_SERIALIZE(json_data) from ${db} WHERE id = :id`;
		const result = await connection.execute(sql, [id], {
			outFormat: oracledb.OUT_FORMAT_OBJECT,
		});

		const rows = result.rows?.map((r: any) => JSON.parse(r));
		console.log(`Read: ${rows}.`);
		console.log(`Read: ${result.rowsAffected} rows.`);
		return rows;
	} catch (error) {
		console.error("Read by Id failed: " + error);
		throw error;
	} finally {
		await connection.close();
	}
}

/**
 * 
o [x]	Use dot-notation for simple lookup.
o	[x] Use JSON Query for returning arrays.
o	Utilize JSON Table to flatten JSON arrays into relational views.
 */
export async function readSingleByDotNotation(
	columns: string[],
	where: { col: string; value: string; isString?: boolean }
) {
	const result = await readByDotNotation(columns, { ...where, limit: 1 });
	if (result?.length) {
		return result[0];
	}
	return null;
}
export async function readByDotNotation(
	columns: string[],
	where?: { col: string; value: string; isString?: boolean; limit?: number }
) {
	const connection = await oracledb.getConnection(credentials);
	let binds = [];
	try {
		const abbr = db.charAt(0).toLocaleLowerCase();
		const dotQuery =
			columns.length > 0
				? columns
						.map((col) => {
							const splitted = col.split(".");
							const last = splitted[splitted.length - 1];
							const cappedCol = splitted.map((col) => cap(col)).join(".");
							// return `'${cap(last)}' value ${abbr}.json_data.${cappedCol}`
							return `${abbr}.json_data.${cappedCol} as "${cap(last)}"`;
						})
						.join(", ")
				: "JSON_SERIALIZE(json_data PRETTY) as json_data";

		// let sql = `SELECT JSON_OBJECT(${dotQuery}) as json_data from ${db} ${abbr} `;
		let sql = `SELECT ${dotQuery} from ${db} ${abbr} `;
		if (where) {
			const operator = where.isString ? "LIKE" : "=";
			const cappedWhereCol = where.col
				.split(".")
				.map((str) => cap(str))
				.join(".");
			sql += ` WHERE JSON_VALUE(${abbr}.json_data, '$.${cappedWhereCol}') ${operator} :whereValue`;
			binds.push(where.value);

			if (where.limit) {
				sql += `Fetch first ${where.limit} rows only`;
			}
		}

		console.log("Generated SQL:", sql);

		const result = await connection.execute(sql, binds, {
			outFormat: oracledb.OUT_FORMAT_OBJECT,
		});
		const rows = result.rows?.map((row: any) => {
			const parsed: any = {};
			for (const key in row) {
				try {
					parsed[key] = JSON.parse(row[key]);
				} catch {
					parsed[key] = row[key];
				}
			}
			return columns.length > 0 ? parsed : parsed["JSON_DATA"];
		});
		return rows;
	} catch (error) {
		console.error(error);
		throw error;
	} finally {
		await connection.close();
	}
}

export async function flattenJsonArray(
	arrayPath: string,
	columns: { name: string; type: string; path: string }[]
) {
	const connection = await oracledb.getConnection(credentials);
	try {
		const jtCols = columns
			.map((col) => `${col.name} ${col.type} PATH '${col.path}'`)
			.join(",\n\t\t\t\t");

		const sql = `
            SELECT
                t.id,
                jt.*
            FROM ${db} t,
                JSON_TABLE(
                    t.json_data,
                    '$.${arrayPath}[*]'
                    COLUMNS (
                        ${jtCols}
                    )
                ) jt
        `;

		const result = await connection.execute(sql, [], {
			outFormat: oracledb.OUT_FORMAT_OBJECT,
		});
		return result.rows;
	} catch (error) {
		console.error("Flatten JSON Array failed: " + error);
		throw error;
	} finally {
		await connection.close();
	}
}

export async function readByJsonQuery(
	columns: string[],
	where?: { col: string; value: string; isString?: boolean }
) {
	const connection = await oracledb.getConnection(credentials);
	try {
		const abbr = db.charAt(0).toLowerCase();
		let binds = [];
		const jsonQuery =
			columns.length > 0
				? columns
						.map((col) => {
							const splitted = col.split(".");
							const cappedCol = splitted.map((str) => cap(str)).join(".");
							const last = splitted[splitted.length - 1];
							// return `'${cap(last)}' value json_query(json_data, '$.${cappedCol}')`;
							return `json_query(json_data, '$.${cappedCol}') as "${cap(
								last
							)}"`;
							// return `JSON_QUERY(JSON_QUERY(json_data, '$.Dimensions')) as "${cap(last)}"`;
						})
						.join(", ")
				: "JSON_QUERY(json_data, '$') as json_data ";

		// let sql = `SELECT json_object(${jsonQuery}) as json_data from ${db} ${abbr} `;
		let sql = `SELECT ${jsonQuery} from ${db} ${abbr} `;

		if (where) {
			const operator = where.isString ? "LIKE" : "=";
			const cappedWhereCol = where.col
				.split(".")
				.map((str) => cap(str))
				.join(".");
			sql += ` WHERE JSON_VALUE(json_data, '$.${cappedWhereCol}') ${operator} :whereValue`;
			binds.push(where.value);
		}
		console.log("Generated SQL:", sql);

		const result = await connection.execute(sql, binds, {
			outFormat: oracledb.OUT_FORMAT_OBJECT,
		});

		const rows = result.rows?.map((row: any) => {
			const parsed: any = {};
			for (const key in row) {
				try {
					parsed[key] = JSON.parse(row[key]);
				} catch {
					parsed[key] = row[key];
				}
			}
			return columns.length > 0 ? parsed : parsed["JSON_DATA"];
		});

		console.log(`Read with JSON_QUERY: ${result.rows?.length} rows.`);
		return rows;
	} catch (error) {
		console.error(error);
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
