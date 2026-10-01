import { Link } from "react-router";

import VehicleCard from "../components/VehicleCard.jsx";
import { vehicles } from "../Data.js";

const benefits = [
    {
        title: "Wide selection",
        description: "Choose from a range of vehicles for your journey.",
    },
    {
        title: "Affordable rates",
        description: "Compare daily prices and find your fit.",
    },
    {
        title: "Easy booking",
        description: "Plan your rental in a few simple steps.",
    },
    {
        title: "Travel your way",
        description: "Find a vehicle that suits your plans.",
    },
];

const steps = [
    {
        number: "01",
        title: "Search",
        description: "Choose your rental dates and preferred vehicle type.",
    },
    {
        number: "02",
        title: "Choose",
        description: "Compare vehicles and select the right one for you.",
    },
    {
        number: "03",
        title: "Book",
        description: "Review your rental details and complete your booking.",
    },
    {
        number: "04",
        title: "Drive",
        description: "Collect your vehicle and enjoy your journey.",
    },
];

export default function Home() {
    return (
        <main>
            <section className="hero">
                <div className="container hero-grid">
                    <div className="hero-copy">
                        <h1>
                            RENT A CAR.
                            <br />
                            GO <span>FURTHER.</span>
                        </h1>

                        <p>
                            Reliable vehicles. Reliable prices.
                            <br />
                            Your next journey starts with RideGo.
                        </p>

                        <Link to="/vehicles" className="button">
                            Browse Vehicles →
                        </Link>
                    </div>

                    <div className="hero-visual">
                        <img
                            src="/images/toyota-corolla.png"
                            alt="Toyota Corolla rental car"
                        />
                    </div>
                </div>
            </section>

            <section
                className="container benefits"
                aria-label="Why choose RideGo"
            >
                {benefits.map((benefit) => (
                    <div className="benefit" key={benefit.title}>
                        <h3>{benefit.title}</h3>
                        <p>{benefit.description}</p>
                    </div>
                ))}
            </section>

            <section className="container section">
                <div className="section-heading">
                    <h2>POPULAR VEHICLES</h2>

                    <Link to="/vehicles" className="text-link">
                        View All Vehicles →
                    </Link>
                </div>

                <div className="vehicle-grid">
                    {vehicles.map((vehicle) => (
                        <VehicleCard
                            key={vehicle.id}
                            vehicle={vehicle}
                        />
                    ))}
                </div>
            </section>

            <section className="how-it-works">
                <div className="container">
                    <h2>HOW IT WORKS</h2>
                    <p>Get on the road in a few simple steps.</p>

                    <div className="steps-grid">
                        {steps.map((step) => (
                            <div className="step" key={step.number}>
                                <div className="step-icon" aria-hidden="true">
                                    {step.number}
                                </div>

                                <h3>{step.title}</h3>
                                <p>{step.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="container">
                <div className="cta-banner">
                    <div className="cta-content">
                        <h2>Ready to hit the road?</h2>

                        <p>
                            Explore our vehicles and find the right ride
                            for your next journey.
                        </p>

                        <Link to="/vehicles" className="button">
                            Browse Vehicles →
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}