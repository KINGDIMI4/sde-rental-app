import { Link } from "react-router";
import {
  UsersRound,
  Settings,
  Fuel,
  ArrowRight,
  Zap,
} from "lucide-react";
import { money } from "../utils/rental.js";

export default function VehicleCard({
  vehicle,
  compact = false,
  search = "",
}) {
  const detailsUrl = `/vehicles/${vehicle.id}${search}`;
  const FuelIcon = vehicle.fuel === "Electric" ? Zap : Fuel;

  return (
    <article
      className={`vehicle-card ${
        compact ? "vehicle-card--compact" : ""
      }`}
    >
      <Link
        to={detailsUrl}
        className="vehicle-image"
        aria-label={`View ${vehicle.name}`}
      >
        <img
          src={vehicle.image}
          alt={vehicle.name}
          loading="lazy"
          width="1536"
          height="1024"
        />

        {!compact && (
          <span className="vehicle-badge">
            <span />
            Available
          </span>
        )}
      </Link>

      <div className="vehicle-body">
        <h3>
          <Link to={detailsUrl}>{vehicle.name}</Link>
        </h3>

        <p className="vehicle-category">
          {vehicle.category}
          <span>·</span>
          {vehicle.body}
        </p>

        <ul className="vehicle-specs">
          <li>
            <UsersRound aria-hidden="true" />
            <div>
              <strong>{vehicle.seats}</strong>
              <span>Seats</span>
            </div>
          </li>

          <li>
            <Settings aria-hidden="true" />
            <div>
              <strong>{vehicle.transmission}</strong>
              <span>Transmission</span>
            </div>
          </li>

          <li>
            <FuelIcon aria-hidden="true" />
            <div>
              <strong>{vehicle.fuel}</strong>
              <span>Fuel type</span>
            </div>
          </li>
        </ul>

        <div className="vehicle-card-footer">
          <p className="vehicle-price">
            {money(vehicle.price)}
            <small> / day</small>
          </p>

          <Link to={detailsUrl} className="button button--small">
            {compact ? "Rent Now" : "View Details"}
            <ArrowRight aria-hidden="true" size={17} />
          </Link>
        </div>
      </div>
    </article>
  );
}
