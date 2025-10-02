import "../styles/global-style.css";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import SettingsIcon from '@mui/icons-material/Settings';
import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';

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
            <KeyboardArrowDownIcon />
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
              <SettingsIcon />
              <span>Change Shop Info</span>
            </a>
            <a href="#" className="dropdown-item" onClick={() => window.openProfileSettings && window.openProfileSettings()}>
              <PersonIcon />
              <span>Change My Info</span>
            </a>
            <a href="#" className="dropdown-item logout" onClick={() => window.logout && window.logout()}>
              <LogoutIcon />
              <span>Logout</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </header>
);

export default Header;
