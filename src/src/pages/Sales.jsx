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
  const [customerPhone, setCustomerPhone] = useState('');
  const [discount, setDiscount] = useState(0);
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


  // Toggle add/remove product from cart
  const handleToggleCart = (product) => {
    const existingItem = cart.find(item => item.productId === product.id);
    if (existingItem) {
      setCart(cart.filter(item => item.productId !== product.id));
    } else {
      let qty = Number(qtyInputs[product.id]);
      if (!qty || qty < 1) qty = 1;
      if (qty > product.stock) qty = product.stock;
      setCart([...cart, { productId: product.id, qty }]);
    }
    setQtyInputs(inputs => ({ ...inputs, [product.id]: '' }));
  };

  // Adjust quantity for a product in cart
  const handleAdjustQty = (productId, delta, maxStock) => {
    setCart(cart => cart.map(item => {
      if (item.productId === productId) {
        let newQty = item.qty + delta;
        if (newQty < 1) newQty = 1;
        if (newQty > maxStock) newQty = maxStock;
        return { ...item, qty: newQty };
      }
      return item;
    }));
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
    if (cart.length === 0) return;
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
      customerPhone: customerPhone,
      discount,
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

      <main className="main-content" id="mainContent">
        <div className="content" style={{ maxWidth: '1000px', margin: '0 auto', width: '100%', boxSizing: 'border-box' }}>
          {/* Sale Type Tabs */}
          <div className="sale-type-tabs" style={{ width: '100%', marginLeft: '-24px', marginRight: '-24px', paddingLeft: '24px', paddingRight: '24px', boxSizing: 'border-box', background: '#fff', borderRadius: '12px 12px 0 0', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', minHeight: 64 }}>
            <div className="tabs-container" style={{ display: 'flex', gap: 16, width: '100%' }}>
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
                <div className="header-actions">
                  <div className="search-box">
                    <input type="text" id="productSearch" placeholder="Search products..." value={search} onChange={e => setSearch(e.target.value)} />
                    <SearchIcon />
                  </div>
                  <div className="filter-actions">
                    <select id="brandFilter" value={brand} onChange={e => setBrand(e.target.value)}>
                      <option value="all"> All Category</option>
                      {brands.map(b => (
                        <option key={b} value={b}>{b}</option>
                      ))}
                    </select>
                  </div>
                  <div className="cart-info">
                    <span className="cart-count" id="cartCount">{cart.length}</span>
                    <button className="mark-sold-btn" onClick={() => setShowCart(true)} disabled={cart.length === 0}>
                      <ShoppingCartIcon />
                      <span id="markSoldText">Mark as Sold</span>
                    </button>
                    <button
                      className="btn-secondary"
                      title="Generate Invoice from Recent Sale"
                      onClick={() => {
                        if (lastSale) setShowInvoice(true);
                        else if (cart.length > 0) {
                          // If cart has items but no lastSale, mark as sold and show invoice
                          handleMarkSold();
                        }
                      }}
                      disabled={!lastSale && cart.length === 0}
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
                      {filteredProducts.map(product => {
                        const inCart = cart.find(item => item.productId === product.id);
                        const cartQty = inCart ? inCart.qty : 1;
                        return (
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
                            <td style={{ minWidth: 110 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <button
                                  className="btn-secondary"
                                  style={{ padding: '2px 8px', fontSize: 16, minWidth: 28 }}
                                  disabled={product.stock === 0 || !inCart}
                                  onClick={() => inCart && handleAdjustQty(product.id, -1, product.stock)}
                                >-</button>
                                <input
                                  type="number"
                                  min="1"
                                  max={product.stock}
                                  style={{ width: 40, textAlign: 'center' }}
                                  disabled={product.stock === 0 || !inCart}
                                  value={inCart ? inCart.qty : (qtyInputs[product.id] || '')}
                                  onChange={e => {
                                    const val = e.target.value;
                                    if (inCart) {
                                      // Directly update cart qty
                                      let newQty = Number(val);
                                      if (!newQty || newQty < 1) newQty = 1;
                                      if (newQty > product.stock) newQty = product.stock;
                                      setCart(cart => cart.map(item => item.productId === product.id ? { ...item, qty: newQty } : item));
                                    } else {
                                      setQtyInputs(inputs => ({ ...inputs, [product.id]: val }));
                                    }
                                  }}
                                />
                                <button
                                  className="btn-secondary"
                                  style={{ padding: '2px 8px', fontSize: 16, minWidth: 28 }}
                                  disabled={product.stock === 0 || !inCart}
                                  onClick={() => inCart && handleAdjustQty(product.id, 1, product.stock)}
                                >+</button>
                              </div>
                            </td>
                            <td>
                              <button
                                className={inCart ? "btn-success" : "btn-primary"}
                                style={{ padding: '10px 1px', fontSize: 13 }}
                                disabled={product.stock === 0}
                                onClick={() => handleToggleCart(product)}
                              >
                                {inCart ? 'Added' : 'Add'}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
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
              <div className="form-card" style={{
                width: '90vw',
                height: '90vh',
                maxWidth: 1200,
                maxHeight: 800,
                margin: '0 auto',
                boxShadow: '0 12px 48px rgba(0,0,0,0.18)',
                overflow: 'hidden',
                display: 'flex',
                flexDirection: 'column',
                background: '#fff',
                borderRadius: 16
              }}>
                <div className="form-header" style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '24px 32px 16px 32px',
                  borderBottom: '1px solid #e5e7eb',
                  background: '#f8fafc',
                  borderRadius: '16px 16px 0 0',
                  position: 'relative'
                }}>
                  <h2 style={{ margin: 0, fontWeight: 700, fontSize: 28 }}>Confirm Sale</h2>
                  <button
                    className="btn-close"
                    onClick={() => setShowCart(false)}
                    style={{
                      position: 'absolute',
                      top: 18,
                      right: 24,
                      background: 'none',
                      border: 'none',
                      color: '#ef4444',
                      fontSize: 32,
                      cursor: 'pointer',
                      padding: 0,
                      zIndex: 2
                    }}
                    title="Cancel"
                  >
                    <svg width="32" height="32" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M6 6L14 14M14 6L6 14" stroke="#ef4444" strokeWidth="2.2" strokeLinecap="round"/>
                    </svg>
                  </button>
                </div>
                <div style={{ flex: 1, overflowY: 'auto', padding: 32, display: 'flex', gap: 32 }}>
                  {/* Left: Cart Summary */}
                  <div style={{ flex: 2, minWidth: 0 }}>
                    <h3 style={{ marginBottom: 16, fontWeight: 600 }}>Products to Sell</h3>
                    {cart.length === 0 ? (
                      <div style={{ textAlign: 'center', color: '#888' }}>Cart is empty.</div>
                    ) : (
                      <table style={{ width: '100%', marginBottom: 16, borderCollapse: 'collapse' }}>
                        <thead>
                          <tr style={{ background: '#f1f5f9' }}>
                            <th style={{ padding: 8, textAlign: 'left' }}>Product</th>
                            <th style={{ padding: 8 }}>Qty</th>
                            <th style={{ padding: 8 }}>Edit</th>
                            <th style={{ padding: 8 }}>Remove</th>
                          </tr>
                        </thead>
                        <tbody>
                          {cart.map(item => {
                            const prod = products.find(p => p.id === item.productId);
                            return (
                              <tr key={item.productId} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                <td style={{ padding: 8, fontWeight: 500 }}>{prod ? prod.name : 'Unknown'}</td>
                                <td style={{ padding: 8 }}>{item.qty}</td>
                                <td style={{ padding: 8 }}>
                                  <input
                                    type="number"
                                    min="1"
                                    max={prod ? prod.stock + item.qty : 1000}
                                    value={item.qty}
                                    onChange={e => handleEditCartQty(item.productId, Number(e.target.value))}
                                    style={{ width: 60 }}
                                  />
                                </td>
                                <td style={{ padding: 8, textAlign: 'center' }}>
                                  <button
                                    className="btn-close"
                                    title="Remove"
                                    onClick={() => handleRemoveFromCart(item.productId)}
                                    style={{ color: '#ef4444', background: 'none', border: 'none', fontSize: 22, cursor: 'pointer', padding: 0 }}
                                  >
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                      <path d="M6 6L14 14M14 6L6 14" stroke="#ef4444" strokeWidth="2.2" strokeLinecap="round"/>
                                    </svg>
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    )}
                  </div>
                  {/* Right: Sale Details */}
                  <div style={{ flex: 1, minWidth: 0, background: '#f9fafb', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', gap: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <h3 style={{ fontWeight: 600, marginBottom: 8 }}>Sale Details</h3>
                    <div style={{ marginBottom: 8 }}>
                      <label style={{ fontWeight: 500 }}>Customer Name</label>
                      <input
                        type="text"
                        placeholder="Customer Name (optional)"
                        value={customerName}
                        onChange={e => setCustomerName(e.target.value)}
                        style={{ width: '100%', marginTop: 4, marginBottom: 8, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                      />
                    </div>
                    <div style={{ marginBottom: 8 }}>
                      <label style={{ fontWeight: 500 }}>Customer Phone (optional)</label>
                      <input
                        type="tel"
                        placeholder="Customer Phone (optional)"
                        value={customerPhone}
                        onChange={e => setCustomerPhone(e.target.value)}
                        style={{ width: '100%', marginTop: 4, marginBottom: 8, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                      />
                    </div>
                    <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                      <div style={{ flex: 1 }}>
                        <label style={{ fontWeight: 500 }}>Discount %</label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          placeholder="Discount %"
                          value={discount}
                          onChange={e => setDiscount(Number(e.target.value))}
                          style={{ width: '100%', marginTop: 4, padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                        />
                      </div>
                    </div>
                    <div style={{ marginTop: 16, fontWeight: 600, fontSize: 18, color: '#334155' }}>
                      <div>Subtotal: ₦{cart.reduce((sum, item) => {
                        const prod = products.find(p => p.id === item.productId);
                        return sum + (prod ? prod.price * item.qty : 0);
                      }, 0).toFixed(2)}</div>
                      {discount > 0 && <div>Discount: {discount}%</div>}
                      <div style={{ fontWeight: 700, fontSize: 22, marginTop: 8 }}>
                        Total: ₦{(() => {
                          let subtotal = cart.reduce((sum, item) => {
                            const prod = products.find(p => p.id === item.productId);
                            return sum + (prod ? prod.price * item.qty : 0);
                          }, 0);
                          let afterDiscount = subtotal * (1 - (discount || 0) / 100);
                          return afterDiscount.toFixed(2);
                        })()}
                      </div>
                    </div>
                    <button className="btn-primary" style={{ width: '100%', marginTop: 24, fontSize: 18, padding: '14px 0' }} onClick={handleMarkSold} disabled={cart.length === 0}>Confirm & Mark as Sold</button>
                  </div>
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
                            <div className="form-card" style={{
                              width: '90vw',
                              height: '90vh',
                              maxWidth: 1200,
                              maxHeight: 800,
                              margin: '0 auto',
                              boxShadow: '0 12px 48px rgba(0,0,0,0.18)',
                              overflow: 'hidden',
                              display: 'flex',
                              flexDirection: 'column',
                              background: '#fff',
                              borderRadius: 16
                            }}>
                              <div className="form-header" style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: '24px 32px 16px 32px',
                                borderBottom: '1px solid #e5e7eb',
                                background: '#f8fafc',
                                borderRadius: '16px 16px 0 0',
                                position: 'relative'
                              }}>
                                <h2 style={{ margin: 0, fontWeight: 700, fontSize: 28 }}>Invoice</h2>
                                <button
                                  className="btn-close"
                                  onClick={() => setShowInvoice(false)}
                                  style={{
                                    position: 'absolute',
                                    top: 18,
                                    right: 24,
                                    background: 'none',
                                    border: 'none',
                                    color: '#ef4444',
                                    fontSize: 32,
                                    cursor: 'pointer',
                                    padding: 0,
                                    zIndex: 2
                                  }}
                                  title="Close"
                                >
                                  <svg width="32" height="32" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M6 6L14 14M14 6L6 14" stroke="#ef4444" strokeWidth="2.2" strokeLinecap="round"/>
                                  </svg>
                                </button>
                              </div>
                              <div style={{ flex: 1, overflowY: 'auto', padding: 32, display: 'flex', gap: 32 }}>
                                {/* Invoice Details Left */}
                                <div style={{ flex: 2, minWidth: 0 }}>
                                  <div style={{ marginBottom: 24, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                    <div>
                                      <div style={{ fontWeight: 700, fontSize: 22, color: '#334155' }}>INVENTA STORE</div>
                                      <div style={{ color: '#64748b', fontSize: 15 }}>Invoice #: {lastSale.invoiceNumber}</div>
                                      <div style={{ color: '#64748b', fontSize: 15 }}>Date: {lastSale.date}</div>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                      {lastSale.customer && <div style={{ color: '#334155', fontWeight: 600 }}>Customer: {lastSale.customer}</div>}
                                      {lastSale.customerPhone && <div style={{ color: '#64748b' }}>Phone: {lastSale.customerPhone}</div>}
                                    </div>
                                  </div>
                                  <table style={{ width: '100%', marginBottom: 16, borderCollapse: 'collapse' }}>
                                    <thead>
                                      <tr style={{ background: '#f1f5f9' }}>
                                        <th style={{ padding: 8, textAlign: 'left' }}>Product</th>
                                        <th style={{ padding: 8 }}>Qty</th>
                                        <th style={{ padding: 8 }}>Price</th>
                                        <th style={{ padding: 8 }}>Total</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {lastSale.items.map((item, idx) => (
                                        <tr key={idx} style={{ borderBottom: '1px solid #e5e7eb' }}>
                                          <td style={{ padding: 8 }}>{item.name}</td>
                                          <td style={{ padding: 8, textAlign: 'center' }}>{item.qty}</td>
                                          <td style={{ padding: 8, textAlign: 'right' }}>₦{parseFloat(item.price).toFixed(2)}</td>
                                          <td style={{ padding: 8, textAlign: 'right' }}>₦{parseFloat(item.total).toFixed(2)}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                  <div style={{ textAlign: 'right', marginBottom: 8, fontSize: 16 }}>
                                    <div>Subtotal: ₦{lastSale.items.reduce((sum, item) => sum + item.total, 0).toFixed(2)}</div>
                                    {lastSale.discount > 0 && <div>Discount: {lastSale.discount}%</div>}
                                    <div style={{ fontWeight: 700, fontSize: 22, marginTop: 8, color: '#334155' }}>
                                      Total: ₦{(() => {
                                        let subtotal = lastSale.items.reduce((sum, item) => sum + item.total, 0);
                                        let afterDiscount = subtotal * (1 - (lastSale.discount || 0) / 100);
                                        return afterDiscount.toFixed(2);
                                      })()}
                                    </div>
                                  </div>
                                </div>
                                {/* Invoice Actions Right */}
                                <div style={{ flex: 1, minWidth: 0, background: '#f9fafb', borderRadius: 12, padding: 24, display: 'flex', flexDirection: 'column', gap: 16, boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                                  <h3 style={{ fontWeight: 600, marginBottom: 8 }}>Invoice Actions</h3>
                                  <button
                                    className="btn-primary"
                                    style={{ width: '100%', fontSize: 18, padding: '14px 0' }}
                                    onClick={() => window.print()}
                                  >Print Invoice</button>
                                  <button
                                    className="btn-secondary"
                                    style={{ width: '100%', fontSize: 18, padding: '14px 0' }}
                                    onClick={() => {
                                      if (navigator.share) {
                                        navigator.share({
                                          title: 'Invoice',
                                          text: `Invoice #${lastSale.invoiceNumber} for ${lastSale.customer || ''}`
                                        });
                                      } else {
                                        alert('Sharing is not supported in this browser.');
                                      }
                                    }}
                                  >Share Invoice</button>
                                  <div style={{ color: '#64748b', fontSize: 14, marginTop: 16 }}>
                                    <div>Thank you for your business!</div>
                                    <div style={{ marginTop: 8 }}>Powered by INVENTA</div>
                                  </div>
                                </div>
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