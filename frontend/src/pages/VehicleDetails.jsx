import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { vehicles } from "../Data.js";
import { useCart } from "../context/CartContext.js";
import {
    DEPOSIT_PER_VEHICLE,
    INSURANCE_PER_DAY,
    money,
    nextDay,
    rentalError,
    rentalQuote,
    todayISO,
} from "../utils/rental.js";

export default function VehicleDetails() {
    const { id } = useParams();
    const vehicle = vehicles.find((item) => item.id === id);

    if (!vehicle) {
        return (
            <main className="container section">
                <h1>Vehicle not found</h1>

                <Link to="/vehicles" className="button">
                    Browse vehicles
                </Link>
            </main>
        );
    }

    return (
        <VehicleDetailsContent
            key={vehicle.id}
            vehicle={vehicle}
        />
    );
}

function VehicleDetailsContent({ vehicle }) {
    const { cart, addToCart } = useCart();
    const navigate = useNavigate();

    const existing = cart.find(
        (item) => item.vehicleId === vehicle.id
    );

    const [pickup, setPickup] = useState(
        existing?.pickup || todayISO()
    );

    const [returnDate, setReturnDate] = useState(
        existing?.returnDate || nextDay(todayISO())
    );

    const [insurance, setInsurance] = useState(
        existing?.insurance || false
    );

    const [submitError, setSubmitError] = useState("");

    const error = rentalError(pickup, returnDate);

    const quote = rentalQuote(
        vehicle,
        pickup,
        returnDate,
        insurance
    );

    function changePickup(value) {
        setPickup(value);
        setSubmitError("");

        if (value && returnDate <= value) {
            setReturnDate(nextDay(value));
        }
    }

    function handleSubmit(event) {
        event.preventDefault();

        const message = addToCart({
            vehicleId: vehicle.id,
            pickup,
            returnDate,
            insurance,
        });

        if (message) {
            setSubmitError(message);
            return;
        }

        navigate("/cart");
    }

    return (
        <main>
            <section className="page-banner">
                <div className="container">
                    <nav
                        className="breadcrumb"
                        aria-label="Breadcrumb"
                    >
                        <Link to="/">Home</Link>
                        <span>/</span>
                        <Link to="/vehicles">Vehicles</Link>
                        <span>/</span>
                        <span aria-current="page">{vehicle.name}</span>
                    </nav>

                    <h1>{vehicle.name}</h1>

                    <p>
                        {vehicle.category} · {vehicle.transmission} ·{" "}
                        {vehicle.fuel}
                    </p>
                </div>
            </section>

            <section className="container section details-layout">
                <div className="vehicle-overview">
                    <div className="detail-photo">
                        <img
                            src={vehicle.image}
                            alt={vehicle.name}
                        />
                    </div>

                    <h2>About this vehicle</h2>
                    <p>{vehicle.description}</p>

                    <dl className="spec-grid">
                        <div>
                            <dt>Passengers</dt>
                            <dd>{vehicle.seats} seats</dd>
                        </div>

                        <div>
                            <dt>Transmission</dt>
                            <dd>{vehicle.transmission}</dd>
                        </div>

                        <div>
                            <dt>Fuel type</dt>
                            <dd>{vehicle.fuel}</dd>
                        </div>

                        <div>
                            <dt>Category</dt>
                            <dd>{vehicle.category}</dd>
                        </div>
                    </dl>

                    <Link to="/vehicles" className="text-link">
                        ← Compare other vehicles
                    </Link>
                </div>

                <form
                    className="rental-panel"
                    onSubmit={handleSubmit}
                >
                    <h2>Plan your rental</h2>

                    <p className="detail-rate">
                        {money(vehicle.price)} <small>/ day</small>
                    </p>

                    <div className="rental-dates">
                        <div className="field">
                            <label htmlFor="pickup-date">
                                Pick-up date
                            </label>

                            <input
                                id="pickup-date"
                                type="date"
                                required
                                min={todayISO()}
                                value={pickup}
                                onChange={(event) =>
                                    changePickup(event.target.value)
                                }
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="return-date">
                                Return date
                            </label>

                            <input
                                id="return-date"
                                type="date"
                                required
                                min={nextDay(pickup) || nextDay(todayISO())}
                                value={returnDate}
                                onChange={(event) => {
                                    setReturnDate(event.target.value);
                                    setSubmitError("");
                                }}
                            />
                        </div>
                    </div>

                    <p className="rental-note">
                        5–8 October counts as 3 rental days.
                    </p>

                    <label className="checkbox-row insurance-option">
                        <input
                            type="checkbox"
                            checked={insurance}
                            onChange={(event) =>
                                setInsurance(event.target.checked)
                            }
                        />

                        <span>
              Add insurance · {money(INSURANCE_PER_DAY)} / day
            </span>
                    </label>

                    <div className="price-row">
            <span>
              Vehicle hire · {quote.days}{" "}
                {quote.days === 1 ? "day" : "days"}
            </span>
                        <strong>{money(quote.hire)}</strong>
                    </div>

                    <div className="price-row">
                        <span>Optional insurance</span>
                        <strong>{money(quote.cover)}</strong>
                    </div>

                    <div className="price-row price-total">
                        <span>Rental total</span>
                        <strong>{money(quote.total)}</strong>
                    </div>

                    <div className="price-row">
                        <span>Refundable deposit, separate</span>
                        <strong>{money(DEPOSIT_PER_VEHICLE)}</strong>
                    </div>

                    {(error || submitError) && (
                        <p role="alert" className="form-error">
                            {submitError || error}
                        </p>
                    )}

                    <button
                        className="button button--full"
                        type="submit"
                        disabled={Boolean(error)}
                    >
                        {existing
                            ? "Update rental in cart"
                            : "Add to cart"}
                    </button>

                    <p className="rental-note">
                        Adding to your cart does not reserve this vehicle.
                    </p>
                </form>
            </section>
        </main>
    );
}