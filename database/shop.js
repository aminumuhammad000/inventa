const db = require("../database/db");

module.exports = {
  addShop: (shop) => {
    const stmt = db.prepare(`
      INSERT INTO shops (shop_name, logo_url, address, theme_color, email, phone) 
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const info = stmt.run(
      shop.shop_name,
      shop.logo_url,
      shop.address,
      shop.theme_color,
      shop.email,
      shop.phone
    );
    return { id: info.lastInsertRowid };
  },

  getShopById: (id) => {
    return db.prepare(`SELECT * FROM shops WHERE id = ?`).get(id);
  },

  updateShop: (id, shop) => {
    const stmt = db.prepare(`
      UPDATE shops 
      SET shop_name=?, logo_url=?, address=?, theme_color=?, email=?, phone=? 
      WHERE id=?
    `);
    const info = stmt.run(
      shop.shop_name,
      shop.logo_url,
      shop.address,
      shop.theme_color,
      shop.email,
      shop.phone,
      id
    );
    return { changes: info.changes };
  },

  getThemeColor: () => {
    const row = db.prepare(`SELECT theme_color FROM shops LIMIT 1`).get();
    return row ? row.theme_color : null;
  }
};
