import React from "react";
import styles from "../styles/Header.module.css"
function Sidebar() {
  return (
    <div>
           <nav className={styles.navbar}>
        <NavLink to="/" className={({ isActive }) => isActive ? styles.activeLink : styles.navLink}>
          Home
        </NavLink>
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? styles.activeLink : styles.navLink}>
          Dashboard
        </NavLink>
        <NavLink to="/customers" className={({ isActive }) => isActive ? styles.activeLink : styles.navLink}>
          Customers
        </NavLink>
        <NavLink to="/inventory" className={({ isActive }) => isActive ? styles.activeLink : styles.navLink}>
          Inventory
        </NavLink>
        <NavLink to="/reports" className={({ isActive }) => isActive ? styles.activeLink : styles.navLink}>
          Reports
        </NavLink>
        <NavLink to="/product-details" className={({ isActive }) => isActive ? styles.activeLink : styles.navLink}>
          Product Details
        </NavLink>
        <NavLink to="/shop-settings" className={({ isActive }) => isActive ? styles.activeLink : styles.navLink}>
          Shop Settings
        </NavLink>
        <NavLink to="/credit" className={({ isActive }) => isActive ? styles.activeLink : styles.navLink}>
          Credit
        </NavLink>
        <NavLink to="/profile-settings" className={({ isActive }) => isActive ? styles.activeLink : styles.navLink}>
          Profile Settings
        </NavLink>
        <NavLink to="/sales" className={({ isActive }) => isActive ? styles.activeLink : styles.navLink}>
          Sales
        </NavLink>
        <NavLink to="/signup" className={({ isActive }) => isActive ? styles.activeLink : styles.navLink}>
          Signup
        </NavLink>
        <NavLink to="/storefront" className={({ isActive }) => isActive ? styles.activeLink : styles.navLink}>
          Storefront
        </NavLink>
      </nav>
    </div>
  );
}

export default Sidebar;
