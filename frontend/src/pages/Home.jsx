import { Link } from "react-router";
import {
  Search,
  CarFront,
  CalendarDays,
  CircleCheck,
  ShieldCheck,
  BadgeCheck,
  ArrowRight,
} from "lucide-react";
import VehicleCard from "../components/VehicleCard.jsx";
import SearchBar from "../components/SearchBar.jsx";
import { vehicles } from "../Data.js";

const benefits = [
  ["Wide selection", "Choose from a wide", "range of vehicles"],
  ["Affordable rates", "Find your fit with", "clear daily prices"],
  ["Easy booking", "Plan your rental in", "a few simple clicks"],
  ["Travel your way", "A ride for every plan", "and every journey"],
];

const steps = [
  {
    number: "01",
    title: "Search",
    Icon: Search,
    description:
      "Enter your location and dates to find the perfect vehicle.",
  },
  {
    number: "02",
    title: "Choose",
    Icon: CarFront,
    description:
      "Browse our fleet and select the vehicle that fits your needs.",
  },
  {
    number: "03",
    title: "Book",
    Icon: CalendarDays,
    description:
      "Review your rental details and save your choice in your cart.",
  },
  {
    number: "04",
    title: "Drive",
    Icon: SteeringWheel,
    description:
      "Pick up your vehicle and enjoy the freedom of the road.",
  },
];

function SteeringWheel() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="2" />
      <path d="M4 8.5c4-2 12-2 16 0M3.3 10 10 12m4 0 6.7-2M11 14l-1 6.7m3-6.7 1 6.7" />
    </svg>
  );
}

export default function Home() {
  return (
    <main id="main-content">
      <section className="hero">
        <div className="container">
          <div className="hero-grid">
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
            </div>

            <div className="hero-visual">
              <div className="hero-orbit" />
              <span className="hero-bubble hero-bubble--one" />
              <span className="hero-bubble hero-bubble--two" />
              <span className="hero-bubble hero-bubble--three" />
              <span className="hero-stroke" />

              <span className="hero-handwriting">
                Explore
                <br />
                <span>More.</span>
              </span>

              <img
                src="/images/hero-suv.png"
                alt="Silver SUV ready for your next journey"
                width="1536"
                height="1024"
                fetchPriority="high"
              />
            </div>
          </div>

          <SearchBar />
        </div>
      </section>

      <section
        className="container benefits"
        id="why-ridego"
        aria-label="Why choose RideGo"
      >
        {benefits.map(([title, first, second]) => (
          <div className="benefit" key={title}>
            <h3>{title}</h3>
            <p>
              {first}
              <br />
              {second}
            </p>
          </div>
        ))}
      </section>

      <section className="container popular-section">
        <div className="section-heading">
          <h2>POPULAR VEHICLES</h2>

          <Link to="/vehicles" className="text-link">
            View All Vehicles
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        <div className="vehicle-grid">
          {vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              compact
            />
          ))}
        </div>
      </section>

      <section className="how-it-works" id="how-it-works">
        <div className="container">
          <h2>HOW IT WORKS</h2>

          <p className="section-intro">
            Get on the road in just a few steps. Fast, easy, and
            hassle-free.
          </p>

          <div className="steps-grid">
            {steps.map(({ number, title, description, Icon }) => (
              <div className="step" key={number}>
                <div className="step-icon">
                  <Icon aria-hidden="true" />
                </div>

                <span className="step-number">{number}</span>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container cta-section">
        <div className="cta-banner">
          <div className="cta-content">
            <span className="eyebrow">
              YOUR NEXT JOURNEY AWAITS
            </span>

            <h2>Ready to hit the road?</h2>

            <p>
              Discover reliable vehicles, flexible rentals, and
              unforgettable experiences with RideGo.
            </p>

            <Link to="/vehicles" className="button">
              Browse Vehicles
              <ArrowRight size={18} aria-hidden="true" />
            </Link>

            <div className="cta-promises">
              <span>
                <CircleCheck />
                Clear daily prices
              </span>
              <span>
                <BadgeCheck />
                Flexible choices
              </span>
              <span>
                <ShieldCheck />
                Your journey, your way
              </span>
            </div>
          </div>

          <span className="cta-handwriting" aria-hidden="true">
            More
            <br />
            Roads.
            <br />
            Brighter
            <br />
            Days.
          </span>
        </div>
      </section>
    </main>
  );
}
