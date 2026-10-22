
import { useState } from "react";
import "./Contact.css";

export default function Contact() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const [submitted, setSubmitted] = useState(false);

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value,
        });

        setSubmitted(false);
    }

    function handleSubmit(event) {
        event.preventDefault();

        // The form is validated, but no email is sent yet.
        setSubmitted(true);

        setFormData({
            name: "",
            email: "",
            subject: "",
            message: "",
        });
    }

    return (
        <main className="contact-page">
            <section className="contact-hero">
                <div className="contact-container">
                    <span className="contact-label">
                        WE'RE HERE TO HELP
                    </span>

                    <h1>Contact Us</h1>

                    <p>
                        Have a question about your next trip?
                        Get in touch with our team. We're happy
                        to help you find your perfect ride.
                    </p>
                </div>
            </section>

            <section className="contact-section">
                <div className="contact-container contact-layout">
                    <div className="contact-info">
                        <span className="contact-label">
                            GET IN TOUCH
                        </span>

                        <h2>Let's talk about your journey.</h2>

                        <p className="contact-description">
                            Whether you need help with a booking,
                            have a question about a vehicle, or
                            simply want to share feedback, we'd
                            love to hear from you.
                        </p>

                        <div className="contact-info-card">
                            <div className="contact-icon">✉</div>
                            <div>
                                <h3>Email us</h3>
                                <p>support@ridego.com</p>
                                <span>Send us your questions anytime.</span>
                            </div>
                        </div>

                        <div className="contact-info-card">
                            <div className="contact-icon">☎</div>
                            <div>
                                <h3>Call us</h3>
                                <p>+36 1 234 5678</p>
                                <span>Monday – Friday, 9:00–17:00</span>
                            </div>
                        </div>

                        <div className="contact-info-card">
                            <div className="contact-icon">⌖</div>
                            <div>
                                <h3>Visit us</h3>
                                <p>Debrecen, Hungary</p>
                                <span>We're here to help you get moving.</span>
                            </div>
                        </div>

                        <div className="contact-note">
                            <strong>Need help with a booking?</strong>
                            <p>
                                Include your booking details in your
                                message so our team can assist you faster.
                            </p>
                        </div>
                    </div>

                    <div className="contact-form-card">
                        <h2>Send us a message</h2>
                        <p className="contact-form-intro">
                            Fill out the form below and let us know
                            how we can help.
                        </p>

                        {submitted && (
                            <div className="contact-success" role="status">
                                Thank you for contacting RideGo!
                                Your message has been validated, but
                                has not been sent yet.
                            </div>
                        )}

                        <form onSubmit={handleSubmit}>
                            <div className="contact-form-row">
                                <div className="contact-field">
                                    <label htmlFor="contact-name">
                                        Full name
                                    </label>
                                    <input
                                        id="contact-name"
                                        type="text"
                                        name="name"
                                        placeholder="Your full name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>

                                <div className="contact-field">
                                    <label htmlFor="contact-email">
                                        Email address
                                    </label>
                                    <input
                                        id="contact-email"
                                        type="email"
                                        name="email"
                                        placeholder="you@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="contact-field">
                                <label htmlFor="contact-subject">
                                    Subject
                                </label>
                                <select
                                    id="contact-subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">
                                        Choose a subject
                                    </option>
                                    <option value="Booking">
                                        Booking assistance
                                    </option>
                                    <option value="Vehicle">
                                        Vehicle information
                                    </option>
                                    <option value="Payment">
                                        Payment question
                                    </option>
                                    <option value="Feedback">
                                        Feedback
                                    </option>
                                    <option value="Other">
                                        Other
                                    </option>
                                </select>
                            </div>

                            <div className="contact-field">
                                <label htmlFor="contact-message">
                                    Your message
                                </label>
                                <textarea
                                    id="contact-message"
                                    name="message"
                                    placeholder="Tell us how we can help..."
                                    rows="6"
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                />
                            </div>

                            <button
                                className="contact-submit"
                                type="submit"
                            >
                                Send Message <span>→</span>
                            </button>

                            <p className="contact-privacy">
                                We'll use your details to respond
                                to your enquiry.
                            </p>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    );
}
