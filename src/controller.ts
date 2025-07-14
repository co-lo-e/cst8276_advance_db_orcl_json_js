import { Request, Response } from "express";
import * as orcl from "./orcl";
import type { Housing } from "./types";

export async function createHousing(
	req: Request,
	res: Response
): Promise<void> {
	try {
		const housingData: Housing = req.body;

		if (!housingData || Object.keys(housingData).length === 0) {
			res.status(400).json({ error: "Housing data is required" });
			return;
		}

		const result = await orcl.insert(housingData);
		res.status(201).json({
			success: true,
			message: "Housing record created successfully",
			data: result,
		});
	} catch (error) {
		console.error("Create housing error:", error);
		res.status(500).json({
			error: "Failed to create housing record",
			details: error instanceof Error ? error.message : "Unknown error",
		});
	}
}

export async function createBulkHousing(req: Request, res: Response) {
	try {
		const housingData: Housing[] = req.body;

		if (!Array.isArray(housingData) || housingData.length === 0) {
			res.status(400).json({ error: "Array of housing data is required" });
			return;
		}

		const result = await orcl.insertBulk(housingData);
		res.status(201).json({
			success: true,
			message: `${housingData.length} housing records created successfully`,
			data: result,
		});
	} catch (error) {
		console.error("Bulk create housing error:", error);
		res.status(500).json({
			error: "Failed to create housing records",
			details: error instanceof Error ? error.message : "Unknown error",
		});
	}
}

export async function getAllHousing(req: Request, res: Response) {
	try {
		const result = await orcl.readAll();
		res.status(200).json({
			success: true,
			count: result.rows?.length || 0,
			data: result.rows,
		});
	} catch (error) {
		console.error("Get all housing error:", error);
		res.status(500).json({
			error: "Failed to retrieve housing records",
			details: error instanceof Error ? error.message : "Unknown error",
		});
	}
}

export async function getHousingById(req: Request, res: Response) {
	try {
		const id = parseInt(req.params.id);

		if (isNaN(id)) {
			res.status(400).json({ error: "Valid numeric ID is required" });
			return;
		}

		const result = await orcl.readById(id);

		if (!result.rows || result.rows.length === 0) {
			res.status(404).json({ error: "Housing record not found" });
			return;
		}

		res.status(200).json({
			success: true,
			data: result.rows[0],
		});
	} catch (error) {
		console.error("Get housing by ID error:", error);
		res.status(500).json({
			error: "Failed to retrieve housing record",
			details: error instanceof Error ? error.message : "Unknown error",
		});
	}
}

/**
 * select: JSON data keys
 *
 * where: JSON data key
 *
 * value: it is not wildcard supported, frontend can add % before or after the string value
 *
 * string: if it is string the operator wilk be 'LIKE', else '='
 *
 * example:
 *```sh
 * curl -X GET "http://localhost:8000/housing/dot?select=Dimension.Value,CSDUID&where=CSD&value=Red%20Deer"
 * curl -X GET "http://localhost:8000/housing/dot?select=Dimension.Value,CSDUID&where=CSD&value=Red%20Deer&string=true"
 *```
 */
export async function queryHousingByDotNotation(req: Request, res: Response) {
	try {
		const { select = [], where, value, string = false } = req.query;

		// Parse select columns
		let selectCols: string[] = [];
		if (typeof select === "string") {
			selectCols = select.split(",").map((col) => col.trim());
		} else if (Array.isArray(select)) {
			selectCols = select.map((col) => String(col).trim());
		}

		// Build where condition
		let whereCondition;
		if (where && value) {
			whereCondition = {
				col: String(where),
				value: String(value),
				isString: String(string).toLowerCase() === "true",
			};
		}

		const result = await orcl.readByDotNotation(selectCols, whereCondition);

		res.status(200).json({
			success: true,
			count: result?.rows?.length || 0,
			data: result?.rows,
		});
	} catch (error) {
		console.error("Query housing error:", error);
		res.status(500).json({
			error: "Failed to query housing records",
			details: error instanceof Error ? error.message : "Unknown error",
		});
	}
}

export async function queryByJsonQuery(req: Request, res: Response) {
	try {
		const { select = [], where, value, string = false } = req.query;

		// Parse select columns
		let selectCols: string[] = [];
		if (typeof select === "string") {
			selectCols = select.split(",").map((col) => col.trim());
		} else if (Array.isArray(select)) {
			selectCols = select.map((col) => String(col).trim());
		}

		let whereCondition;
		if (where && value) {
			whereCondition = {
				col: String(where),
				value: String(value),
				isString: String(string).toLowerCase() === "true",
			};
		}

		const result = await orcl.readByJsonQuery(selectCols, whereCondition);

		res.status(200).json({
			success: true,
			count: result?.rows?.length || 0,
			data: result?.rows,
		});
	} catch (error) {
		console.error("Query housing error:", error);
		res.status(500).json({
			error: "Failed to query housing records",
			details: error instanceof Error ? error.message : "Unknown error",
		});
	}
}

// Update housing record by ID
export async function updateHousing(req: Request, res: Response) {
	try {
		const id = parseInt(req.params.id);
		const housingData: Housing = req.body;

		if (isNaN(id)) {
			res.status(400).json({ error: "Valid numeric ID is required" });
			return;
		}

		if (!housingData || Object.keys(housingData).length === 0) {
			res.status(400).json({ error: "Housing data is required" });
			return;
		}

		const result = await orcl.update(id, housingData);

		if (result.rowsAffected === 0) {
			res.status(404).json({ error: "Housing record not found" });
			return;
		}

		res.status(200).json({
			success: true,
			message: "Housing record updated successfully",
			data: result,
		});
	} catch (error) {
		console.error("Update housing error:", error);
		res.status(500).json({
			error: "Failed to update housing record",
			details: error instanceof Error ? error.message : "Unknown error",
		});
	}
}

// Delete housing record by ID
export async function deleteHousing(req: Request, res: Response) {
	try {
		const id = parseInt(req.params.id);

		if (isNaN(id)) {
			res.status(400).json({ error: "Valid numeric ID is required" });
			return;
		}

		const result = await orcl.deleteById(id);

		if (result.rowsAffected === 0) {
			res.status(404).json({ error: "Housing record not found" });
			return;
		}

		res.status(200).json({
			success: true,
			message: "Housing record deleted successfully",
			data: result,
		});
	} catch (error) {
		console.error("Delete housing error:", error);
		res.status(500).json({
			error: "Failed to delete housing record",
			details: error instanceof Error ? error.message : "Unknown error",
		});
	}
}
