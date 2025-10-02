import React, { useState, useEffect } from "react";
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import UndoIcon from '@mui/icons-material/Undo';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import CloseIcon from '@mui/icons-material/Close';
import PrintIcon from '@mui/icons-material/Print';
import DownloadIcon from '@mui/icons-material/Download';
import ShareIcon from '@mui/icons-material/Share';
import EmailIcon from '@mui/icons-material/Email';

const Sales = () => {
  // State management
  const [saleType, setSaleType] = useState('normal');
  const [search, setSearch] = useState('');
  const [brand, setBrand] = useState('all');
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [showInvoice, setShowInvoice] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [qtyInputs, setQtyInputs] = useState({});
  const [lastSale, setLastSale] = useState(null);

  // Sample products data
  const [products, setProducts] = useState([
    {
      id: 1,
      name: "Cement",
      brand: "Dangote",
      category: "Building Materials",
      stock: 50,
      unit: "bags",
      price: 3000,
      image: ""
    },
    {
      id: 2,
      name: "Iron Rod",
      brand: "Steel Works",
      category: "Metals",
      stock: 20,
      unit: "pieces",
      price: 6000,
      image: ""
    },
    {
      id: 3,
      name: "Paint",
      brand: "Dulux",
      category: "Paints",
      stock: 30,
      unit: "liters",
      price: 4500,
      image: ""
    }
  ]);

  const brands = [
    "Dangote", "Lafarge", "Steel Works", "Dulux", "Berger", "Premium Sand", "Hardware Pro", "AquaFlow"
  ];

  // Filter products based on search and brand
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase()) ||
                         product.brand.toLowerCase().includes(search.toLowerCase()) ||
                         product.category.toLowerCase().includes(search.toLowerCase());
    const matchesBrand = brand === 'all' || product.brand === brand;
    return matchesSearch && matchesBrand;
  });

  // Handle adding product to cart
  const handleAddToCart = (product) => {
    let qty = Number(qtyInputs[product.id]);
    if (!qty || qty < 1) qty = 1;
    if (qty > product.stock) qty = product.stock;
    const existingItem = cart.find(item => item.productId === product.id);
    if (existingItem) {
      setCart(cart.map(item =>
        item.productId === product.id
          ? { ...item, qty: Math.min(item.qty + qty, product.stock) }
          : item
      ));
    } else {
      setCart([...cart, { productId: product.id, qty }]);
    }
    setQtyInputs(inputs => ({ ...inputs, [product.id]: '' }));
  };

  // Handle editing cart quantity
  const handleEditCartQty = (productId, newQty) => {
    if (newQty <= 0) {
      handleRemoveFromCart(productId);
    } else {
      setCart(cart.map(item => 
        item.productId === productId 
          ? { ...item, qty: newQty }
          : item
      ));
    }
  };

  // Handle removing from cart
  const handleRemoveFromCart = (productId) => {
    setCart(cart.filter(item => item.productId !== productId));
  };

  // Handle marking as sold
  const handleMarkSold = () => {
    const saleItems = cart.map(item => {
      const product = products.find(p => p.id === item.productId);
      return {
        name: product.name,
        qty: item.qty,
        price: product.price,
        total: item.qty * product.price
      };
    });
    const sale = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      items: saleItems,
      customer: customerName,
      discount,
      tax,
      invoiceNumber: `INV-${Date.now()}`
    };
    setLastSale(sale);
    setShowCart(false);
    setShowInvoice(true);
    setCart([]);
    setProducts(prev => prev.map(prod => {
      const cartItem = cart.find(item => item.productId === prod.id);
      if (cartItem) {
        return { ...prod, stock: Math.max(0, prod.stock - cartItem.qty) };
      }
      return prod;
    }));
    setCustomerName('');
    setDiscount(0);
    setTax(0);
  };


  return (
    <div className="app-container">
      <div id="sidebar-container"></div>
      <main className="main-content" id="mainContent">
        <div id="header-container"></div>
        <div className="content">
          {/* Sale Type Tabs */}
          <div className="sale-type-tabs">
            <div className="tabs-container">
              <button className={`tab-button${saleType === 'normal' ? ' active' : ''}`} onClick={() => setSaleType('normal')} id="normalSaleBtn">
                <PointOfSaleIcon />
                <span>Normal Sell</span>
              </button>
              <button className={`tab-button${saleType === 'credit' ? ' active' : ''}`} onClick={() => setSaleType('credit')} id="creditSaleBtn">
                <CreditCardIcon />
                <span>Sell on Credit</span>
              </button>
              <button className={`tab-button${saleType === 'return' ? ' active' : ''}`} onClick={() => setSaleType('return')} id="returnSaleBtn">
                <UndoIcon />
                <span>Return Sells</span>
              </button>
            </div>
          </div>

          <div className="record-sale-section" id="recordSaleSection" style={{display: 'block'}}>
            <div className="form-card">
              <div className="form-header">
                <h3 id="saleTypeTitle">Select Products to Sell</h3>
                <div className="header-actions">
                  <div className="search-box">
                    <input type="text" id="productSearch" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
                    <SearchIcon />
                  </div>
                  <div className="filter-actions">
                    <select id="brandFilter" value={brand} onChange={e => setBrand(e.target.value)}>
                      <option value="all">All Brands</option>
                      {brands.map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                  <div className="cart-info">
                    <span className="cart-count" id="cartCount">{cart.reduce((sum, item) => sum + item.qty, 0)}</span>
                    <button className="mark-sold-btn" onClick={() => setShowCart(true)} disabled={cart.length === 0}>
                      <ShoppingCartIcon />
                      <span id="markSoldText">Mark as Sold</span>
                    </button>
                    <button
                      className="btn-secondary"
                      title="Generate Invoice from Recent Sale"
                      onClick={() => setShowInvoice(true)}
                      disabled={!lastSale}
                    >
                      <ReceiptLongIcon />
                      <span>Invoice</span>
                    </button>
                  </div>
                </div>
              </div>
              <div className="card-content">
                <div className="products-table-container">
                  <table className="products-table">
                    <thead>
                      <tr>
                        <th>Image</th>
                        <th>Product Name</th>
                        <th>Brand</th>
                        <th>Category</th>
                        <th>Stock</th>
                        <th>Unit</th>
                        <th>Price</th>
                        <th>Status</th>
                        <th>Sales Qty</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map(product => (
                        <tr key={product.id}>
                          <td>
                            <img src={product.image || 'https://via.placeholder.com/60x60?text=No+Image'} alt={product.name} style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8 }} />
                          </td>
                          <td>{product.name}</td>
                          <td>{product.brand}</td>
                          <td>{product.category}</td>
                          <td>{product.stock}</td>
                          <td>{product.unit}</td>
                          <td>₦{parseFloat(product.price).toFixed(2)}</td>
                          <td>
                            <span className={`status-badge ${product.stock === 0 ? 'out-of-stock' : product.stock < 10 ? 'low-stock' : 'normal-stock'}`}>
                              {product.stock === 0 ? 'Out of Stock' : product.stock < 10 ? 'Low Stock' : 'In Stock'}
                            </span>
                          </td>
                          <td>
                            <input
                              type="number"
                              min="1"
                              max={product.stock}
                              style={{ width: 60 }}
                              disabled={product.stock === 0}
                              value={qtyInputs[product.id] || ''}
                              onChange={e => {
                                const val = e.target.value;
                                setQtyInputs(inputs => ({ ...inputs, [product.id]: val }));
                              }}
                            />
                          </td>
                          <td>
                            <button
                              className="btn-primary"
                              style={{ padding: '6px 12px', fontSize: 13 }}
                              disabled={product.stock === 0}
                              onClick={() => handleAddToCart(product)}
                            >
                              Add
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

        {/* Cart Modal */}
        {showCart && (
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
            }} onClick={() => setShowCart(false)} />
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
                  <h3 style={{ margin: 0 }}>Cart</h3>
                  <button className="btn-close" onClick={() => setShowCart(false)} style={{ marginLeft: 16 }}>
                    <CloseIcon />
                  </button>
                </div>
                <div style={{ padding: 24 }}>
                  <div style={{ marginBottom: 12 }}>
                    <input
                      type="text"
                      placeholder="Customer Name (optional)"
                      value={customerName}
                      onChange={e => setCustomerName(e.target.value)}
                      style={{ width: '100%', marginBottom: 8, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                    />
                    <div style={{ display: 'flex', gap: 8 }}>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        placeholder="Discount %"
                        value={discount}
                        onChange={e => setDiscount(Number(e.target.value))}
                        style={{ flex: 1, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                      />
                      <input
                        type="number"
                        min="0"
                        max="100"
                        placeholder="Tax %"
                        value={tax}
                        onChange={e => setTax(Number(e.target.value))}
                        style={{ flex: 1, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                      />
                    </div>
                  </div>
                  {cart.length === 0 ? (
                    <div style={{ textAlign: 'center', color: '#888' }}>Cart is empty.</div>
                  ) : (
                    <table style={{ width: '100%', marginBottom: 16 }}>
                      <thead>
                        <tr>
                          <th>Product</th>
                          <th>Qty</th>
                          <th>Edit</th>
                          <th>Remove</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cart.map(item => {
                          const prod = products.find(p => p.id === item.productId);
                          return (
                            <tr key={item.productId}>
                              <td>{prod ? prod.name : 'Unknown'}</td>
                              <td>{item.qty}</td>
                              <td>
                                <input
                                  type="number"
                                  min="1"
                                  max={prod ? prod.stock + item.qty : 1000}
                                  value={item.qty}
                                  onChange={e => handleEditCartQty(item.productId, Number(e.target.value))}
                                  style={{ width: 60 }}
                                />
                              </td>
                              <td>
                                <button className="btn-close" onClick={() => handleRemoveFromCart(item.productId)}><CloseIcon /></button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                  <button className="btn-primary" style={{ width: '100%' }} onClick={handleMarkSold} disabled={cart.length === 0}>Mark as Sold</button>
                </div>
              </div>
            </div>
          </>
        )}

                      {/* Invoice Modal */}
                      {showInvoice && lastSale && (
                        <>
                          <div style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100vw',
                            height: '100vh',
                            background: 'rgba(30,41,59,0.25)',
                            backdropFilter: 'blur(6px)',
                            zIndex: 1100
                          }} onClick={() => setShowInvoice(false)} />
                          <div style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            width: '100vw',
                            height: '100vh',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1101
                          }}>
                            <div className="form-card" style={{ maxWidth: 520, width: '100%', margin: '0 auto', boxShadow: '0 12px 48px rgba(0,0,0,0.18)', maxHeight: '90vh', overflowY: 'auto', background: '#fff' }}>
                              <div className="form-header">
                                <h3 style={{ margin: 0 }}>Invoice</h3>
                                <button className="btn-close" onClick={() => setShowInvoice(false)} style={{ marginLeft: 16 }}>
                                  <CloseIcon />
                                </button>
                              </div>
                              <div style={{ padding: 24 }}>
                                <div style={{ marginBottom: 8, color: '#555' }}>Invoice #: {lastSale.invoiceNumber}</div>
                                <div style={{ marginBottom: 8, color: '#555' }}>Date: {lastSale.date}</div>
                                {lastSale.customer && <div style={{ marginBottom: 8, color: '#555' }}>Customer: {lastSale.customer}</div>}
                                <table style={{ width: '100%', marginBottom: 16 }}>
                                  <thead>
                                    <tr>
                                      <th>Product</th>
                                      <th>Qty</th>
                                      <th>Price</th>
                                      <th>Total</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {lastSale.items.map((item, idx) => (
                                      <tr key={idx}>
                                        <td>{item.name}</td>
                                        <td>{item.qty}</td>
                                        <td>₦{parseFloat(item.price).toFixed(2)}</td>
                                        <td>₦{parseFloat(item.total).toFixed(2)}</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                                <div style={{ textAlign: 'right', marginBottom: 8 }}>
                                  <div>Subtotal: ₦{lastSale.items.reduce((sum, item) => sum + item.total, 0).toFixed(2)}</div>
                                  {lastSale.discount > 0 && <div>Discount: {lastSale.discount}%</div>}
                                  {lastSale.tax > 0 && <div>Tax: {lastSale.tax}%</div>}
                                  <div style={{ fontWeight: 600, fontSize: 18, marginTop: 8 }}>
                                    Total: ₦{(() => {
                                      let subtotal = lastSale.items.reduce((sum, item) => sum + item.total, 0);
                                      let afterDiscount = subtotal * (1 - (lastSale.discount || 0) / 100);
                                      let afterTax = afterDiscount * (1 + (lastSale.tax || 0) / 100);
                                      return afterTax.toFixed(2);
                                    })()}
                                  </div>
                                </div>
                                <button
                                  className="btn-primary"
                                  style={{ width: '100%', marginBottom: 8 }}
                                  onClick={() => {
                                    window.print();
                                  }}
                                >Print Invoice</button>
                              </div>
                            </div>
                          </div>
                        </>
                      )}

        </div>
      </main>
    </div>
  );
};

export default Sales;