import jsonData from "../data/ab_housing_starts_by_municipality.json";
import { insertBulk, readAll } from "./orcl";


export async function seed() {

	    try {
        console.log("Checking if table is empty...");
        
        // Check if table has any data
        const existingData = await readAll();
        
        if (existingData.rows && existingData.rows.length > 0) {
            console.log(`Table already contains ${existingData.rows.length} records. Skipping seed.`);
            return;
        }
        
        console.log("Table is empty. Starting seed process...");
        console.log(`Preparing to insert ${jsonData.length} records...`);
        
        await insertBulk(jsonData);
        console.log("Seed completed successfully!");
        
    } catch (error) {
        console.error("Seed failed:", error);
        throw error;
    }
}

seed();
