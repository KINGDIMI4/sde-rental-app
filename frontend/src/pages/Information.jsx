import { Link } from "react-router";
import {
    ArrowRight,
    CarFront,
    MapPin,
    CalendarDays,
    ShieldCheck,
    Wallet,
} from "lucide-react";
import {
    DEPOSIT_PER_VEHICLE,
    INSURANCE_PER_DAY,
    money,
} from "../utils/rental.js";

export default function Information({ page }) {
    const about = page === "about";

    const helpSections = [
        [
            "locations",
            MapPin,
            "Pick-up locations",
            "Choose Debrecen City Centre or Debrecen Airport when planning your rental. These are demo locations; no collection appointment is created.",
        ],
        [
            "rental-dates",
            CalendarDays,
            "Choosing your dates",
            "Pick-up can be today or any future date. Return must be at least one day later. For example, picking up on the 5th and returning on the 8th counts as three rental days.",
        ],
        [
            "insurance",
            ShieldCheck,
            "Optional insurance",
            `Add insurance for ${money(INSURANCE_PER_DAY)} per rental day on the vehicle details page. It is included in the displayed rental total when selected. This is an illustrative rate for the demo, not an insurance policy.`,
        ],
        [
            "deposits",
            Wallet,
            "Refundable deposits",
            `The demo uses a ${money(DEPOSIT_PER_VEHICLE)} refundable deposit per vehicle. It is displayed separately from the rental total. No deposit or payment is collected by this website.`,
        ],
    ];

    return (
        <main id="main-content">
            <section className="page-banner detail-banner">
                <div className="container">
                    <nav className="breadcrumb" aria-label="Breadcrumb">
                        <Link to="/">Home</Link>
                        <span>/</span>
                        <span aria-current="page">
              {about ? "About us" : "Contact & rental guide"}
            </span>
                    </nav>

                    <h1>
                        {about
                            ? "More than a rental."
                            : "A little help for the road."}
                    </h1>

                    <p>
                        {about
                            ? "A brighter way to explore."
                            : "Everything you need to plan your RideGo rental."}
                    </p>
                </div>
            </section>

            <section className="container section information-layout">
                {about ? (
                    <>
                        <div className="about-photo">
                            <img
                                src="/images/hero-suv.png"
                                alt="Silver SUV"
                                width="1536"
                                height="1024"
                            />
                        </div>

                        <div>
                            <span className="eyebrow">MEET RIDEGO</span>
                            <h2>A ride that fits your plans.</h2>

                            <p>
                                From an everyday city trip to a weekend away,
                                RideGo brings your options together in one place.
                                Compare economy cars, sedans, SUVs, and sports
                                cars, then choose the dates that work for you.
                            </p>

                            <p>
                                Daily rates, optional insurance, and refundable
                                deposits are shown separately so you can see how
                                your rental total is calculated.
                            </p>

                            <p>
                                This is a demonstration fleet. You can explore
                                vehicles and save a rental plan; a cart selection
                                does not create a reservation.
                            </p>

                            <Link to="/vehicles" className="button">
                                Find your next ride <ArrowRight size={17} />
                            </Link>
                        </div>
                    </>
                ) : (
                    <div className="help-content">
                        <div className="contact-intro">
                            <CarFront />
                            <h2>Contact & support</h2>

                            <p>
                                RideGo is a demonstration website and does not
                                have a connected rental office or customer-support
                                service. You can explore the fleet and manage your
                                selections using the guide below.
                            </p>
                        </div>

                        {helpSections.map(([id, Icon, title, text]) => (
                            <article className="help-section" id={id} key={id}>
                                <Icon aria-hidden="true" />

                                <div>
                                    <h2>{title}</h2>
                                    <p>{text}</p>
                                </div>
                            </article>
                        ))}

                        <Link to="/cart" className="text-link">
                            Manage your rental selections
                            <ArrowRight size={17} />
                        </Link>
                    </div>
                )}
            </section>
        </main>
    );
}