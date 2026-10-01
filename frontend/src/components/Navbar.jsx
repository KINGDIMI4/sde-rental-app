import { Link, NavLink } from "react-router";
import { useCart } from "../context/CartContext.js";

export default function Navbar() {
    const { cart } = useCart();

    return (
        <header className="site-header">
            <div className="container navbar">
                <Link
                    to="/"
                    className="logo"
                    aria-label="RideGo home"
                >
                    Ride<span>Go</span>
                </Link>

                <nav
                    className="nav-links"
                    aria-label="Main navigation"
                >
                    <NavLink to="/" end>
                        Home
                    </NavLink>

                    <NavLink to="/vehicles">
                        Vehicles
                    </NavLink>

                    <NavLink to="/cart">
                        Cart ({cart.length})
                    </NavLink>
                </nav>

                <Link to="/vehicles" className="button">
                    Get Started
                </Link>
            </div>
        </header>
    );
}