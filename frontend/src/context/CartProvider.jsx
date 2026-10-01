import { useEffect, useState } from "react";
import { vehicles } from "../Data.js";
import { CartContext } from "./CartContext.js";
import {
    rentalError,
    restoreCart,
    upsertRental,
} from "../utils/rental.js";

const STORAGE_KEY = "ridego-rental-cart-v1";

export default function CartProvider({ children }) {
    const [cart, setCart] = useState(() => {
        try {
            return restoreCart(
                localStorage.getItem(STORAGE_KEY),
                vehicles
            );
        } catch {
            return [];
        }
    });

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
        } catch {
            console.warn(
                "The cart is available for this session, but browser storage is unavailable."
            );
        }
    }, [cart]);

    function addToCart(selection) {
        const vehicleExists = vehicles.some(
            (vehicle) => vehicle.id === selection.vehicleId
        );

        if (!vehicleExists) {
            return "This vehicle could not be found.";
        }

        const error = rentalError(
            selection.pickup,
            selection.returnDate
        );

        if (error) {
            return error;
        }

        setCart((current) => upsertRental(current, selection));

        return "";
    }

    function removeFromCart(vehicleId) {
        setCart((current) =>
            current.filter((item) => item.vehicleId !== vehicleId)
        );
    }

    return (
        <CartContext.Provider
            value={{ cart, addToCart, removeFromCart }}
        >
            {children}
        </CartContext.Provider>
    );
}