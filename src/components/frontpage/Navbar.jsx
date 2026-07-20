import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import styles from "./Navbar.module.css";
import logo from "../../assets/logo.png";


export default function Navbar() {
  const { user, isLoggedIn } = useAuth();

  // Prefer the real display name (set on signup, or provided by Google).
  // Fall back to the part before @ in their email if no name is set yet,
  // then to a generic label as a last resort.
  const userName =
    user?.displayName || (user?.email ? user.email.split("@")[0] : "Account");
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
            <Link to="/requirements">Requirements</Link>
            <Link to="/contact">Contact</Link>
          </nav>

          {isLoggedIn ? (
            <Link to="/account" className={styles.userMenu}>
              {user?.photoURL ? (
                <img
                  src={user.photoURL}
                  alt={userName}
                  className={styles.userAvatarImage}
                />
              ) : (
                <span className={styles.userAvatar}>{initial}</span>
              )}
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