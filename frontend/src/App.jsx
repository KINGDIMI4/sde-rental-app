import { useEffect } from "react";
import {
    BrowserRouter,
    Link,
    Route,
    Routes,
    useLocation,
} from "react-router";

import Navbar from "./components/Navbar.jsx";
import CartProvider from "./context/CartProvider.jsx";

import Home from "./pages/Home.jsx";
import Vehicles from "./pages/Vehicles.jsx";
import VehicleDetails from "./pages/VehicleDetails.jsx";
import Cart from "./pages/Cart.jsx";

function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pathname]);

    return null;
}

export default function App() {
    return (
        <BrowserRouter>
            <CartProvider>
                <ScrollToTop />

                <Navbar />

                <Routes>
                    <Route path="/" element={<Home />} />

                    <Route
                        path="/vehicles"
                        element={<Vehicles />}
                    />

                    <Route
                        path="/vehicles/:id"
                        element={<VehicleDetails />}
                    />

                    <Route path="/cart" element={<Cart />} />

                    <Route
                        path="*"
                        element={
                            <main className="container section">
                                <h1>Page not found</h1>

                                <Link to="/" className="button">
                                    Return home
                                </Link>
                            </main>
                        }
                    />
                </Routes>

                <footer className="site-footer">
                    <div className="container">
                        <strong>RideGo</strong>
                        <p>
                            More than a rental. A brighter way to explore.
                        </p>
                    </div>
                </footer>
            </CartProvider>
        </BrowserRouter>
    );
}