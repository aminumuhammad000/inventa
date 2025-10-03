const db = require("../database/db");

module.exports = {
  // Add new product
addProduct: (product) => {
  const stmt = db.prepare(`
    INSERT INTO products (name, image, price, quantity, category, status, unit_price, discount, cost_price)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  const info = stmt.run(
    product.name,
    product.image || null,
    product.selling_price,            // map selling_price -> price
    product.current_stock,            // map current_stock -> quantity
    product.category_name || null,    // map category_name -> category
    product.status || "active",
    product.unit || null,             // map unit -> unit_price (⚠️ maybe wrong meaning)
    product.discount || null,
    product.cost_price || null
  );
  return { id: info.lastInsertRowid };
},


  // Get product by ID
  getProductById: (id) => {
    return db.prepare(`SELECT * FROM products WHERE id = ?`).get(id);
  },

  // Get all products
  getAllProducts: () => {
    return db.prepare(`SELECT * FROM products ORDER BY date_time DESC`).all();
  },

  // Update product by ID
  updateProduct: (id, product) => {
    const stmt = db.prepare(`
      UPDATE products
      SET name=?, image=?, price=?, quantity=?, category=?, status=?, unit_price=?, discount=?
      WHERE id=?
    `);
    const info = stmt.run(
      product.name,
      product.image || null,
      product.price,
      product.quantity,
      product.category || null,
      product.status || "active",
      product.unit_price || null,
      product.discount || null,
      id
    );
    return { changes: info.changes };
  },

  // Delete product by ID
  deleteProduct: (id) => {
    const stmt = db.prepare(`DELETE FROM products WHERE id = ?`);
    const info = stmt.run(id);
    return { changes: info.changes };
  },

  // Search products by name or category
  searchProducts: (keyword) => {
    return db
      .prepare(
        `SELECT * FROM products 
         WHERE name LIKE ? OR category LIKE ?
         ORDER BY date_time DESC`
      )
      .all(`%${keyword}%`, `%${keyword}%`);
  },

  // Update product status (sold, returned, active)
  updateStatus: (id, status) => {
    const stmt = db.prepare(`UPDATE products SET status=? WHERE id=?`);
    const info = stmt.run(status, id);
    return { changes: info.changes };
  },

  // Get low stock products
  getLowStock: (threshold = 5) => {
    return db.prepare(`SELECT * FROM products WHERE quantity <= ?`).all(threshold);
  },

    // Count how many products are low stock
  countLowStock: (threshold = 5) => {
    const row = db.prepare(`
      SELECT COUNT(*) as total 
      FROM products 
      WHERE quantity <= ?
    `).get(threshold);
    return row ? row.total : 0;
  },


  // Get total products count
  getTotalProducts: () => {
    const row = db.prepare(`SELECT COUNT(*) as total FROM products`).get();
    return row ? row.total : 0;
  },

    // Get a limited list of products (default 3, or user choice)
  getSomeProducts: (limit = 3) => {
    return db.prepare(`
      SELECT * FROM products 
      ORDER BY date_time DESC 
      LIMIT ?
    `).all(limit);
  },

};
