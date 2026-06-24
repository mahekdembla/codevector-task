const express=require("express");
const router=express.Router();
const pool=require("../db");

router.get("/", async (req, res) => {
  try {
    // const category = req.query.category;
    //const cursorUpdatedAt = req.query.cursorUpdatedAt;
    // const cursorId = req.query.cursorId;
    const {              
      category,                      
      cursorUpdatedAt,
      cursorId,
    } = req.query;

    const limit = Math.min(
        parseInt(req.query.limit) || 20,
         100
    );

    let query = `
      SELECT *
      FROM products
    `;

    const values = [];
    let paramIndex = 1;

    if (category) {
      query += ` WHERE category = $${paramIndex}`;
      values.push(category);
      paramIndex++;
    }

    if (cursorUpdatedAt && cursorId) {
      query += category
        ? ` AND `
        : ` WHERE `;

      query += `
        (updated_at, id)
        < ($${paramIndex}, $${paramIndex + 1})
      `;

      values.push(cursorUpdatedAt);
      values.push(cursorId);

      paramIndex += 2;
    }
    
    query += `
      ORDER BY updated_at DESC, id DESC
      LIMIT ${limit}
    `;

    const result = await pool.query(query, values);

    const products = result.rows;

    let nextCursor = null;

    if (products.length > 0) {
      const last = products[products.length - 1];

      nextCursor = {
        updated_at: last.updated_at,
        id: last.id,
      };
    }

    res.json({
      products,
      nextCursor,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Server Error",
    });
  }
});
module.exports=router;