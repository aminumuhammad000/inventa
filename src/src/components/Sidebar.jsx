
import styles from '../styles/Sidebar.module.css';
import "../styles/global-style.css"
import { Link } from 'react-router-dom';

const Sidebar = () => (
  <aside className={styles.sidebar} id="sidebar">
    {/* Sidebar Header */}
    <div className={styles['sidebar-header']}>
      <div className={styles.logo}>
        <div className={styles['logo-icon']}>🏗️</div>
        <div className={styles['logo-text']}>Inventa</div>
      </div>
      <button className={styles['sidebar-toggle']} id="sidebarToggle" onClick={() => window.toggleSidebar && window.toggleSidebar()}>
        <i className="material-icons-round">menu</i>
      </button>
    </div>

    {/* Navigation */}
    <nav className={styles['sidebar-nav']}>
      <div className={styles['nav-section']}>
        <div className={styles['nav-section-title']}>Dashboard</div>
        <Link to="/" className={styles['nav-item']} data-page="home">
          <i className="material-icons-round">home</i>
          <span>Dashboard</span>
        </Link>
      </div>

      <div className={styles['nav-section']}>
        <div className={styles['nav-section-title']}>Your Shop</div>
        <Link to="/inventory" className={styles['nav-item']} data-page="inventory">
          <i className="material-icons-round">inventory_2</i>
          <span>Stock Items</span>
        </Link>
        <Link to="/sales" className={styles['nav-item']} data-page="sales">
          <i className="material-icons-round">point_of_sale</i>
          <span>Sell Items</span>
        </Link>
        <Link to="/credit" className={styles['nav-item']} data-page="credit">
          <i className="material-icons-round">history</i>
          <span>Sale History</span>
        </Link>
        <Link to="/customers" className={styles['nav-item']} data-page="customers">
          <i className="material-icons-round">people</i>
          <span>Customers</span>
        </Link>
      </div>

      <div className={styles['nav-section']}>
        <div className={styles['nav-section-title']}>Reports</div>
        <Link to="/reports" className={styles['nav-item']} data-page="reports">
          <i className="material-icons-round">assessment</i>
          <span>View Reports</span>
        </Link>
      </div>
    </nav>

    {/* Sidebar Footer */}
    <div className={styles['sidebar-footer']}>
      <div className={styles['powered-by']}>
        <span>Powered By</span>
        <span className={styles['company-name']}>PioneerICT</span>
      </div>
    </div>
  </aside>
);

export default Sidebar;
