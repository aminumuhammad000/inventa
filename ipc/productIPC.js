const { ipcMain } = require("electron");
const productDB = require("../database/product"); // adjust path if needed

// ✅ Add Product
ipcMain.handle("add-product", (event, product) => {
  return productDB.addProduct(product);
});

// ✅ Get Product by ID
ipcMain.handle("get-product", (event, id) => {
  return productDB.getProductById(id);
});

// ✅ Get All Products
ipcMain.handle("get-all-products", () => {
  return productDB.getAllProducts();
});

// ✅ Update Product
ipcMain.handle("update-product", (event, { id, product }) => {
  return productDB.updateProduct(id, product);
});

// ✅ Delete Product
ipcMain.handle("delete-product", (event, id) => {
  return productDB.deleteProduct(id);
});

// ✅ Search Products
ipcMain.handle("search-products", (event, keyword) => {
  return productDB.searchProducts(keyword);
});

// ✅ Update Status
ipcMain.handle("update-status", (event, { id, status }) => {
  return productDB.updateStatus(id, status);
});

// ✅ Low Stock
ipcMain.handle("get-low-stock", (event, threshold) => {
  return productDB.getLowStock(threshold);
});

// ✅ Count Low Stock
ipcMain.handle("count-low-stock", (event, threshold) => {
  return productDB.countLowStock(threshold);
});

// ✅ Total Products
ipcMain.handle("get-total-products", () => {
  return productDB.getTotalProducts();
});

// ✅ Some Products (limit preview)
ipcMain.handle("get-some-products", (event, limit) => {
  return productDB.getSomeProducts(limit);
});
