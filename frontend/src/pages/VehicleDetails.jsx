import { useState } from "react";
import {
    Link,
    useNavigate,
    useParams,
    useSearchParams,
} from "react-router";
import {
    ArrowLeft,
    ArrowRight,
    ShieldCheck,
    UsersRound,
    Settings,
    Fuel,
    CarFront,
    MapPin,
} from "lucide-react";
import { vehicles, locations } from "../Data.js";
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
            <main id="main-content" className="container section">
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
    const [params] = useSearchParams();

    const existing = cart.find(
        (item) => item.vehicleId === vehicle.id
    );

    const [pickup, setPickup] = useState(
        params.get("pickup") || existing?.pickup || todayISO()
    );
    const [returnDate, setReturnDate] = useState(
        params.get("returnDate") ||
        existing?.returnDate ||
        nextDay(todayISO(), 3)
    );
    const [insurance, setInsurance] = useState(
        existing?.insurance || false
    );
    const [location, setLocation] = useState(
        locations.includes(params.get("location"))
            ? params.get("location")
            : existing?.location || locations[0]
    );
    const [submitError, setSubmitError] = useState("");

    const error = rentalError(pickup, returnDate);
    const quote = rentalQuote(
        vehicle,
        pickup,
        returnDate,
        insurance
    );

    const specs = [
        [UsersRound, "Passengers", `${vehicle.seats} seats`],
        [Settings, "Transmission", vehicle.transmission],
        [Fuel, "Fuel type", vehicle.fuel],
        [CarFront, "Category", vehicle.category],
    ];

    function changePickup(value) {
        setPickup(value);
        setSubmitError("");

        if (value && returnDate <= value) {
            setReturnDate(nextDay(value));
        }
    }

    function submit(event) {
        event.preventDefault();

        const message = addToCart({
            vehicleId: vehicle.id,
            pickup,
            returnDate,
            insurance,
            location,
        });

        if (message) {
            setSubmitError(message);
            return;
        }

        navigate("/cart");
    }

    return (
        <main id="main-content">
            <section className="page-banner detail-banner">
                <div className="container">
                    <nav className="breadcrumb" aria-label="Breadcrumb">
                        <Link to="/">Home</Link>
                        <span>/</span>
                        <Link to="/vehicles">Vehicles</Link>
                        <span>/</span>
                        <span aria-current="page">{vehicle.name}</span>
                    </nav>

                    <h1>{vehicle.name}</h1>
                    <p>
                        {vehicle.category} · {vehicle.body} ·{" "}
                        {vehicle.transmission}
                    </p>
                </div>
            </section>

            <section className="container section details-layout">
                <div className="vehicle-overview">
                    <div className="detail-photo">
            <span className="vehicle-badge">
              <span />
              Available
            </span>

                        <img
                            src={vehicle.image}
                            alt={vehicle.name}
                            width="1536"
                            height="1024"
                        />
                    </div>

                    <h2>A little more about your ride</h2>
                    <p>{vehicle.description}</p>

                    <dl className="spec-grid">
                        {specs.map(([Icon, label, value]) => (
                            <div key={label}>
                                <Icon aria-hidden="true" />

                                <div>
                                    <dt>{label}</dt>
                                    <dd>{value}</dd>
                                </div>
                            </div>
                        ))}
                    </dl>

                    <Link to="/vehicles" className="text-link">
                        <ArrowLeft size={17} />
                        Compare other vehicles
                    </Link>
                </div>

                <form className="rental-panel" onSubmit={submit}>
                    <div className="rental-panel-heading">
                        <h2>Plan your rental</h2>
                        <ShieldCheck aria-hidden="true" />
                    </div>

                    <p className="detail-rate">
                        {money(vehicle.price)} <small>/ day</small>
                    </p>

                    <div className="rental-dates">
                        <div className="field">
                            <label htmlFor="pickup-date">Pick-up date</label>
                            <input
                                id="pickup-date"
                                type="date"
                                required
                                min={todayISO()}
                                value={pickup}
                                onChange={(event) =>
                                    changePickup(event.target.value)
                                }
                                aria-describedby={
                                    error ? "rental-error" : undefined
                                }
                            />
                        </div>

                        <div className="field">
                            <label htmlFor="return-date">Return date</label>
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
                                aria-describedby={
                                    error ? "rental-error" : undefined
                                }
                            />
                        </div>
                    </div>

                    <div className="field rental-location">
                        <label htmlFor="rental-location">
                            <MapPin size={14} aria-hidden="true" />
                            Pick-up & return location
                        </label>

                        <select
                            id="rental-location"
                            value={location}
                            onChange={(event) => setLocation(event.target.value)}
                        >
                            {locations.map((item) => (
                                <option key={item}>{item}</option>
                            ))}
                        </select>
                    </div>

                    <p className="rental-note">
                        Rental days are counted between your pick-up and return
                        dates.
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
              Add insurance
              <strong>{money(INSURANCE_PER_DAY)} / day</strong>
            </span>
                    </label>

                    <div aria-live="polite">
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
                    </div>

                    <div className="price-row deposit-row">
                        <span>Refundable deposit, separate</span>
                        <strong>{money(DEPOSIT_PER_VEHICLE)}</strong>
                    </div>

                    {(error || submitError) && (
                        <p
                            id="rental-error"
                            role="alert"
                            className="form-error"
                        >
                            {submitError || error}
                        </p>
                    )}

                    <button
                        className="button button--full"
                        type="submit"
                        disabled={Boolean(error)}
                    >
                        {existing ? "Update rental in cart" : "Add to cart"}
                        <ArrowRight size={18} />
                    </button>

                    <p className="rental-note">
                        Adding to your cart does not reserve this vehicle. No
                        payment is collected.
                    </p>
                </form>
            </section>
        </main>
    );
}