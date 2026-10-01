import { Link } from "react-router";

export default function VehicleCard({ vehicle }) {
    const detailsUrl = `/vehicles/${vehicle.id}`;

    return (
        <article className="vehicle-card">
            <Link
                to={detailsUrl}
                className="vehicle-image"
                aria-label={`View ${vehicle.name}`}
            >
                <img
                    src={vehicle.image}
                    alt={vehicle.name}
                    loading="lazy"
                />
            </Link>

            <div className="vehicle-body">
                <h3>
                    <Link to={detailsUrl}>{vehicle.name}</Link>
                </h3>

                <p className="vehicle-category">
                    {vehicle.category}
                </p>

                <ul className="vehicle-specs">
                    <li>{vehicle.seats} seats</li>
                    <li>{vehicle.transmission}</li>
                    <li>{vehicle.fuel}</li>
                </ul>

                <div className="vehicle-card-footer">
                    <p className="vehicle-price">
                        €{vehicle.price}
                        <small> / day</small>
                    </p>

                    <Link
                        to={detailsUrl}
                        className="button button--small"
                    >
                        View details →
                    </Link>
                </div>
            </div>
        </article>
    );
}