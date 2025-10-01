import React from "react";

const ProductDetails = () => {
  return (
    <div className="dashboard-storefront">
      {/* Simple Header */}
      <header className="simple-header">
        <div className="header-container">
          <div className="logo" onClick={() => (window.location.href = 'storefront.html')}>
            <div className="logo-icon"></div>
            <div className="logo-text">Inventa Store</div>
          </div>
          <div className="search-box">
            <i className="material-icons-round">search</i>
            <input type="text" placeholder="Search products..." id="searchInput" />
          </div>
          <div className="header-actions">
            <button className="login-btn" onClick={() => (window.location.href = 'login.html')}>
              <i className="material-icons-round">login</i>
              <span>Login</span>
            </button>
          </div>
        </div>
      </header>
      {/* Breadcrumb */}
      <nav className="breadcrumb-section">
        <div className="breadcrumb-container">
          <a href="storefront.html" className="breadcrumb-link">
            <i className="material-icons-round">home</i>
            <span>Store</span>
          </a>
          <i className="material-icons-round">chevron_right</i>
          <span className="breadcrumb-current" id="breadcrumbCategory">Products</span>
          <i className="material-icons-round">chevron_right</i>
          <span className="breadcrumb-current" id="breadcrumbProduct">Product Details</span>
        </div>
      </nav>
      {/* Product Details Section */}
      <section className="product-details-section">
        <div className="product-details-container">
          {/* Product Image */}
          <div className="product-image-section">
            <div className="single-image-container">
              <img id="productMainImage" src="" alt="Product Image" className="main-product-image" />
              <div className="image-overlay"></div>
              <div className="image-shine-effect"></div>
            </div>
          </div>
          {/* Product Information */}
          <div className="product-info-section">
            <div className="product-header">
              <div className="product-brand" id="productBrand">Brand</div>
              <div className="product-title" id="productTitle">Product Name</div>
            </div>
            <div className="product-price-section">
              <div className="current-price" id="productPrice">₦0</div>
            </div>
            <div className="product-description" id="productDescription">
              Product description will be loaded here.
            </div>
            {/* Product Details Grid */}
            <div className="product-details-grid">
              <div className="detail-item">
                <span className="detail-label">SKU:</span>
                <span className="detail-value" id="productSKU">SKU-001</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Weight:</span>
                <span className="detail-value" id="productWeight">320g</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Material:</span>
                <span className="detail-value" id="productMaterial">Premium Materials</span>
              </div>
              <div className="detail-item">
                <span className="detail-label">Origin:</span>
                <span className="detail-value" id="productOrigin">Nigeria</span>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* External CSS and fonts should be included in index.html or imported in your main JS/JSX file */}
    </div>
  );
};

export default ProductDetails;
