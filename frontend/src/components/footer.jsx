import { Link } from "react-router";
import { ArrowUpRight } from "lucide-react";
import Logo from "./logo.jsx";

const groups = [
  {
    title: "Quick Links",
    links: [
      ["Vehicles", "/vehicles"],
      ["How It Works", "/#how-it-works"],
      ["Locations", "/contact#locations"],
      ["About RideGo", "/about"],
    ],
  },
  {
    title: "Rental Guide",
    links: [
      ["Help Centre", "/contact"],
      ["Rental Dates", "/contact#rental-dates"],
      ["Insurance", "/contact#insurance"],
      ["Deposits", "/contact#deposits"],
    ],
  },
  {
    title: "Your Rental",
    links: [
      ["Manage Your Rental", "/cart"],
      ["Your Cart", "/cart"],
      ["Compare Vehicles", "/vehicles"],
      ["Get Started", "/vehicles"],
    ],
  },
];

export default function Footer() {
  return (
      <footer className="site-footer" id="contact">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-brand">
              <Logo />
              <p>More than a rental. A brighter way to explore.</p>
            </div>

            {groups.map((group) => (
                <div className="footer-column" key={group.title}>
                  <h3>{group.title}</h3>

                  <ul>
                    {group.links.map(([label, to]) => (
                        <li key={label}>
                          <Link to={to}>{label}</Link>
                        </li>
                    ))}
                  </ul>
                </div>
            ))}
          </div>

          <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} RideGo. All rights reserved.
          </span>

            <span className="footer-tagline">
            Explore today. A brighter tomorrow.
            <span className="footer-rule" />
            <ArrowUpRight size={13} aria-hidden="true" />
          </span>
          </div>

          <p className="demo-note">
            Demo fleet · Cart selections are not confirmed reservations.
          </p>
        </div>
      </footer>
  );
}