import { useEffect, useState } from "react";
import {
  Link,
  useLocation,
  useSearchParams,
} from "react-router";
import {
  SlidersHorizontal,
  ChevronDown,
  RotateCcw,
} from "lucide-react";

import VehicleCard from "../components/VehicleCard.jsx";
import SearchBar from "../components/SearchBar.jsx";
import { vehicles, categories } from "../Data.js";
import { filterVehicles } from "../utils/vehicle.js";

export default function Vehicles() {
  const [params, setParams] = useSearchParams();
  const { key: navigationKey } = useLocation();

  const categoryParam = params.get("category");

  const [selectedCategories, setSelectedCategories] = useState(
      categories.includes(categoryParam) ? [categoryParam] : []
  );

  const [fuels, setFuels] = useState([]);
  const [transmissions, setTransmissions] = useState([]);
  const [minPrice, setMinPrice] = useState(30);
  const [maxPrice, setMaxPrice] = useState(100);
  const [sortBy, setSortBy] = useState("price-low");
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    setSelectedCategories(
        categories.includes(categoryParam) ? [categoryParam] : []
    );
  }, [categoryParam, navigationKey]);

  const rentalParams = new URLSearchParams();

  ["pickup", "returnDate", "location"].forEach((key) => {
    const value = params.get(key);

    if (value) {
      rentalParams.set(key, value);
    }
  });

  const detailsSearch = rentalParams.size
      ? `?${rentalParams.toString()}`
      : "";

  const filteredVehicles = filterVehicles(vehicles, {
    categories: selectedCategories,
    fuels,
    transmissions,
    minPrice,
    maxPrice,
    sortBy,
  });

  const activeCount =
      selectedCategories.length +
      fuels.length +
      transmissions.length +
      Number(minPrice !== 30 || maxPrice !== 100);

  function count(key, value) {
    return vehicles.filter(
        (vehicle) => vehicle[key] === value
    ).length;
  }

  function toggle(value, setter) {
    setter((current) =>
        current.includes(value)
            ? current.filter((item) => item !== value)
            : [...current, value]
    );
  }

  function resetFilters() {
    setSelectedCategories([]);
    setFuels([]);
    setTransmissions([]);
    setMinPrice(30);
    setMaxPrice(100);
    setSortBy("price-low");

    if (params.has("category")) {
      const nextParams = new URLSearchParams(params);
      nextParams.delete("category");
      setParams(nextParams, { replace: true });
    }
  }

  return (
      <main id="main-content">
        <section className="page-banner fleet-banner">
          <div
              className="banner-decoration"
              aria-hidden="true"
          />

          <div className="container">
            <nav
                className="breadcrumb"
                aria-label="Breadcrumb"
            >
              <Link to="/">Home</Link>
              <span>/</span>
              <span aria-current="page">Vehicles</span>
            </nav>

            <h1>FIND YOUR NEXT RIDE.</h1>
            <p>Choose the right vehicle for your journey.</p>

            <SearchBar
                withLocation
                key={params.toString()}
            />
          </div>
        </section>

        <section className="container results-layout">
          <button
              type="button"
              className="mobile-filter-toggle"
              onClick={() => setFiltersOpen(!filtersOpen)}
              aria-expanded={filtersOpen}
              aria-controls="vehicle-filters"
          >
            <SlidersHorizontal size={18} />
            Filters {activeCount > 0 && `(${activeCount})`}
            <ChevronDown size={18} />
          </button>

          <aside
              id="vehicle-filters"
              className={`filters ${
                  filtersOpen ? "filters--open" : ""
              }`}
              aria-label="Vehicle filters"
          >
            <h2>Filters</h2>

            <fieldset className="filter-group">
              <legend>Vehicle category</legend>

              {categories.map((category) => (
                  <label
                      className="checkbox-row"
                      key={category}
                  >
                    <input
                        type="checkbox"
                        checked={selectedCategories.includes(category)}
                        onChange={() =>
                            toggle(category, setSelectedCategories)
                        }
                    />

                    <span>
                  {category}{" "}
                      <span className="filter-count">
                    ({count("category", category)})
                  </span>
                </span>
                  </label>
              ))}
            </fieldset>

            <fieldset className="filter-group price-filter">
              <legend>Price per day</legend>

              <p>
                €{minPrice} – €{maxPrice}
              </p>

              <div
                  className="dual-range"
                  style={{
                    "--range-start": `${
                        ((minPrice - 30) / 70) * 100
                    }%`,
                    "--range-end": `${
                        ((maxPrice - 30) / 70) * 100
                    }%`,
                  }}
              >
                <div className="range-track" />

                <input
                    type="range"
                    min="30"
                    max="100"
                    step="5"
                    value={minPrice}
                    aria-label="Minimum daily price in euros"
                    onChange={(event) =>
                        setMinPrice(
                            Math.min(
                                Number(event.target.value),
                                maxPrice
                            )
                        )
                    }
                />

                <input
                    type="range"
                    min="30"
                    max="100"
                    step="5"
                    value={maxPrice}
                    aria-label="Maximum daily price in euros"
                    onChange={(event) =>
                        setMaxPrice(
                            Math.max(
                                Number(event.target.value),
                                minPrice
                            )
                        )
                    }
                />
              </div>

              <div className="price-range-labels">
                <span>€30</span>
                <span>€100</span>
              </div>
            </fieldset>

            <fieldset className="filter-group">
              <legend>Transmission</legend>

              {["Automatic", "Manual"].map((type) => (
                  <label className="checkbox-row" key={type}>
                    <input
                        type="checkbox"
                        checked={transmissions.includes(type)}
                        onChange={() =>
                            toggle(type, setTransmissions)
                        }
                    />

                    <span>
                  {type}{" "}
                      <span className="filter-count">
                    ({count("transmission", type)})
                  </span>
                </span>
                  </label>
              ))}
            </fieldset>

            <fieldset className="filter-group">
              <legend>Fuel type</legend>

              {["Petrol", "Electric"].map((fuel) => (
                  <label className="checkbox-row" key={fuel}>
                    <input
                        type="checkbox"
                        checked={fuels.includes(fuel)}
                        onChange={() => toggle(fuel, setFuels)}
                    />

                    <span>
                  {fuel}{" "}
                      <span className="filter-count">
                    ({count("fuel", fuel)})
                  </span>
                </span>
                  </label>
              ))}
            </fieldset>

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
                    : "vehicles"}{" "}
                available
              </h2>

              <label className="sort-control">
              <span className="sr-only">
                Sort vehicles
              </span>

                <select
                    value={sortBy}
                    onChange={(event) =>
                        setSortBy(event.target.value)
                    }
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
                          search={detailsSearch}
                      />
                  ))
              ) : (
                  <div className="empty-state">
                    <SlidersHorizontal size={32} />

                    <h2>No vehicles match your filters</h2>

                    <p>
                      Try increasing your budget or removing a
                      filter.
                    </p>

                    <button
                        type="button"
                        className="button"
                        onClick={resetFilters}
                    >
                      <RotateCcw size={16} />
                      Reset filters
                    </button>
                  </div>
              )}
            </div>

            <p className="results-note">
              Prices shown per day. Select a vehicle to view
              your rental total.
            </p>
          </div>
        </section>
      </main>
  );
}