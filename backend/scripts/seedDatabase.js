import fs from "fs";
import path from "path";
import csvParser from "csv-parser";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { City } from "../src/models/city.model.js";

dotenv.config();

// --- Step 1: Slug Generator ---
const generateSlug = (city, country) => {
    return `${city}-${country}`
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-")        // spaces → hyphens
        .replace(/[^a-z0-9-]/g, ""); // remove anything that is not a letter, number, or hyphen
};

// --- Step 2: Read CSV and build documents array ---
const loadCitiesFromCSV = () => {
    return new Promise((resolve, reject) => {
        const cityDocs = [];

        fs.createReadStream(path.resolve("scripts/data/cities.csv"))
            .pipe(csvParser())
            .on("data", (row) => {

                // Map CSV column names to your schema field names
                // ⚠️ Replace the strings below with your actual CSV column headers
                const doc = {
                    name: row["City"],
                    country: row["Country"],
                    slug: generateSlug(row["City"], row["Country"]),
                    rentMonthly: parseFloat(row["Average_Monthly_Rent_USD"]) || 0,
                    mealCheap: parseFloat(row["Food_Cost_Index"]) || 0,
                    groceriesMonthly: parseFloat(row["Transport_Cost_Index"]) || 0,
                    transport: parseFloat(row["Internet_Cost_USD"]) || 0,
                    qualityOfLife: parseFloat(row["Quality_of_Life_Index"]) || 0,
                    safetyIndex: parseFloat(row["Safety_Index"]) || 0,
                    healthcareIndex: parseFloat(row["Healthcare_Index"]) || 0,
                    pollutionIndex: parseFloat(row["Pollution_Index"]) || 0,
                };

                cityDocs.push(doc);
            })
            .on("end", () => resolve(cityDocs))
            .on("error", (err) => reject(err));
    });
};

// --- Step 3: Connect, wipe, and insert ---
const seed = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("MongoDB connected");

        const cityDocs = await loadCitiesFromCSV();
        console.log(`CSV read complete. ${cityDocs.length} cities found.`);

        await City.deleteMany({});
        console.log("Old data wiped.");

        const result = await City.insertMany(cityDocs, { ordered: false }).catch((err) => {
            if (err.code === 11000) {
                console.warn(`Duplicate slugs skipped. Inserted: ${err.result.nInserted} cities.`);
                return null;
            }
            throw err; // re-throw if it's a different error
        });

        if (result) {
            console.log(`Successfully inserted ${cityDocs.length} cities.`);
        }

    } catch (error) {
        console.error("Seeding failed:", error.message);
        process.exit(1);
    } finally {
        await mongoose.disconnect();
        console.log("MongoDB disconnected. Seeder done.");
    }
};

seed();