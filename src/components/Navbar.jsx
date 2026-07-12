import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import styles from "./Navbar.module.css";
import logo from "../assets/logo.png";

export default function Navbar() {
  const { isLoggedIn } = useAuth();

  // Placeholder until real user data is stored
  const userName = "Selsite";
  const initial = userName.trim().charAt(0).toUpperCase();

  return (
    <header className={styles.navbar}>
      <div className={styles.navInner}>
        {/* Logo */}
        <Link to="/" className={styles.logo}>
          <img
            src={logo}
            alt="Lyka's Car Rental"
            className={styles.logoImage}
          />
          <span className={styles.logoText}>Lyka's</span>
        </Link>

        {/* Right Side */}
        <div className={styles.rightSection}>
          <nav className={styles.navLinks}>
            <a href="#requirements">Requirements</a>
            <a href="#contact">Contact</a>
          </nav>

          {isLoggedIn ? (
            <Link to="/account" className={styles.userMenu}>
              <span className={styles.userAvatar}>{initial}</span>
              <span className={styles.userName}>{userName}</span>
            </Link>
          ) : (
            <Link to="/login" className={styles.loginBtn}>
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}