import React, { useState, useEffect } from "react";
import "../styles/global-style.css";
import AddBoxIcon from '@mui/icons-material/AddBox';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SearchIcon from '@mui/icons-material/Search';


// At the top of your component
const { productAPI } = window;

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [editItem, setEditItem] = useState(null); // item being edited
  const [formFields, setFormFields] = useState({
    name: '',
    discount: '',
    category_name: '',
    current_stock: '',
    unit: '',
    cost_price: '',
    selling_price: '',
    image: ''
  });
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

useEffect(() => {
  const fetchProducts = async () => {
    try {
      const products = await productAPI.getAllProducts();
      setInventory(products);
    } catch (err) {
      console.error("Failed to load inventory:", err);
    }
  };
  fetchProducts();
}, []);


  const togglePurchaseForm = () => {
    setShowPurchaseForm(v => !v);
    setEditItem(null);
    setFormFields({
      name: '', discount: '', category_name: '', current_stock: '', unit: '', cost_price: '', selling_price: '', image: ''
    });
  };
  const closePurchaseForm = () => {
    setShowPurchaseForm(false);
    setEditItem(null);
    setFormFields({
      name: '', discount: '', category_name: '', current_stock: '',  unit: '', cost_price: '', selling_price: '', image: ''
    });
  };

  // Handle form field changes
  const handleFormChange = e => {
    const { name, value } = e.target;
    setFormFields(f => ({ ...f, [name]: value }));
  };

  // Add or update product
const handleFormSubmit = async (e) => {
  e.preventDefault();

  try {
    if (editItem) {
      // Update existing
      await productAPI.updateProduct(editItem.id, {
        ...formFields,
        current_stock: Number(formFields.current_stock),
        min_stock_level: Number(formFields.min_stock_level),
        cost_price: Number(formFields.cost_price),
        selling_price: Number(formFields.selling_price)
      });
    } else {
      // Add new
      await productAPI.addProduct({
        ...formFields,
        current_stock: Number(formFields.current_stock),
        min_stock_level: Number(formFields.min_stock_level),
        cost_price: Number(formFields.cost_price),
        selling_price: Number(formFields.selling_price)
      });
    }

    // Refresh inventory from DB
    const products = await productAPI.getAllProducts();
    setInventory(products);
    closePurchaseForm();
  } catch (err) {
    console.error("Failed to save product:", err);
  }
};

const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this product?")) return;

  try {
    await productAPI.deleteProduct(id);
    const products = await productAPI.getAllProducts();
    setInventory(products);
  } catch (err) {
    console.error("Failed to delete product:", err);
  }
};

