import { useState } from "react";

import VehicleCard from "../components/VehicleCard.jsx";
import { vehicles } from "../Data.js";

const categories = ["Economy", "Sedan", "SUV", "Sports"];

export default function Vehicles() {
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [fuel, setFuel] = useState("");
    const [maxPrice, setMaxPrice] = useState(100);
    const [sortBy, setSortBy] = useState("price-low");

    function toggleCategory(category) {
        setSelectedCategories((currentCategories) => {
            if (currentCategories.includes(category)) {
                return currentCategories.filter(
                    (item) => item !== category
                );
            }

            return [...currentCategories, category];
        });
    }

    function resetFilters() {
        setSelectedCategories([]);
        setFuel("");
        setMaxPrice(100);
        setSortBy("price-low");
    }

    const filteredVehicles = vehicles.filter((vehicle) => {
        const matchesCategory =
            selectedCategories.length === 0 ||
            selectedCategories.includes(vehicle.category);

        const matchesFuel =
            fuel === "" || vehicle.fuel === fuel;

        const matchesPrice =
            vehicle.price <= maxPrice;

        return matchesCategory && matchesFuel && matchesPrice;
    });

    filteredVehicles.sort((first, second) => {
        if (sortBy === "price-high") {
            return second.price - first.price;
        }

        if (sortBy === "name") {
            return first.name.localeCompare(second.name);
        }

        return first.price - second.price;
    });

    return (
        <main>
            <section className="page-banner">
                <div className="container">
                    <h1>FIND YOUR NEXT RIDE.</h1>
                    <p>Choose the right vehicle for your journey.</p>
                </div>
            </section>

            <section className="container section results-layout">
                <aside className="filters" aria-label="Vehicle filters">
                    <h2>Filters</h2>

                    <fieldset className="filter-group">
                        <legend>Vehicle category</legend>

                        {categories.map((category) => (
                            <label className="checkbox-row" key={category}>
                                <input
                                    type="checkbox"
                                    checked={selectedCategories.includes(category)}
                                    onChange={() => toggleCategory(category)}
                                />

                                <span>{category}</span>
                            </label>
                        ))}
                    </fieldset>

                    <fieldset className="filter-group">
                        <legend>
                            Maximum daily price: €{maxPrice}
                        </legend>

                        <input
                            type="range"
                            min="30"
                            max="100"
                            step="5"
                            value={maxPrice}
                            aria-label="Maximum daily rental price in euros"
                            onChange={(event) => {
                                setMaxPrice(Number(event.target.value));
                            }}
                        />

                        <div className="price-range-labels">
                            <span>€30</span>
                            <span>€100</span>
                        </div>
                    </fieldset>

                    <div className="filter-group">
                        <div className="field">
                            <label htmlFor="fuel-filter">
                                Fuel type
                            </label>

                            <select
                                id="fuel-filter"
                                value={fuel}
                                onChange={(event) => {
                                    setFuel(event.target.value);
                                }}
                            >
                                <option value="">All fuel types</option>
                                <option value="Petrol">Petrol</option>
                                <option value="Electric">Electric</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="button"
                        className="reset-filters"
                        onClick={resetFilters}
                    >
                        Reset filters
                    </button>
                </aside>

                <div className="results">
                    <div className="results-toolbar">
                        <h2 aria-live="polite">
                            {filteredVehicles.length}{" "}
                            {filteredVehicles.length === 1
                                ? "vehicle"
                                : "vehicles"}
                        </h2>

                        <label className="sort-control">
                            <span>Sort by</span>

                            <select
                                value={sortBy}
                                onChange={(event) => {
                                    setSortBy(event.target.value);
                                }}
                            >
                                <option value="price-low">
                                    Price: low to high
                                </option>

                                <option value="price-high">
                                    Price: high to low
                                </option>

                                <option value="name">
                                    Name: A to Z
                                </option>
                            </select>
                        </label>
                    </div>

                    <div className="results-grid">
                        {filteredVehicles.length > 0 ? (
                            filteredVehicles.map((vehicle) => (
                                <VehicleCard
                                    key={vehicle.id}
                                    vehicle={vehicle}
                                />
                            ))
                        ) : (
                            <div className="empty-state">
                                <h2>No vehicles match your filters</h2>

                                <p>
                                    Try increasing your budget or removing a filter.
                                </p>

                                <button
                                    type="button"
                                    className="button"
                                    onClick={resetFilters}
                                >
                                    Reset filters
                                </button>
                            </div>
                        )}
                    </div>

                    <p className="results-note">
                        Prices shown are per day.
                    </p>
                </div>
            </section>
        </main>
    );
}