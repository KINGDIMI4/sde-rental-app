import { useState } from "react";
import { Link, NavLink } from "react-router";
import { Menu, ShoppingCart, X } from "lucide-react";
import Logo from "./logo.jsx";
import { useCart } from "../context/CartContext.js";

export default function Navbar() {
  const { cart } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">
      <a className="skip-link" href="#main-content">
        Skip to content
      </a>

      <div className="container navbar">
        <Logo />

        <nav
          className={`nav-links ${open ? "is-open" : ""}`}
          id="main-navigation"
          aria-label="Main navigation"
          onClick={() => setOpen(false)}
        >
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/vehicles">Vehicles</NavLink>
          <NavLink to="/about">About us</NavLink>
          <NavLink to="/contact">Contact Us</NavLink>
        </nav>

        <div className="nav-actions">
          <NavLink
            to="/cart"
            className="cart-link"
            aria-label={`Cart, ${cart.length} ${
              cart.length === 1 ? "vehicle" : "vehicles"
            }`}
          >
            <ShoppingCart size={17} aria-hidden="true" />
            <span>Cart</span>
            <span className="cart-count">{cart.length}</span>
          </NavLink>

          <Link to="/vehicles" className="button nav-cta">
            Get Started
          </Link>

          <button
            className="menu-toggle"
            type="button"
            aria-label={open ? "Close navigation" : "Open navigation"}
            aria-controls="main-navigation"
            aria-expanded={open}
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>
      </div>
    </header>
  );
}