const searchInventory = async (keyword) => {
  try {
    const results = await productAPI.searchProducts(keyword);
    setInventory(results);
  } catch (err) {
    console.error("Search failed:", err);
  }
};

  // Table rendering helpers
  const getStockStatusClass = (current, min) => {
    if (current === 0) return 'out-of-stock';
    if (current <= min) return 'low-stock';
    return 'normal-stock';
  };
  const getStockStatus = (current, min) => {
    if (current === 0) return 'Out of Stock';
    if (current <= min) return 'Low Stock';
    return 'In Stock';
  };

  // Get unique categories for filter dropdown
  const categories = Array.from(new Set(inventory.map(item => item.category_name || 'Uncategorized')));

  // Filtering logic
  const filteredInventory = inventory.filter(item => {
    // Category filter
    if (categoryFilter && item.category_name !== categoryFilter) return false;
    // Stock filter
    if (stockFilter) {
      if (stockFilter === 'low' && !(item.current_stock <= item.min_stock_level && item.current_stock > 0)) return false;
      if (stockFilter === 'out' && item.current_stock !== 0) return false;
      if (stockFilter === 'normal' && !(item.current_stock > item.min_stock_level)) return false;
    }
    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      if (!(
        item.name.toLowerCase().includes(term) ||
        (item.sku && item.sku.toLowerCase().includes(term)) ||
        (item.category_name && item.category_name.toLowerCase().includes(term))
      )) return false;
    }
    return true;
  });

  return (
    <>
      <main>
  
        <div className="content" style={{ maxWidth: 1100, width: '100%', margin: '32px auto', padding: '0 24px 48px 24px', background: 'white', borderRadius: 20, boxShadow: '0 8px 32px rgba(0,0,0,0.06)' }}>
          {/* Actions */}
          <div className="actions-bar">
            <button className="btn-primary" onClick={togglePurchaseForm}>
              <AddBoxIcon />
              Add Products
            </button>
            {/* ...other action buttons... */}
          </div>
          {/* Filters Bar */}
          <div className="filters-bar">
            <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
              <option value="">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <select value={stockFilter} onChange={e => setStockFilter(e.target.value)}>
              <option value="">All Stock</option>
              <option value="normal">In Stock</option>
              <option value="low">Low Stock</option>
              <option value="out">Out of Stock</option>
            </select>
            <div className="search-box">
              <input
                type="text"
                placeholder="Search by name, SKU, or category..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <button className="btn-search" 
              tabIndex={-1}
              onClick={() => searchInventory(searchTerm)}>
                <SearchIcon />
              </button>
            </div>
          </div>
          {/* Add/Edit Products Form (Inline) */}
          {showPurchaseForm && (
            <>
              <div className="" onClick={closePurchaseForm} />
              <div className="main-container">
                <div className="form-card">
                  <div className="form-header">
                    <h3>{editItem ? 'Edit Product' : 'Add New Products'}</h3>
                    <button className="btn-close" onClick={closePurchaseForm}>
                      <CloseIcon />
                    </button>
                  </div>
                  <form onSubmit={handleFormSubmit}>
                    <div className="form-group">
                      <label>Product Image</label>
                      <input type="file" accept="image/*" onChange={e => {
                        const file = e.target.files[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = ev => setFormFields(f => ({ ...f, image: ev.target.result }));
                          reader.readAsDataURL(file);
                        }
                      }} />
                      {formFields.image && (
                        <img src={formFields.image} alt="Preview" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, marginTop: 8 }} />
                      )}
                    </div>

                    <div className="form-group-container">
                    <div className="form-group">
                      <label>Name</label>
                      <input name="name" value={formFields.name} onChange={handleFormChange} required placeholder="Product Name"/>
                    </div>
                    <div className="form-group">
                      <label>Category</label>
                      <input name="category_name" value={formFields.category_name} onChange={handleFormChange} placeholder="Product Category" />
                    </div>
                    
                      <div className="form-group">
                        <label>Quantity</label>
                        <input name="current_stock" type="number" value={formFields.current_stock} onChange={handleFormChange} required placeholder="Quantity of Product" />
                      </div>
                    </div>
 
                    <div className="form-group-container">
                      <div className="form-group" style={{ flex: 1 }}>
                        <label>Discount</label>
                        <input name="unit" value={formFields.unit} onChange={handleFormChange} placeholder="Discount Price"/>
                      </div>

                      <div className="form-group" style={{ flex: 1 }}>
                        <label>Selling Price</label>
                        <input name="selling_price" type="number" value={formFields.selling_price} onChange={handleFormChange} required />
                      </div>

                        <div className="form-group" style={{ flex: 1 }}>
                        <label>Cost Price</label>
                        <input name="cost_price" type="number" value={formFields.cost_price} onChange={handleFormChange} required placeholder="Cost Price"/>
                      </div>

                      </div>
                  
                    <button className="btn-primary" type="submit">{editItem ? 'Update Product' : 'Add Product'}</button>
                  </form>
                </div>
              </div>
            </>
          )}
          {/* Inventory Table */}
          <div className="table-container" style={{ background: 'white', borderRadius: 16, padding: 24, marginTop: 24 }}>
            <table className="inventory-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>Image</th>
                  <th>Name</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Stock</th>
                  <th>Unit</th>
                  <th>Cost Price</th>
                  <th>Selling Price</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map(item => (
                  <tr key={item.id} style={{ transition: 'background 0.2s', cursor: 'pointer' }}
                    onMouseOver={e => e.currentTarget.style.background = 'rgba(16,185,129,0.06)'}
                    onMouseOut={e => e.currentTarget.style.background = ''}
                  >
                    <td className="product-image-cell">
                      <div className="product-image" style={{ width: 48, height: 48, borderRadius: 8, overflow: 'hidden' }}>
                        <img src={item.image || 'https://via.placeholder.com/80x80?text=No+Image'} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.src = 'https://via.placeholder.com/80x80?text=No+Image'} />
                      </div>
                    </td>
                    <td>{item.name}</td>
                    <td>{item.sku || 'N/A'}</td>
                    <td>{item.category_name || 'Uncategorized'}</td>
                    <td className={`stock-cell ${getStockStatusClass(item.current_stock, item.min_stock_level)}`}>{item.current_stock}</td>
                    <td>{item.unit}</td>
                    <td>₦{parseFloat(item.cost_price).toFixed(2)}</td>
                    <td>₦{parseFloat(item.selling_price).toFixed(2)}</td>
                    <td>
                      <span className={`status-badge ${getStockStatusClass(item.current_stock, item.min_stock_level)}`}>
                        {getStockStatus(item.current_stock, item.min_stock_level)}
                      </span>
                    </td>
                    <td>
                      <button className="btn-icon" title="Edit" onClick={() => handleEdit(item)} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: 6, borderRadius: 6, transition: 'background 0.2s' }}
                        onMouseOver={e => e.currentTarget.style.background = 'rgba(16,185,129,0.12)'}
                        onMouseOut={e => e.currentTarget.style.background = 'none'}
                      >
                        <EditIcon />
                      </button>
                    
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
};


export default Inventory;
