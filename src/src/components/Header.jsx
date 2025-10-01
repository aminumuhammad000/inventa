import "../styles/Header.css"

const Header = () => (
  <header className="header">
    <div className="header-left">
      <h1 className="page-title" id="pageTitle">Sale History</h1>
      <p className="page-subtitle" id="pageSubtitle">
        View and manage all your sales history, track payments, and monitor customer transactions
      </p>
    </div>
    <div className="header-right">
      <div className="user-info">
        <div className="user-avatar">JD</div>
        <div className="user-details">
          <span className="user-name">John Doe</span>
          <span className="user-role">Shop Owner</span>
        </div>
        <div className="user-dropdown">
          <button className="dropdown-toggle" onClick={() => window.toggleUserDropdown && window.toggleUserDropdown()}>
            <i className="material-icons-round">keyboard_arrow_down</i>
          </button>
          <div className="dropdown-menu" id="userDropdown">
            <div className="dropdown-header">
              <div className="shop-info">
                <div className="shop-name">My Construction Shop</div>
                <div className="shop-location">Your Location</div>
              </div>
            </div>
            <div className="dropdown-divider"></div>
            <a href="#" className="dropdown-item" onClick={() => window.openShopSettings && window.openShopSettings()}>
              <i className="material-icons-round">settings</i>
              <span>Change Shop Info</span>
            </a>
            <a href="#" className="dropdown-item" onClick={() => window.openProfileSettings && window.openProfileSettings()}>
              <i className="material-icons-round">person</i>
              <span>Change My Info</span>
            </a>
            <a href="#" className="dropdown-item logout" onClick={() => window.logout && window.logout()}>
              <i className="material-icons-round">logout</i>
              <span>Logout</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </header>
);

export default Header;
