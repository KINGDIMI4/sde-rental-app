import { Link } from "react-router";
import { vehicles } from "../Data.js";
import { useCart } from "../context/CartContext.js";
import {
    DEPOSIT_PER_VEHICLE,
    displayDate,
    money,
    rentalError,
    rentalQuote,
} from "../utils/rental.js";

export default function Cart() {
    const { cart, removeFromCart } = useCart();

    const items = cart.flatMap((item) => {
        const vehicle = vehicles.find(
            (entry) => entry.id === item.vehicleId
        );

        if (!vehicle) {
            return [];
        }

        return [
            {
                ...item,
                vehicle,
                quote: rentalQuote(
                    vehicle,
                    item.pickup,
                    item.returnDate,
                    item.insurance
                ),
            },
        ];
    });

    const hire = items.reduce(
        (sum, item) => sum + item.quote.hire,
        0
    );

    const cover = items.reduce(
        (sum, item) => sum + item.quote.cover,
        0
    );

    return (
        <main>
            <section className="page-banner">
                <div className="container">
                    <h1>Your rental cart</h1>
                    <p>
                        Review your vehicles, dates, and rental totals.
                    </p>
                </div>
            </section>

            <section className="container section">
                {items.length === 0 ? (
                    <div className="empty-state">
                        <h2>Your cart is empty</h2>

                        <p>
                            Select a vehicle and choose your rental dates
                            to get started.
                        </p>

                        <Link to="/vehicles" className="button">
                            Browse vehicles
                        </Link>
                    </div>
                ) : (
                    <div className="cart-layout">
                        <div className="cart-items">
                            {items.map((item) => (
                                <article
                                    className="cart-item"
                                    key={item.vehicleId}
                                >
                                    <Link
                                        to={`/vehicles/${item.vehicleId}`}
                                        className="cart-photo"
                                    >
                                        <img
                                            src={item.vehicle.image}
                                            alt={item.vehicle.name}
                                        />
                                    </Link>

                                    <div className="cart-item-info">
                                        <h2>
                                            <Link
                                                to={`/vehicles/${item.vehicleId}`}
                                            >
                                                {item.vehicle.name}
                                            </Link>
                                        </h2>

                                        <p>
                                            {displayDate(item.pickup)} →{" "}
                                            {displayDate(item.returnDate)}
                                        </p>

                                        <p>
                                            {item.quote.days}{" "}
                                            {item.quote.days === 1 ? "day" : "days"}{" "}
                                            · {money(item.vehicle.price)} / day
                                        </p>

                                        <p>
                                            Insurance:{" "}
                                            {item.insurance
                                                ? `${money(item.quote.cover)} included in the total`
                                                : "Not selected"}
                                        </p>

                                        {rentalError(
                                            item.pickup,
                                            item.returnDate
                                        ) && (
                                            <p
                                                className="form-error"
                                                role="alert"
                                            >
                                                Please update this rental&apos;s dates.
                                            </p>
                                        )}

                                        <div className="cart-item-actions">
                                            <Link
                                                to={`/vehicles/${item.vehicleId}`}
                                                className="text-link"
                                            >
                                                Edit rental
                                            </Link>

                                            <button
                                                type="button"
                                                className="remove-button"
                                                aria-label={`Remove ${item.vehicle.name} from cart`}
                                                onClick={() =>
                                                    removeFromCart(item.vehicleId)
                                                }
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>

                                    <strong className="cart-line-total">
                                        {money(item.quote.total)}
                                    </strong>
                                </article>
                            ))}

                            <Link to="/vehicles" className="text-link">
                                ← Continue browsing
                            </Link>
                        </div>

                        <aside className="rental-panel cart-summary">
                            <h2>Rental summary</h2>

                            <div className="price-row">
                                <span>Vehicles</span>
                                <strong>{items.length}</strong>
                            </div>

                            <div className="price-row">
                                <span>Vehicle hire</span>
                                <strong>{money(hire)}</strong>
                            </div>

                            <div className="price-row">
                                <span>Optional insurance</span>
                                <strong>{money(cover)}</strong>
                            </div>

                            <div className="price-row price-total">
                                <span>Rental total</span>
                                <strong>{money(hire + cover)}</strong>
                            </div>

                            <div className="price-row">
                                <span>Refundable deposits, separate</span>

                                <strong>
                                    {money(
                                        items.length * DEPOSIT_PER_VEHICLE
                                    )}
                                </strong>
                            </div>

                            <p className="rental-note">
                                Cart items are rental selections, not
                                confirmed reservations.
                            </p>
                        </aside>
                    </div>
                )}
            </section>
        </main>
    );
}