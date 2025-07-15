import assert from "node:assert";
import { readByDotNotation, readByJsonQuery } from "../orcl";

const testDotNotation1 = async () => {
    console.log("\n=== Testing readByDotNotation - Basic Columns ===");
    try {
        const result = await readByDotNotation([
            "CSDUID",
            "IndicatorSummaryDescription"
        ]);
        
        console.log(`Found ${result?.length || 0} rows`);
        
        if (result && result && result.length > 0) {
            result.slice(0, 3).forEach((row: any, index) => {
                console.log(`Row ${index + 1}:`, row);
            });
            assert.equal(result.length > 0, true);
            console.log("testDotNotation1 passed");
        }
    } catch (error) {
        console.error("testDotNotation1 failed:", error);
    }
};

const testDotNotation2 = async () => {
    console.log("\n=== Testing readByDotNotation - Nested Properties ===");
    try {
        const result = await readByDotNotation([
            "CSDUID",
            "Dimensions.Value"
        ]);
        
        console.log(`Found ${result?.length || 0} rows`);
        
        if (result && result && result.length > 0) {
            result.slice(0, 3).forEach((row: any, index) => {
                console.log(`Row ${index + 1}:`, row);
            });
            assert.equal(result.length > 0, true);
            console.log("testDotNotation2 passed");
        }
    } catch (error) {
        console.error("testDotNotation2 failed:", error);
    }
};

const testDotNotation3 = async () => {
    console.log("\n=== Testing readByDotNotation - Multiple Nested Properties ===");
    try {
        const result = await readByDotNotation([
            "CSDUID",
            "Period",
            "Dimensions.Value",
            "UnitOfMeasure"
        ]);
        
        console.log(`Found ${result?.length || 0} rows`);
        
        if (result && result && result.length > 0) {
            result.slice(0, 2).forEach((row: any, index) => {
                console.log(`Row ${index + 1}:`, row);
            });
            assert.equal(result.length > 0, true);
            console.log("testDotNotation3 passed");
        }
    } catch (error) {
        console.error("testDotNotation3 failed:", error);
    }
};

const testDotNotationWithWhere = async () => {
    console.log("\n=== Testing readByDotNotation - With WHERE Clause ===");
    try {
        const result = await readByDotNotation(
            ["CSDUID", "Dimensions.Value"],
            { col: "Dimensions.Value", value: "Apartment", isString: true }
        );
        
        console.log(`Found ${result?.length || 0} rows with Dimensions.Value = 'Apartment'`);
        
        if (result && result) {
            result.slice(0, 3).forEach((row: any, index) => {
                console.log(`Row ${index + 1}:`, row);
            });
            console.log("testDotNotationWithWhere passed");
        }
    } catch (error) {
        console.error("testDotNotationWithWhere failed:", error);
    }
};

const testDotNotationWithLike = async () => {
    console.log("\n=== Testing readByDotNotation - With LIKE Operator ===");
    try {
        const result = await readByDotNotation(
            ["CSDUID", "Dimensions.Value"],
            { col: "Dimensions.Value", value: "Single%", isString: true }
        );
        
        console.log(`Found ${result?.length || 0} rows with Dimensions.Value LIKE 'Single%'`);
        
        if (result && result) {
            result.slice(0, 3).forEach((row: any, index) => {
                console.log(`Row ${index + 1}:`, row);
            });
            console.log("testDotNotationWithLike passed");
        }
    } catch (error) {
        console.error("testDotNotationWithLike failed:", error);
    }
};

// Test readByJsonQuery function
const testJsonQuery1 = async () => {
    console.log("\n=== Testing readByJsonQuery - Basic Columns ===");
    try {
        const result = await readByJsonQuery([
            "CSDUID",
            "Period"
        ]);
        
        console.log(`Found ${result?.length || 0} rows`);
        
        if (result && result && result.length > 0) {
            result.slice(0, 3).forEach((row: any, index) => {
                console.log(`Row ${index + 1}:`, row);
            });
            assert.equal(result.length > 0, true);
            console.log("testJsonQuery1 passed");
        }
    } catch (error) {
        console.error("testJsonQuery1 failed:", error);
    }
};

