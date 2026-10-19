import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
  MapPin,
  CalendarDays,
  CarFront,
  ChevronDown,
} from "lucide-react";
import { categories, locations } from "../Data.js";
import {
  todayISO,
  nextDay,
  rentalError,
} from "../utils/rental.js";

export default function SearchBar({ withLocation = false }) {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const initialPickup = params.get("pickup") || todayISO();

  const [pickup, setPickup] = useState(initialPickup);
  const [returnDate, setReturnDate] = useState(
    params.get("returnDate") || nextDay(initialPickup, 3)
  );
  const [category, setCategory] = useState(
    categories.includes(params.get("category"))
      ? params.get("category")
      : ""
  );
  const [location, setLocation] = useState(
    locations.includes(params.get("location"))
      ? params.get("location")
      : locations[0]
  );
  const [error, setError] = useState("");

  const prefix = withLocation ? "fleet" : "home";

  function submit(event) {
    event.preventDefault();

    const message = rentalError(pickup, returnDate);

    if (message) {
      setError(message);
      return;
    }

    const search = new URLSearchParams({
      pickup,
      returnDate,
      location,
    });

    if (category) {
      search.set("category", category);
    }

    navigate(`/vehicles?${search.toString()}`);
  }

  function changePickup(value) {
    setPickup(value);
    setError("");

    if (value && returnDate <= value) {
      setReturnDate(nextDay(value));
    }
  }

  return (
    <form
      className={`search-bar ${
        withLocation ? "search-bar--with-location" : ""
      }`}
      onSubmit={submit}
      aria-label="Search rental vehicles"
    >
      {withLocation && (
        <div className="search-field">
          <MapPin aria-hidden="true" />

          <div>
            <label htmlFor={`${prefix}-location`}>
              Pick-up location <ChevronDown />
            </label>

            <select
              id={`${prefix}-location`}
              value={location}
              onChange={(event) => setLocation(event.target.value)}
            >
              {locations.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>
        </div>
      )}

      <div className="search-field">
        <CalendarDays aria-hidden="true" />

        <div>
          <label htmlFor={`${prefix}-pickup`}>Pick-up date</label>

          <input
            id={`${prefix}-pickup`}
            type="date"
            required
            min={todayISO()}
            value={pickup}
            onChange={(event) => changePickup(event.target.value)}
          />
        </div>
      </div>

      <div className="search-field">
        <CalendarDays aria-hidden="true" />

        <div>
          <label htmlFor={`${prefix}-return`}>Return date</label>

          <input
            id={`${prefix}-return`}
            type="date"
            required
            min={nextDay(pickup) || nextDay(todayISO())}
            value={returnDate}
            onChange={(event) => {
              setReturnDate(event.target.value);
              setError("");
            }}
          />
        </div>
      </div>

      <div className="search-field">
        <CarFront aria-hidden="true" />

        <div>
          <label htmlFor={`${prefix}-type`}>
            Vehicle type <ChevronDown />
          </label>

          <select
            id={`${prefix}-type`}
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="">All cars</option>

            {categories.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </div>
      </div>

      <button type="submit" className="button search-submit">
        Search
      </button>

      {error && (
        <p className="form-error" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
