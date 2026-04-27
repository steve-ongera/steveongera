import React, { useState, useEffect } from "react";
import { sendContactMessage, fetchServices } from "../utils/api";
import { usePortfolio } from "../App";
import "./ContactPage.css";

const BUDGET_OPTIONS = [
  { value: "", label: "Select budget range..." },
  { value: "under_500", label: "Under $500" },
  { value: "500_2000", label: "$500 – $2,000" },
  { value: "2000_5000", label: "$2,000 – $5,000" },
  { value: "5000_10000", label: "$5,000 – $10,000" },
  { value: "over_10000", label: "Over $10,000" },
  { value: "discuss", label: "Let's Discuss" },
];

const INITIAL_FORM = {
  name: "", email: "", company: "", phone: "",
  subject: "", message: "", budget: "", service: "",
};

export default function ContactPage() {
  const { portfolioData, showToast } = usePortfolio();
  const profile = portfolioData?.profile;

  const [form, setForm] = useState(INITIAL_FORM);
  const [services, setServices] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    document.title = "Contact | Steve Ongera";
    fetchServices().then((d) => setServices(d.results || d)).catch(() => {});
  }, []);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!form.email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Enter a valid email";
    if (!form.subject.trim()) e.subject = "Subject is required";
    if (!form.message.trim()) e.message = "Message is required";
    else if (form.message.trim().length < 20) e.message = "Message must be at least 20 characters";
    return e;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
    if (errors[name]) setErrors((er) => ({ ...er, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setSubmitting(true);
    try {
      await sendContactMessage(form);
      setForm(INITIAL_FORM);
      setErrors({});
      showToast("Message sent! I'll reply within 24 hours. 🚀", "success");
    } catch (err) {
      const msg = err.data?.detail || err.message || "Failed to send. Please try again.";
      showToast(msg, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="contact-page" style={{ paddingTop: "var(--nav-height)" }}>
      <div className="container">
        {/* Header */}
        <div className="contact-page__header">
          <span className="section-label">Get in Touch</span>
          <h1>Let's Work Together</h1>
          <p>
            Have a project, a job opportunity, or just want to say hello?
            I'm always open to interesting conversations.
          </p>
        </div>

        <div className="contact-page__grid">
          {/* Left — form */}
          <div className="contact-form-wrap">
            <form onSubmit={handleSubmit} noValidate className="contact-form">
              {/* Row 1 */}
              <div className="contact-form__row">
                <div className="contact-form__field">
                  <label htmlFor="name">Full Name <span className="required">*</span></label>
                  <input
                    id="name" name="name" type="text"
                    value={form.name} onChange={handleChange}
                    placeholder="Steve Ongera"
                    className={errors.name ? "is-error" : ""}
                  />
                  {errors.name && <span className="field-error">{errors.name}</span>}
                </div>
                <div className="contact-form__field">
                  <label htmlFor="email">Email <span className="required">*</span></label>
                  <input
                    id="email" name="email" type="email"
                    value={form.email} onChange={handleChange}
                    placeholder="you@company.com"
                    className={errors.email ? "is-error" : ""}
                  />
                  {errors.email && <span className="field-error">{errors.email}</span>}
                </div>
              </div>

              {/* Row 2 */}
              <div className="contact-form__row">
                <div className="contact-form__field">
                  <label htmlFor="company">Company / Organisation</label>
                  <input id="company" name="company" type="text" value={form.company} onChange={handleChange} placeholder="Safaricom, Andela..." />
                </div>
                <div className="contact-form__field">
                  <label htmlFor="phone">Phone (WhatsApp preferred)</label>
                  <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+254 7XX XXX XXX" />
                </div>
              </div>

              {/* Row 3 */}
              <div className="contact-form__row">
                <div className="contact-form__field">
                  <label htmlFor="service">Service Interested In</label>
                  <select id="service" name="service" value={form.service} onChange={handleChange}>
                    <option value="">Select a service...</option>
                    {services.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
                  </select>
                </div>
                <div className="contact-form__field">
                  <label htmlFor="budget">Budget Range</label>
                  <select id="budget" name="budget" value={form.budget} onChange={handleChange}>
                    {BUDGET_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              </div>

              {/* Subject */}
              <div className="contact-form__field">
                <label htmlFor="subject">Subject <span className="required">*</span></label>
                <input
                  id="subject" name="subject" type="text"
                  value={form.subject} onChange={handleChange}
                  placeholder="Django REST API for our e-commerce platform"
                  className={errors.subject ? "is-error" : ""}
                />
                {errors.subject && <span className="field-error">{errors.subject}</span>}
              </div>

              {/* Message */}
              <div className="contact-form__field">
                <label htmlFor="message">Message <span className="required">*</span></label>
                <textarea
                  id="message" name="message"
                  rows={6}
                  value={form.message} onChange={handleChange}
                  placeholder="Tell me about your project, timeline, and what you're looking for..."
                  className={errors.message ? "is-error" : ""}
                />
                <div className="contact-form__char-count mono">
                  {form.message.length} characters {form.message.length < 20 && form.message.length > 0 && <span style={{ color: "var(--error)" }}>· min 20</span>}
                </div>
                {errors.message && <span className="field-error">{errors.message}</span>}
              </div>

              <button type="submit" className="btn btn-primary contact-form__submit" disabled={submitting}>
                {submitting ? (
                  <><i className="bi bi-arrow-repeat contact-form__spinner" /> Sending...</>
                ) : (
                  <><i className="bi bi-send-fill" /> Send Message</>
                )}
              </button>
            </form>
          </div>

          {/* Right — info */}
          <aside className="contact-page__sidebar">
            {/* Contact info */}
            <div className="contact-info card">
              <h3><i className="bi bi-person-lines-fill" /> Contact Info</h3>

              {profile?.email && (
                <a href={`mailto:${profile.email}`} className="contact-info__item">
                  <div className="contact-info__icon"><i className="bi bi-envelope-fill" /></div>
                  <div>
                    <div className="contact-info__label">Email</div>
                    <div className="contact-info__value">{profile.email}</div>
                  </div>
                </a>
              )}

              {profile?.phone && (
                <a href={`tel:${profile.phone}`} className="contact-info__item">
                  <div className="contact-info__icon"><i className="bi bi-telephone-fill" /></div>
                  <div>
                    <div className="contact-info__label">Phone / WhatsApp</div>
                    <div className="contact-info__value">{profile.phone}</div>
                  </div>
                </a>
              )}

              <div className="contact-info__item">
                <div className="contact-info__icon"><i className="bi bi-geo-alt-fill" /></div>
                <div>
                  <div className="contact-info__label">Location</div>
                  <div className="contact-info__value">{profile?.location || "Nairobi, Kenya 🇰🇪"}</div>
                </div>
              </div>

              <div className="contact-info__item">
                <div className="contact-info__icon" style={{ color: "var(--accent)" }}><i className="bi bi-globe2" /></div>
                <div>
                  <div className="contact-info__label">Timezone</div>
                  <div className="contact-info__value">EAT — UTC+3 (East Africa)</div>
                </div>
              </div>
            </div>

            {/* Response time */}
            <div className="contact-response-card card">
              <i className="bi bi-lightning-charge-fill" style={{ color: "var(--accent)", fontSize: "1.5rem" }} />
              <div>
                <h4>Fast Response</h4>
                <p>I typically reply within 24 hours. For urgent projects, mention it in your message.</p>
              </div>
            </div>

            {/* Social */}
            <div className="contact-social card">
              <h4>Connect on Social</h4>
              <div className="contact-social__links">
                {profile?.github_url && (
                  <a href={profile.github_url} target="_blank" rel="noopener noreferrer">
                    <i className="bi bi-github" /> GitHub
                  </a>
                )}
                {profile?.linkedin_url && (
                  <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer">
                    <i className="bi bi-linkedin" /> LinkedIn
                  </a>
                )}
                {profile?.twitter_url && (
                  <a href={profile.twitter_url} target="_blank" rel="noopener noreferrer">
                    <i className="bi bi-twitter-x" /> Twitter / X
                  </a>
                )}
                {profile?.upwork_url && (
                  <a href={profile.upwork_url} target="_blank" rel="noopener noreferrer">
                    <i className="bi bi-patch-check-fill" /> Upwork
                  </a>
                )}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}