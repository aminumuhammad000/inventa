const shopDB = require('../database/db');

module.exports = {
  addShop: (shop, callback) => {
    const sql = `INSERT INTO shops (shop_name, logo_url, address, theme_color, email, phone) 
                 VALUES (?, ?, ?, ?, ?, ?)`;
    db.run(sql, [
      shop.shop_name,
      shop.logo_url,
      shop.address,
      shop.theme_color,
      shop.email,
      shop.phone
    ], function (err) {
      if (err) callback(err);
      else callback(null, { id: this.lastID });
    });
  },

  getShops: (callback) => {
    db.all(`SELECT * FROM shops`, [], (err, rows) => callback(err, rows));
  },

  getShopById: (id, callback) => {
    db.get(`SELECT * FROM shops WHERE id = ?`, [id], (err, row) => callback(err, row));
  },

  updateShop: (id, shop, callback) => {
    const sql = `UPDATE shops SET shop_name=?, logo_url=?, address=?, theme_color=?, email=?, phone=? WHERE id=?`;
    db.run(sql, [
      shop.shop_name,
      shop.logo_url,
      shop.address,
      shop.theme_color,
      shop.email,
      shop.phone,
      id
    ], function (err) {
      if (err) callback(err);
      else callback(null, { changes: this.changes });
    });
  },

  deleteShop: (id, callback) => {
    db.run(`DELETE FROM shops WHERE id=?`, [id], function (err) {
      if (err) callback(err);
      else callback(null, { changes: this.changes });
    });
  },

  getThemeColor: (callback) => {
    db.get(`SELECT theme_color FROM shops LIMIT 1`, [], (err, row) => callback(err, row?.theme_color));
  }
};
