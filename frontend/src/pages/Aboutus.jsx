import { useEffect } from "react";
import {
  BrowserRouter,
  Link,
  Route,
  Routes,
  useLocation,
} from "react-router";

import Navbar from "./components/Navbar.jsx";
import Footer from "./components/footer.jsx";
import CartProvider from "./context/CartProvider.jsx";

import Home from "./pages/Home.jsx";
import Vehicles from "./pages/Vehicles.jsx";
import VehicleDetails from "./pages/VehicleDetails.jsx";
import Cart from "./pages/Cart.jsx";
import AboutUs from "./pages/AboutUs.jsx";
import Information from "./pages/Information.jsx";

function RouteEffects() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    const titles = {
      "/": "Rent a car. Go further.",
      "/vehicles": "Find your next ride",
      "/cart": "Your rental cart",
      "/about": "About us",
      "/contact": "Contact & rental guide",
    };

    const title = pathname.startsWith("/vehicles/")
        ? "Plan your rental"
        : titles[pathname] || "Page not found";

    document.title = `RideGo — ${title}`;

    if (hash) {
      const frame = requestAnimationFrame(() => {
        document
            .getElementById(hash.slice(1))
            ?.scrollIntoView();
      });

      return () => cancelAnimationFrame(frame);
    }

    window.scrollTo(0, 0);
  }, [pathname, hash]);

  return null;
}

export default function App() {
  return (
      <BrowserRouter>
        <CartProvider>
          <RouteEffects />

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

            <Route path="/about" element={<AboutUs />} />

            <Route
                path="/contact"
                element={<Information page="contact" />}
            />

            <Route
                path="*"
                element={
                  <main
                      id="main-content"
                      className="container section"
                  >
                    <h1>Page not found</h1>
                    <p>
                      The page you’re looking for could not be found.
                    </p>

                    <Link to="/" className="button">
                      Return home
                    </Link>
                  </main>
                }
            />
          </Routes>

          <Footer />
        </CartProvider>
      </BrowserRouter>
  );
}