const db = require('./db');

// ✅ Add new shop
function addShop(shop, callback) {
  const { shop_name, logo_url, address, theme_color, email, phone } = shop;
  const sql = `INSERT INTO shops (shop_name, logo_url, address, theme_color, email, phone)
               VALUES (?, ?, ?, ?, ?, ?)`;
  db.run(sql, [shop_name, logo_url, address, theme_color, email, phone], function (err) {
    if (err) return callback(err);
    callback(null, { id: this.lastID });
  });
}

// ✅ Get all shops
function getShops(callback) {
  db.all(`SELECT * FROM shops`, [], (err, rows) => {
    if (err) return callback(err);
    callback(null, rows);
  });
}

// ✅ Get shop by ID
function getShopById(id, callback) {
  const sql = `SELECT * FROM shops WHERE id = ?`;
  db.get(sql, [id], (err, row) => {
    if (err) return callback(err);
    callback(null, row);
  });
}

// ✅ Update shop
function updateShop(id, shop, callback) {
  const { shop_name, logo_url, address, theme_color, email, phone } = shop;
  const sql = `UPDATE shops SET shop_name = ?, logo_url = ?, address = ?, theme_color = ?, email = ?, phone = ? WHERE id = ?`;
  db.run(sql, [shop_name, logo_url, address, theme_color, email, phone, id], function (err) {
    if (err) return callback(err);
    callback(null, { changes: this.changes });
  });
}

// ✅ Delete shop
function deleteShop(id, callback) {
  const sql = `DELETE FROM shops WHERE id = ?`;
  db.run(sql, [id], function (err) {
    if (err) return callback(err);
    callback(null, { changes: this.changes });
  });
}

// ✅ Get only the theme color
function getThemeColor(callback) {
  const sql = `SELECT theme_color FROM shops LIMIT 1`; // assumes one main shop
  db.get(sql, [], (err, row) => {
    if (err) return callback(err);
    callback(null, row ? row.theme_color : null);
  });
}

module.exports = {
  addShop,
  getShops,
  getShopById,
  updateShop,
  deleteShop,
  getThemeColor
};
