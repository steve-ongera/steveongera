import React from "react";
import { Link } from "react-router-dom";
import "./Services.css";

export default function Services({ services }) {
  if (!services?.length) return null;

  return (
    <section className="section services-section" id="services">
      <div className="container">
        <span className="section-label">What I Offer</span>
        <div className="services-header">
          <h2>Services</h2>
          <p className="services-header__sub">
            Scalable, production-ready solutions for startups and enterprises across East Africa and globally.
          </p>
        </div>

        <div className="services-grid">
          {services.map((service, i) => (
            <div key={service.slug} className={`service-card card ${service.is_featured ? "service-card--featured" : ""}`}>
              {/* Icon */}
              <div className="service-card__icon-wrap">
                <i className={`bi ${service.icon_class || "bi-code-slash"}`} />
              </div>

              <h3 className="service-card__title">{service.title}</h3>
              <p className="service-card__desc">{service.short_description}</p>

              {/* Pricing */}
              {service.price_from && (
                <div className="service-card__price">
                  <span className="service-card__price-from">From</span>
                  <span className="service-card__price-value">
                    {service.currency} {Number(service.price_from).toLocaleString()}
                  </span>
                  {service.delivery_days && (
                    <span className="service-card__delivery mono">
                      · {service.delivery_days}d delivery
                    </span>
                  )}
                </div>
              )}

              <Link to="/contact" className="service-card__cta btn btn-outline">
                Get a Quote <i className="bi bi-arrow-right" />
              </Link>

              {service.is_featured && (
                <div className="service-card__featured-badge">
                  <i className="bi bi-star-fill" /> Popular
                </div>
              )}
            </div>
          ))}
        </div>

        {/* CTA banner */}
        <div className="services-cta-banner">
          <div className="services-cta-banner__text">
            <h3>Need something custom?</h3>
            <p>Let's discuss your project and find the best solution for your needs.</p>
          </div>
          <Link to="/contact" className="btn btn-primary">
            <i className="bi bi-chat-dots-fill" /> Start a Conversation
          </Link>
        </div>
      </div>
    </section>
  );
}