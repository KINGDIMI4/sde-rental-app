import React from "react";
import "./AboutUs.css";

function AboutUs() {
  return (
    <div className="about-page">
      {/* Hero Section */}
      <section className="about-hero">
        <div className="about-hero-content">
          <p className="about-label">ABOUT RIDEGO</p>
          <h1>Your journey starts with us.</h1>
          <p>
            We make renting a vehicle simple, convenient, and
            accessible. Wherever life takes you, RIDEGO helps
            you get there.
          </p>
          <a href="#our-story" className="about-button">
            Discover Our Story
          </a>
        </div>
      </section>

      {/* Our Story */}
      <section className="about-story" id="our-story">
        <div className="story-text">
          <p className="about-label">WHO WE ARE</p>
          <h2>More than just a rental service.</h2>
          <p>
            At RIDEGO, we believe getting from one place to
            another should be easy. Our goal is to provide a
            smooth rental experience that gives people the
            freedom to travel on their own terms.
          </p>
          <p>
            Whether you need a vehicle for a weekend getaway,
            a business trip, or your everyday needs, we aim to
            make finding and renting the right vehicle simple.
          </p>
        </div>

        <div className="story-card">
          <div className="story-icon">🚗</div>
          <h3>Your journey, your way.</h3>
          <p>
            Find a vehicle that fits your plans and enjoy the
            freedom to explore.
          </p>
        </div>
      </section>

      {/* Our Values */}
      <section className="about-values">
        <div className="section-heading">
          <p className="about-label">WHY RIDEGO</p>
          <h2>Making every journey better.</h2>
          <p>
            We focus on what matters most to our customers.
          </p>
        </div>

        <div className="values-grid">
          <div className="value-card">
            <div className="value-icon">⚡</div>
            <h3>Simple Booking</h3>
            <p>
              Find and book your next rental with a
              straightforward, user-friendly experience.
            </p>
          </div>

          <div className="value-card">
            <div className="value-icon">🔑</div>
            <h3>Freedom to Explore</h3>
            <p>
              Choose a vehicle that suits your plans and
              travel on your own schedule.
            </p>
          </div>

          <div className="value-card">
            <div className="value-icon">🤝</div>
            <h3>Customer First</h3>
            <p>
              We aim to make every step of your rental
              experience convenient and reliable.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="about-mission">
        <p className="about-label">OUR MISSION</p>
        <h2>Making mobility easier for everyone.</h2>
        <p>
          We want to connect people with the vehicles they
          need, making every trip easier to plan and every
          destination easier to reach.
        </p>
        <a href="/rentals" className="about-button">
          Explore Rentals
        </a>
      </section>

      {/* Footer */}
      <footer className="about-footer">
        <h2>RIDEGO</h2>
        <p>Your journey. Your freedom. Your ride.</p>
        <p>© {new Date().getFullYear()} RIDEGO. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default AboutUs;
