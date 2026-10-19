import { CarFront } from "lucide-react";
import { Link } from "react-router";

export default function Logo() {
  return (
    <Link to="/" className="logo" aria-label="RideGo home">
      <CarFront aria-hidden="true" strokeWidth={1.9} />

      <span className="logo-word">
        Ride<span>Go</span>
      </span>
    </Link>
  );
}