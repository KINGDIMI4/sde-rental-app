import { useEffect, useState } from "react";
import { CartContext } from "./CartContext.js";
import { vehicles, locations } from "../Data.js";
import { rentalError, rentalQuote } from "../utils/rental.js";

const STORAGE_KEY = "ridego-rentals-v1";

function readCart() {
    try {
        const saved = JSON.parse(
            localStorage.getItem(STORAGE_KEY) || "[]"
        );

        if (!Array.isArray(saved)) {
            return [];
        }

        const unique = new Map();

        for (const item of saved) {
            if (!item || typeof item !== "object") {
                continue;
            }

            const vehicle = vehicles.find(
                (entry) => entry.id === item.vehicleId
            );

            if (
                !vehicle ||
                !rentalQuote(vehicle, item.pickup, item.returnDate).days
            ) {
                continue;
            }

            unique.set(item.vehicleId, {
                vehicleId: item.vehicleId,
                pickup: item.pickup,
                returnDate: item.returnDate,
                insurance: item.insurance === true,
                location: locations.includes(item.location)
                    ? item.location
                    : locations[0],
            });
        }

        return [...unique.values()];
    } catch {
        return [];
    }
}

export default function CartProvider({ children }) {
    const [cart, setCart] = useState(readCart);
    const [storageError, setStorageError] = useState(false);

    useEffect(() => {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
            setStorageError(false);
        } catch {
            setStorageError(true);
        }
    }, [cart]);

    function addToCart(item) {
        const exists = vehicles.some(
            (vehicle) => vehicle.id === item.vehicleId
        );

        if (!exists) {
            return "This vehicle could not be found.";
        }

        const error = rentalError(item.pickup, item.returnDate);

        if (error) {
            return error;
        }

        const clean = {
            vehicleId: item.vehicleId,
            pickup: item.pickup,
            returnDate: item.returnDate,
            insurance: item.insurance === true,
            location: locations.includes(item.location)
                ? item.location
                : locations[0],
        };

        setCart((current) => [
            ...current.filter(
                (entry) => entry.vehicleId !== item.vehicleId
            ),
            clean,
        ]);

        return "";
    }

    function removeFromCart(id) {
        setCart((current) =>
            current.filter((item) => item.vehicleId !== id)
        );
    }

    return (
        <CartContext.Provider
            value={{
                cart,
                addToCart,
                removeFromCart,
                storageError,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}