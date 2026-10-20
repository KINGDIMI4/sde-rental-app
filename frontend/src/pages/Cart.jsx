import { Link } from "react-router";
import {
    ShoppingCart,
    ArrowLeft,
    ArrowRight,
    Trash2,
    Pencil,
    ShieldCheck,
} from "lucide-react";
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
    const { cart, removeFromCart, storageError } = useCart();

    const items = cart.flatMap((item) => {
        const vehicle = vehicles.find(
            (entry) => entry.id === item.vehicleId
        );

        return vehicle
            ? [
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
            ]
            : [];
    });

    const hire = items.reduce(
        (sum, item) => sum + item.quote.hire,
        0
    );
    const cover = items.reduce(
        (sum, item) => sum + item.quote.cover,
        0
    );
    const hasExpiredDates = items.some((item) =>
        rentalError(item.pickup, item.returnDate)
    );

    return (
        <main id="main-content">
            <section className="page-banner detail-banner">
                <div className="container">
                    <nav className="breadcrumb" aria-label="Breadcrumb">
                        <Link to="/">Home</Link>
                        <span>/</span>
                        <span aria-current="page">Your cart</span>
                    </nav>

                    <h1>Your rental cart.</h1>
                    <p>
                        Your next journey is taking shape. Review the details
                        below.
                    </p>
                </div>
            </section>

            <section className="container section">
                {storageError && (
                    <p role="status" className="form-error storage-notice">
                        Your browser could not save these selections. They will
                        stay in your cart until you refresh this page.
                    </p>
                )}

                {!items.length ? (
                    <div className="empty-state cart-empty">
                        <ShoppingCart size={40} />
                        <h2>Your next adventure starts here.</h2>
                        <p>
                            Your cart is empty. Find your ride and choose your
                            rental dates.
                        </p>

                        <Link to="/vehicles" className="button">
                            Browse vehicles <ArrowRight size={17} />
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
                                            width="1536"
                                            height="1024"
                                        />
                                    </Link>

                                    <div className="cart-item-info">
                    <span className="vehicle-category">
                      {item.vehicle.category}
                    </span>

                                        <h2>
                                            <Link to={`/vehicles/${item.vehicleId}`}>
                                                {item.vehicle.name}
                                            </Link>
                                        </h2>

                                        <p>
                                            {displayDate(item.pickup)} →{" "}
                                            {displayDate(item.returnDate)}
                                        </p>

                                        <p>
                                            {item.quote.days}{" "}
                                            {item.quote.days === 1 ? "day" : "days"} ·{" "}
                                            {money(item.vehicle.price)} / day
                                        </p>

                                        <p>{item.location}</p>

                                        <p>
                                            Insurance:{" "}
                                            {item.insurance
                                                ? `${money(item.quote.cover)} included in total`
                                                : "Not selected"}
                                        </p>

                                        {rentalError(item.pickup, item.returnDate) && (
                                            <p className="form-error" role="alert">
                                                Please update this rental’s dates.
                                            </p>
                                        )}

                                        <div className="cart-item-actions">
                                            <Link
                                                to={`/vehicles/${item.vehicleId}`}
                                                className="text-link"
                                            >
                                                <Pencil size={14} />
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
                                                <Trash2 size={14} />
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
                                <ArrowLeft size={17} />
                                Continue browsing
                            </Link>
                        </div>

                        <aside className="rental-panel cart-summary">
                            <div className="rental-panel-heading">
                                <h2>Rental summary</h2>
                                <ShieldCheck aria-hidden="true" />
                            </div>

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

                            <div className="price-row deposit-row">
                                <span>Refundable deposits, separate</span>
                                <strong>
                                    {money(items.length * DEPOSIT_PER_VEHICLE)}
                                </strong>
                            </div>

                            {hasExpiredDates && (
                                <p className="form-error" role="alert">
                                    Some dates need updating. These totals are
                                    estimates until you choose new dates.
                                </p>
                            )}

                            <p className="rental-note">
                                Your selections are saved in this browser. They are
                                not confirmed reservations, and no payment is
                                collected.
                            </p>
                        </aside>
                    </div>
                )}
            </section>
        </main>
    );
}