

import styles from '../styles/Sidebar.module.css';
import "../styles/global-style.css";
import { Link } from 'react-router-dom';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import HistoryIcon from '@mui/icons-material/History';
import PeopleIcon from '@mui/icons-material/People';
import AssessmentIcon from '@mui/icons-material/Assessment';

const Sidebar = () => (
  <aside className={styles.sidebar} id="sidebar">
    {/* Sidebar Header */}
    <div className={styles['sidebar-header']}>
      <div className={styles.logo}>
        <div className={styles['logo-icon']}>🏗️</div>
        <div className={styles['logo-text']}>Inventa</div>
      </div>
      <button className={styles['sidebar-toggle']} id="sidebarToggle" onClick={() => window.toggleSidebar && window.toggleSidebar()}>
        <MenuIcon />
      </button>
    </div>

    {/* Navigation */}
    <nav className={styles['sidebar-nav']}>
      <div className={styles['nav-section']}>
        <div className={styles['nav-section-title']}>Dashboard</div>
        <Link to="/Dashboard" className={styles['nav-item']} data-page="home">
          <HomeIcon />
          <span>Dashboard</span>
        </Link>
      </div>

      <div className={styles['nav-section']}>
        <div className={styles['nav-section-title']}>Your Shop</div>
        <Link to="/inventory" className={styles['nav-item']} data-page="inventory">
          <Inventory2Icon />
          <span>Stock Items</span>
        </Link>
        <Link to="/sales" className={styles['nav-item']} data-page="sales">
          <PointOfSaleIcon />
          <span>Sell Items</span>
        </Link>
        <Link to="/credit" className={styles['nav-item']} data-page="credit">
          <HistoryIcon />
          <span>Sale History</span>
        </Link>
        <Link to="/customers" className={styles['nav-item']} data-page="customers">
          <PeopleIcon />
          <span>Customers</span>
        </Link>
      </div>

      <div className={styles['nav-section']}>
        <div className={styles['nav-section-title']}>Reports</div>
        <Link to="/reports" className={styles['nav-item']} data-page="reports">
          <AssessmentIcon />
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