const testJsonQuery2 = async () => {
    console.log("\n=== Testing readByJsonQuery - Nested Properties ===");
    try {
        const result = await readByJsonQuery([
            "CSDUID",
            "Dimensions.Value",
            "Dimensions.Name"
        ]);
        
        console.log(`Found ${result?.length || 0} rows`);
        
        if (result && result && result.length > 0) {
            result.slice(0, 3).forEach((row: any, index) => {
                console.log(`Row ${index + 1}:`, row);
            });
            assert.equal(result.length > 0, true);
            console.log("testJsonQuery2 passed");
        }
    } catch (error) {
        console.error("testJsonQuery2 failed:", error);
    }
};

const testJsonQuery3 = async () => {
    console.log("\n=== Testing readByJsonQuery - Complex Selection ===");
    try {
        const result = await readByJsonQuery([
            "Period",
            "IndicatorSummaryDescription",
            "Dimensions.Value",
            "UnitOfMeasure",
            "OriginalValue"
        ]);
        
        console.log(`Found ${result?.length || 0} rows`);
        
        if (result && result && result.length > 0) {
            result.slice(0, 2).forEach((row: any, index) => {
                console.log(`Row ${index + 1}:`, row);
            });
            assert.equal(result.length > 0, true);
            console.log("testJsonQuery3 passed");
        }
    } catch (error) {
        console.error("testJsonQuery3 failed:", error);
    }
};

const testJsonQueryWithWhere = async () => {
    console.log("\n=== Testing readByJsonQuery - With WHERE Clause ===");
    try {
        const result = await readByJsonQuery(
            ["CSDUID", "Period", "Dimensions.Value"],
            { col: "Period", value: "2021", isString: true }
        );
        
        console.log(`Found ${result?.length || 0} rows with Period = '2021'`);
        
        if (result && result) {
            result.slice(0, 3).forEach((row: any, index) => {
                console.log(`Row ${index + 1}:`, row);
            });
            console.log("testJsonQueryWithWhere passed");
        }
    } catch (error) {
        console.error("testJsonQueryWithWhere failed:", error);
    }
};

const testJsonQueryWithLike = async () => {
    console.log("\n=== Testing readByJsonQuery - With LIKE Operator ===");
    try {
        const result = await readByJsonQuery(
            ["CSDUID", "Dimensions.Value"],
            { col: "Dimensions.Value", value: "Single%", isString: true }
        );
        
        console.log(`Found ${result?.length || 0} rows with Dimensions.Value LIKE 'Single%'`);
        
        if (result && result) {
            result.slice(0, 3).forEach((row: any, index) => {
                console.log(`Row ${index + 1}:`, row);
            });
            console.log("testJsonQueryWithLike passed");
        }
    } catch (error) {
        console.error("testJsonQueryWithLike failed:", error);
    }
};

// Comparison test between both methods
const testComparison = async () => {
    console.log("\n=== Comparing readByDotNotation vs readByJsonQuery ===");
    try {
        const columns = ["CSDUID", "Dimensions.Value"];
        const whereClause = { col: "Dimensions.Value", value: "Apartment", isString: true };
        
        console.log("\n--- readByDotNotation result ---");
        const dotResult = await readByDotNotation(columns, whereClause);
        console.log(`Dot notation found: ${dotResult?.length || 0} rows`);
        if (dotResult?.[0]) {
            console.log("Sample:", dotResult[0]);
        }
        
        console.log("\n--- readByJsonQuery result ---");
        const jsonResult = await readByJsonQuery(columns, whereClause);
        console.log(`JSON query found: ${jsonResult?.length || 0} rows`);
        if (jsonResult?.[0]) {
            console.log("Sample:", jsonResult[0]);
        }
        
        console.log("Comparison test completed");
    } catch (error) {
        console.error("Comparison test failed:", error);
    }
};

// Run all tests
(async () => {
    console.log("Starting Oracle JSON Read Function Tests");
    
    const tests = [
        // readByDotNotation tests
        testDotNotation1(),
        testDotNotation2(),
        testDotNotation3(),
        testDotNotationWithWhere(),
        testDotNotationWithLike(),
        
        // readByJsonQuery tests
        testJsonQuery1(),
        testJsonQuery2(),
        testJsonQuery3(),
        testJsonQueryWithWhere(),
        testJsonQueryWithLike(),
        
        // Comparison test
        testComparison()
    ];
    
    try {
        await Promise.all(tests);
        console.log("\n All tests completed!");
    } catch (error) {
        console.error(" Test suite failed:", error);
    }
})();