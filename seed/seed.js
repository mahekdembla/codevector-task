const { faker } = require("@faker-js/faker");
const pool = require("../src/db");

const TOTAL_PRODUCTS = 200000;
const BATCH_SIZE = 1000;

const categories = [
  "Electronics",
  "Books",
  "Clothing",
  "Home",
  "Sports"
];

async function seed() {
  try {
    const totalBatches = TOTAL_PRODUCTS / BATCH_SIZE;

    for (let batch = 0; batch < totalBatches; batch++) {
      const values = [];

      for (let i = 0; i < BATCH_SIZE; i++) {
        const name = faker.commerce.productName().replace(/'/g, "''");

        const category =
          categories[Math.floor(Math.random() * categories.length)];

        const price = faker.commerce.price();

        const createdAt = faker.date.past().toISOString();
        const updatedAt = faker.date.recent().toISOString();

        values.push(
          `('${name}',
            '${category}',
            ${price},
            '${createdAt}',
            '${updatedAt}')`
        );
      }

      const query = `
        INSERT INTO products
        (name, category, price, created_at, updated_at)
        VALUES ${values.join(",")}
      `;

      await pool.query(query);

      console.log(
        `Batch ${batch + 1}/${totalBatches} inserted`
      );
    }

    console.log("✅ 200000 products inserted successfully");

    process.exit();
  } catch (err) {
    console.error("❌ Error seeding:", err);
    process.exit(1);
  }
}

seed();