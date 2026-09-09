import { seedDatabase } from "./src/lib/seed";

async function main() {
  try {
    await seedDatabase();
    console.log("Database seeded successfully!");
  } catch (err) {
    console.error("Seeding failed:", err);
  } finally {
    process.exit(0);
  }
}

main();
