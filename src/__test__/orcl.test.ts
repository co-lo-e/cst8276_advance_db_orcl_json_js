import assert from "node:assert";
import { readByDotNotation } from "../orcl";

	const testDot = async () => {
		const result = await readByDotNotation([
			"CSDUID",
			"IndicatorSummaryDescription",
		]);
		console.log(Array(result).splice(0, 10))
		if (result && result.rows) {
			assert.equal(result.rows.length > 0, true);
		}
	};

	const testDot2 = async () => {
		const result = await readByDotNotation([
			"CSDUID",
			"Dimensions",
		]);
		console.log(result)
		if (result && result.rows) {
			assert.equal(result.rows.length > 0, true);
		}
	};

	const testDot3 = async () => {
		const result = await readByDotNotation([
			"CSDUID",
			"Dimensions.Value",
		]);
		console.log(result)
		if (result && result.rows) {
			assert.equal(result.rows.length > 0, true);
		}
	};

	const testDot4 = async () => {
		const result = await readByDotNotation([
			"CSDUID",
			"Dimensions.Value",
		]);

		result?.rows?.splice(0, 10).forEach( r => console.log(r?.JSON_DATA ?? ""))
		if (result && result.rows) {
			assert.equal(result.rows.length > 0, true);
		}
	};
(async() => {
  const tests = [ 
		// testDot(), testDot2(), testDot3(), 
		testDot4()];
	Promise.all(tests)
}
	
)();
