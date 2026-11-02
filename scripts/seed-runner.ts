import { seedDatabase } from "../src/lib/seed";
import mongoose from "mongoose";

async function main() {
  console.log("Starting master seed into MongoDB:", process.env.MONGODB_URI?.split("@")[1]);
  try {
    const result = await seedDatabase();
    console.log("SEEDING COMPLETED SUCCESSFULLY!");
    console.log(JSON.stringify(result, null, 2));
  } catch (error) {
    console.error("SEEDING FAILED:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

main();
