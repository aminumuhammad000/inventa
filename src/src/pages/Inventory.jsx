import React, { useState, useEffect } from "react";
import "../styles/global-style.css";
import AddBoxIcon from '@mui/icons-material/AddBox';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';
import UploadIcon from '@mui/icons-material/Upload';
import CloseIcon from '@mui/icons-material/Close';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import SearchIcon from '@mui/icons-material/Search';


const getSampleInventoryData = () => ([
  {
    id: 1,
    name: "Cement",
    sku: "CEM-001",
    category_name: "Building Materials",
    current_stock: 50,
    min_stock_level: 10,
    unit: "bags",
    cost_price: 2500,
    selling_price: 3000,
    image: ""
  },
  {
    id: 2,
    name: "Iron Rod",
    sku: "IRON-002",
    category_name: "Metals",
    current_stock: 20,
    min_stock_level: 5,
    unit: "pieces",
    cost_price: 5000,
    selling_price: 6000,
    image: ""
  }
]);

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [showPurchaseForm, setShowPurchaseForm] = useState(false);
  const [editItem, setEditItem] = useState(null); // item being edited
  const [formFields, setFormFields] = useState({
    name: '',
    sku: '',
    category_name: '',
    current_stock: '',
    min_stock_level: '',
    unit: '',
    cost_price: '',
    selling_price: '',
    image: ''
  });
  const [categoryFilter, setCategoryFilter] = useState('');
  const [stockFilter, setStockFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // Load inventory from localStorage or use sample
    const saved = localStorage.getItem('inventoryData');
    if (saved) {
      setInventory(JSON.parse(saved));
    } else {
      const sample = getSampleInventoryData();
      setInventory(sample);
      localStorage.setItem('inventoryData', JSON.stringify(sample));
    }
  }, []);

  const togglePurchaseForm = () => {
    setShowPurchaseForm(v => !v);
    setEditItem(null);
    setFormFields({
      name: '', sku: '', category_name: '', current_stock: '', min_stock_level: '', unit: '', cost_price: '', selling_price: '', image: ''
    });
  };
  const closePurchaseForm = () => {
    setShowPurchaseForm(false);
    setEditItem(null);
    setFormFields({
      name: '', sku: '', category_name: '', current_stock: '', min_stock_level: '', unit: '', cost_price: '', selling_price: '', image: ''
    });
  };

  // Handle form field changes
  const handleFormChange = e => {
    const { name, value } = e.target;
    setFormFields(f => ({ ...f, [name]: value }));
  };

  // Add or update product
  const handleFormSubmit = e => {
    e.preventDefault();
    if (editItem) {
      // Edit existing
      setInventory(inv => {
        const updated = inv.map(item =>
          item.id === editItem.id ? { ...item, ...formFields, current_stock: Number(formFields.current_stock), min_stock_level: Number(formFields.min_stock_level), cost_price: Number(formFields.cost_price), selling_price: Number(formFields.selling_price) } : item
        );
        localStorage.setItem('inventoryData', JSON.stringify(updated));
        return updated;
      });
    } else {
      // Add new
      const newItem = {
        ...formFields,
        id: Date.now(),
        current_stock: Number(formFields.current_stock),
        min_stock_level: Number(formFields.min_stock_level),
        cost_price: Number(formFields.cost_price),
        selling_price: Number(formFields.selling_price)
      };
      setInventory(inv => {
        const updated = [...inv, newItem];
        localStorage.setItem('inventoryData', JSON.stringify(updated));
        return updated;
      });
    }
    closePurchaseForm();
  };

  // Edit button handler
  const handleEdit = item => {
    setEditItem(item);
    setShowPurchaseForm(true);
    setFormFields({
      name: item.name || '',
      sku: item.sku || '',
      category_name: item.category_name || '',
      current_stock: item.current_stock,
      min_stock_level: item.min_stock_level,
      unit: item.unit || '',
      cost_price: item.cost_price,
      selling_price: item.selling_price,
      image: item.image || ''
    });
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
    <div className="app-container" style={{ justifyContent: 'center', alignItems: 'flex-start', minHeight: '100vh', background: '#f8fafc' }}>
      {/* Sidebar Container */}
      <div id="sidebar-container"></div>
      {/* Main Content */}
      <main className="main-content" id="mainContent" style={{ width: '100%', display: 'flex', justifyContent: 'center', background: 'transparent', minHeight: '100vh' }}>
        {/* Header Container */}
        <div id="header-container"></div>
        {/* Content */}
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
              />
              <button className="btn-search" tabIndex={-1}>
                <SearchIcon />
              </button>
            </div>
          </div>
          {/* Add/Edit Products Form (Inline) */}
          {showPurchaseForm && (
            <>
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                background: 'rgba(30,41,59,0.25)',
                backdropFilter: 'blur(6px)',
                zIndex: 1000
              }}
                onClick={closePurchaseForm}
              />
              <div style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1001
              }}>
                <div className="form-card" style={{ maxWidth: 480, width: '100%', margin: '0 auto', boxShadow: '0 12px 48px rgba(0,0,0,0.18)', maxHeight: '90vh', overflowY: 'auto' }}>
                  <div className="form-header">
                    <h3 style={{ margin: 0 }}>{editItem ? 'Edit Product' : 'Add New Products'}</h3>
                    <button className="btn-close" onClick={closePurchaseForm} style={{ marginLeft: 16 }}>
                      <CloseIcon />
                    </button>
                  </div>
                  <form id="addProductForm" onSubmit={handleFormSubmit} style={{ padding: 24 }}>
                    <div className="form-group" style={{ textAlign: 'center' }}>
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
                        <img src={formFields.image} alt="Preview" style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, marginTop: 8, boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }} />
                      )}
                    </div>
                    <div className="form-group">
                      <label>Name</label>
                      <input name="name" value={formFields.name} onChange={handleFormChange} required />
                    </div>
                    <div className="form-group">
                      <label>SKU</label>
                      <input name="sku" value={formFields.sku} onChange={handleFormChange} />
                    </div>
                    <div className="form-group">
                      <label>Category</label>
                      <input name="category_name" value={formFields.category_name} onChange={handleFormChange} />
                    </div>
                    <div className="form-row" style={{ display: 'flex', gap: 12 }}>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label>Stock</label>
                        <input name="current_stock" type="number" value={formFields.current_stock} onChange={handleFormChange} required />
                      </div>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label>Min Stock Level</label>
                        <input name="min_stock_level" type="number" value={formFields.min_stock_level} onChange={handleFormChange} required />
                      </div>
                    </div>
                    <div className="form-row" style={{ display: 'flex', gap: 12 }}>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label>Unit</label>
                        <input name="unit" value={formFields.unit} onChange={handleFormChange} />
                      </div>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label>Cost Price</label>
                        <input name="cost_price" type="number" value={formFields.cost_price} onChange={handleFormChange} required />
                      </div>
                    </div>
                    <div className="form-row" style={{ display: 'flex', gap: 12 }}>
                      <div className="form-group" style={{ flex: 1 }}>
                        <label>Selling Price</label>
                        <input name="selling_price" type="number" value={formFields.selling_price} onChange={handleFormChange} required />
                      </div>
                    </div>
                    <button className="btn-primary" type="submit" style={{ width: '100%', marginTop: 12 }}>{editItem ? 'Update Product' : 'Add Product'}</button>
                  </form>
                </div>
              </div>
            </>
          )}
          {/* Inventory Table */}
          <div className="table-container" style={{ background: 'white', borderRadius: 16, boxShadow: '0 8px 32px rgba(0,0,0,0.08)', padding: 24, marginTop: 24 }}>
            <table className="inventory-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: 'rgba(16,185,129,0.08)' }}>
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
                      <div className="product-image" style={{ width: 48, height: 48, borderRadius: 8, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
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
                      {/* More actions (history, etc.) can be added here */}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* ...rest of the JSX structure as in HTML... */}
        </div>
      </main>
    </div>
  );
};


export default Inventory;
