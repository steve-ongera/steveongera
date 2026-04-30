import { useEffect, useRef, useState } from "react";
import { getPortfolioSummary, sendContactMessage } from "../utils/api.js";

// ─── Tiny hook: run callback once when element enters viewport ────────────────
function useAOS() {
  useEffect(() => {
    if (window.AOS) window.AOS.init({ duration: 1000, easing: "ease-in-out", once: true, mirror: false });
  }, []);
}

// ─── Skeleton loader ──────────────────────────────────────────────────────────
function Skeleton({ className = "", style = {} }) {
  return (
    <div
      className={`skeleton-box ${className}`}
      style={{ background: "linear-gradient(90deg,#e2e8f0 25%,#f1f5f9 50%,#e2e8f0 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite", borderRadius: 6, ...style }}
    />
  );
}

// ─── HERO SECTION ─────────────────────────────────────────────────────────────
function HeroSection({ profile }) {
  const typedRef = useRef(null);
  const typedInstance = useRef(null);

  useEffect(() => {
    if (!profile || !window.Typed) return;
    if (typedInstance.current) typedInstance.current.destroy();
    typedInstance.current = new window.Typed(typedRef.current, {
      strings: [
        "Software Engineer",
        "Full Stack Developer",
        "Product Engineer",
        "SEO Expert",
        "Founder Kencom Softwares Ltd",
        "Entrepreneur",
        "Tutor",
      ],
      typeSpeed: 60,
      backSpeed: 40,
      loop: true,
    });
    return () => typedInstance.current?.destroy();
  }, [profile]);

  return (
    <section id="hero" className="d-flex flex-column justify-content-center">
      <div className="container" data-aos="zoom-in" data-aos-delay="100">
        <h1>{profile?.full_name || "Steve Ongera"}</h1>
        <p>
          I'm <span ref={typedRef} className="typed" />
        </p>
        <div className="social-links">
          {profile?.github_url && (
            <a href={profile.github_url} className="twitter" target="_blank" rel="noreferrer">
              <i className="bx bxl-github" />
            </a>
          )}
          {profile?.linkedin_url && (
            <a href={profile.linkedin_url} className="linkedin" target="_blank" rel="noreferrer">
              <i className="bx bxl-linkedin" />
            </a>
          )}
          {profile?.twitter_url && (
            <a href={profile.twitter_url} className="twitter" target="_blank" rel="noreferrer">
              <i className="bx bxl-twitter" />
            </a>
          )}
          {profile?.email && (
            <a href={`mailto:${profile.email}`} className="google-plus">
              <i className="bx bxl-gmail" />
            </a>
          )}
          {/* Static socials from original template */}
          <a href="https://wa.me/0112284093" className="linkedin" target="_blank" rel="noreferrer">
            <i className="bx bxl-whatsapp" />
          </a>
          <a href="https://www.instagram.com/imran_gadafi" className="instagram" target="_blank" rel="noreferrer">
            <i className="bx bxl-instagram" />
          </a>
          <a href="https://youtube.com/@gadafi_imran?si=zPSLc6EQfnmW1cmo" className="youtube" target="_blank" rel="noreferrer">
            <i className="bx bxl-youtube" />
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── ABOUT SECTION ────────────────────────────────────────────────────────────
function AboutSection({ profile }) {
  if (!profile) {
    return (
      <section id="about" className="about">
        <div className="container" data-aos="fade-up">
          <div className="section-title"><h2>About</h2></div>
          <div className="row">
            <div className="col-lg-4"><Skeleton style={{ height: 300 }} /></div>
            <div className="col-lg-8 pt-4 pt-lg-0">
              <Skeleton style={{ height: 24, marginBottom: 12 }} />
              <Skeleton style={{ height: 16, marginBottom: 8 }} />
              <Skeleton style={{ height: 16, marginBottom: 8 }} />
              <Skeleton style={{ height: 16, width: "60%" }} />
            </div>
          </div>
        </div>
      </section>
    );
  }

  const availabilityBadge = {
    available: { label: "Available for Work", cls: "badge bg-success" },
    busy: { label: "Currently Busy", cls: "badge bg-danger" },
    open: { label: "Open to Opportunities", cls: "badge bg-warning text-dark" },
  }[profile.availability] || { label: profile.availability_label, cls: "badge bg-secondary" };

  return (
    <section id="about" className="about">
      <div className="container" data-aos="fade-up">
        <div className="section-title">
          <h2>About</h2>
          <p>{profile.bio_short || profile.bio}</p>
        </div>
        <div className="row">
          <div className="col-lg-4">
            {profile.avatar ? (
              <img src={profile.avatar} id="profile" className="profile img-fluid" alt={profile.full_name} />
            ) : (
              <div className="profile img-fluid d-flex align-items-center justify-content-center" style={{ background: "#0563bb22", borderRadius: 8, minHeight: 280 }}>
                <i className="bx bx-user" style={{ fontSize: 80, color: "#0563bb" }} />
              </div>
            )}
          </div>
          <div className="col-lg-8 pt-4 pt-lg-0 content">
            <h3>{profile.title}</h3>
            <p className="fst-italic">{profile.tagline}</p>
            <span className={availabilityBadge.cls} style={{ marginBottom: 16, display: "inline-block" }}>
              {availabilityBadge.label}
            </span>
            <div className="row">
              <div className="col-lg-6">
                <ul>
                  <li><i className="bi bi-chevron-right" /> <strong>Name:</strong> <span>{profile.full_name}</span></li>
                  {profile.website_url && (
                    <li><i className="bi bi-chevron-right" /> <strong>Website:</strong> <span><a href={profile.website_url} target="_blank" rel="noreferrer">{profile.website_url.replace(/^https?:\/\//, "")}</a></span></li>
                  )}
                  {profile.phone && (
                    <li><i className="bi bi-chevron-right" /> <strong>Phone:</strong> <span>{profile.phone}</span></li>
                  )}
                  <li><i className="bi bi-chevron-right" /> <strong>City:</strong> <span>{profile.location}</span></li>
                </ul>
              </div>
              <div className="col-lg-6">
                <ul>
                  <li><i className="bi bi-chevron-right" /> <strong>Experience:</strong> <span>{profile.years_experience}+ years</span></li>
                  <li><i className="bi bi-chevron-right" /> <strong>Email:</strong> <span>{profile.email}</span></li>
                  <li><i className="bi bi-chevron-right" /> <strong>Remote:</strong> <span>{profile.open_to_remote ? "Available" : "On-site only"}</span></li>
                  {profile.open_to_relocation && (
                    <li><i className="bi bi-chevron-right" /> <strong>Relocation:</strong> <span>Open</span></li>
                  )}
                </ul>
              </div>
            </div>
            <p>{profile.bio}</p>
            {profile.resume && (
              <a href={profile.resume} className="btn btn-primary mt-2" download>
                <i className="bi bi-download me-1" /> Download Resume
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── STATS / FACTS SECTION ────────────────────────────────────────────────────
function StatsSection({ stats }) {
  const counterRefs = useRef([]);

  useEffect(() => {
    if (!stats?.length || !window.PureCounter) return;
    // PureCounter auto-initialises on elements with the purecounter class
    new window.PureCounter();
  }, [stats]);

  // Fallback static facts if API is empty
  const displayStats = stats?.length
    ? stats
    : [
        { id: 1, value: "48", label: "Happy Clients", icon_class: "bi bi-emoji-smile" },
        { id: 2, value: "253", label: "Projects", icon_class: "bi bi-journal-richtext" },
        { id: 3, value: "1624", label: "Hours Of Support", icon_class: "bi bi-headset" },
        { id: 4, value: "8", label: "Awards", icon_class: "bi bi-award" },
      ];

  return (
    <section id="facts" className="facts">
      <div className="container" data-aos="fade-up">
        <div className="section-title">
          <h2>Facts</h2>
          <p>
            Despite being in the midst of my academic pursuits, I've actively sought opportunities to apply my
            knowledge and skills in real-world settings. My work experience spans various projects and internships,
            each contributing to my growth and understanding of the tech industry.
          </p>
        </div>
        <div className="row">
          {displayStats.map((stat, i) => {
            const numericVal = parseInt(stat.value, 10) || 0;
            return (
              <div key={stat.id || i} className="col-lg-3 col-md-6">
                <div className="count-box">
                  <i className={stat.icon_class || "bi bi-star"} />
                  <span
                    data-purecounter-start="0"
                    data-purecounter-end={numericVal}
                    data-purecounter-duration="1"
                    className="purecounter"
                  >
                    {numericVal}
                  </span>
                  <p>{stat.label}{stat.value.includes("+") ? "+" : ""}</p>
                  {stat.description && <small className="text-muted">{stat.description}</small>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ─── SKILLS SECTION ───────────────────────────────────────────────────────────
function SkillsSection({ skills: categories }) {
  const proficiencyToPercent = (p) => ({ 1: 20, 2: 40, 3: 60, 4: 80, 5: 100 }[p] || 60);

  if (!categories?.length) {
    // Static fallback matching original template
    const staticSkills = [
      { name: "Django", val: 100 }, { name: "React", val: 90 }, { name: "Python", val: 90 },
      { name: "Node.js", val: 80 }, { name: "RESTful APIs", val: 80 }, { name: "CSS & HTML", val: 90 },
      { name: "JavaScript", val: 75 }, { name: "MySQL & PostgreSQL", val: 89 },
      { name: "Laravel", val: 60 }, { name: "PHP", val: 60 }, { name: "C#", val: 70 },
      { name: "ASP.NET", val: 70 }, { name: "JAVA", val: 75 }, { name: "Git & AWS", val: 70 },
    ];
    const half = Math.ceil(staticSkills.length / 2);
    return (
      <section id="skills" className="skills section-bg">
        <div className="container" data-aos="fade-up">
          <div className="section-title">
            <h2>Skills</h2>
            <p>Every programmer has a story about how they learned to write their first program.</p>
          </div>
          <div className="row skills-content">
            <div className="col-lg-6">
              {staticSkills.slice(0, half).map((s) => <SkillBar key={s.name} name={s.name} val={s.val} />)}
            </div>
            <div className="col-lg-6">
              {staticSkills.slice(half).map((s) => <SkillBar key={s.name} name={s.name} val={s.val} />)}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // All skills flattened and split into two columns
  const allSkills = categories.flatMap((cat) =>
    cat.skills.map((sk) => ({
      name: sk.name,
      val: proficiencyToPercent(sk.proficiency),
      label: sk.proficiency_label,
    }))
  );
  const half = Math.ceil(allSkills.length / 2);

  return (
    <section id="skills" className="skills section-bg">
      <div className="container" data-aos="fade-up">
        <div className="section-title">
          <h2>Skills</h2>
          <p>
            Every programmer has a story. I started when my father was working for KEMRI — one of Kenya's pioneering
            companies with modern computing — and my curiosity for technology never stopped growing.
          </p>
        </div>

        {/* Category badges */}
        <div className="mb-4 d-flex flex-wrap gap-2">
          {categories.map((cat) => (
            <span key={cat.id} className="badge rounded-pill" style={{ background: "#0563bb22", color: "#0563bb", fontWeight: 600, fontSize: "0.8rem", padding: "6px 14px" }}>
              {cat.icon && <i className={`${cat.icon} me-1`} />}
              {cat.name}
            </span>
          ))}
        </div>

        <div className="row skills-content">
          <div className="col-lg-6">
            {allSkills.slice(0, half).map((s, i) => <SkillBar key={i} name={s.name} val={s.val} />)}
          </div>
          <div className="col-lg-6">
            {allSkills.slice(half).map((s, i) => <SkillBar key={i} name={s.name} val={s.val} />)}
          </div>
        </div>
      </div>
    </section>
  );
}

function SkillBar({ name, val }) {
  return (
    <div className="progress">
      <span className="skill">
        {name} <i className="val">{val}%</i>
      </span>
      <div className="progress-bar-wrap">
        <div
          className="progress-bar"
          role="progressbar"
          aria-valuenow={val}
          aria-valuemin="0"
          aria-valuemax="100"
          style={{ width: `${val}%` }}
        />
      </div>
    </div>
  );
}

// ─── RESUME SECTION ───────────────────────────────────────────────────────────
function ResumeSection({ experiences, education }) {
  return (
    <section id="resume" className="resume">
      <div className="container" data-aos="fade-up">
        <div className="section-title">
          <h2>Resume</h2>
          <p>
            What I say: "I'm a Software Developer." What people hear: "I can repair your computer, fix your internet,
            configure your printer, revive your phone." What I mean: I can search the web better than an average bear.
          </p>
        </div>
        <div className="row">
          {/* ── LEFT COLUMN: Summary + Education ──────────────────────────── */}
          <div className="col-lg-6">
            <h3 className="resume-title">Summary</h3>
            <div className="resume-item pb-0">
              <h4>Steve Ongera</h4>
              <p>
                <em>
                  A self-taught software developer with a passion for technology and hands-on experience in web
                  application development and AI. Committed to continuous learning and innovation.
                </em>
              </p>
              <ul>
                <li>Nairobi, Kenya</li>
                <li>(+254) 112-284-093</li>
                <li>steveongera001@gmail.com</li>
              </ul>
            </div>

            <h3 className="resume-title">Education</h3>
            {education?.length ? (
              education.map((edu) => (
                <div key={edu.id} className="resume-item">
                  <h4>{edu.degree} — {edu.field_of_study}</h4>
                  <h5>
                    {edu.start_date?.slice(0, 4)} –{" "}
                    {edu.is_current ? "Present" : edu.end_date?.slice(0, 4) || "N/A"}
                    {edu.is_current && " (Ongoing)"}
                  </h5>
                  <p>
                    <em>
                      {edu.institution}
                      {edu.institution_url && (
                        <a href={edu.institution_url} target="_blank" rel="noreferrer" className="ms-1">
                          <i className="bi bi-box-arrow-up-right" />
                        </a>
                      )}
                    </em>
                  </p>
                  {edu.description && <p>{edu.description}</p>}
                  {edu.grade && <p><strong>Grade:</strong> {edu.grade}</p>}
                </div>
              ))
            ) : (
              <>
                <div className="resume-item">
                  <h4>Bachelor of Science — Information Technology</h4>
                  <h5>2022 – 2026 (Ongoing)</h5>
                  <p><em>Murang'a University of Science &amp; Technology, Kenya</em></p>
                  <p>Third year student pursuing BSc. IT — merging academic excellence with practical experience.</p>
                </div>
                <div className="resume-item">
                  <h4>High School &amp; Secondary Education</h4>
                  <h5>2017 – 2022</h5>
                  <p><em>Moi High School — Gesusu</em></p>
                  <p>Actively participated in hackathons and coding competitions, building a passion for innovation.</p>
                </div>
              </>
            )}
          </div>

          {/* ── RIGHT COLUMN: Work Experience ─────────────────────────────── */}
          <div className="col-lg-6">
            <h3 className="resume-title">Work Experience</h3>
            {experiences?.length ? (
              experiences.map((exp) => (
                <div key={exp.id} className="resume-item">
                  <h4>{exp.role}</h4>
                  <h5>
                    {exp.start_date?.slice(0, 7)} –{" "}
                    {exp.is_current ? "Present" : exp.end_date?.slice(0, 7) || "N/A"}
                    {exp.duration && <span className="ms-2 text-muted">({exp.duration})</span>}
                  </h5>
                  <p>
                    <em>
                      {exp.company}
                      {exp.location && `, ${exp.location}`}
                      {exp.company_url && (
                        <a href={exp.company_url} target="_blank" rel="noreferrer" className="ms-1">
                          <i className="bi bi-box-arrow-up-right" />
                        </a>
                      )}
                    </em>
                  </p>
                  {exp.description && <p>{exp.description}</p>}
                  {exp.achievements?.length > 0 && (
                    <ul>
                      {exp.achievements.map((a, i) => <li key={i}>{a}</li>)}
                    </ul>
                  )}
                </div>
              ))
            ) : (
              <>
                <div className="resume-item">
                  <h4>Meal Ordering System</h4>
                  <h5>2023</h5>
                  <p><em>Bora Chakula, Murang'a University, KE</em></p>
                  <ul>
                    <li>Designed and developed a meal ordering platform reducing queue time by 70%.</li>
                    <li>Integrated M-Pesa payments for seamless mobile transactions.</li>
                    <li>Built a responsive interface with real-time notifications.</li>
                  </ul>
                </div>
                <div className="resume-item">
                  <h4>Hospital Management System</h4>
                  <h5>2024</h5>
                  <p><em>Health Solutions, Nairobi, KE</em></p>
                  <ul>
                    <li>Developed an admin portal for patient, staff, and record management.</li>
                    <li>Implemented bed allocation, appointment scheduling, and portals.</li>
                    <li>Built with Django ensuring data security and role-based access.</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── PORTFOLIO SECTION ────────────────────────────────────────────────────────
function PortfolioSection({ projects }) {
  const [filter, setFilter] = useState("*");
  const [lightboxUrl, setLightboxUrl] = useState(null);

  // Derive unique years from projects for filter buttons
  const years = projects?.length
    ? [...new Set(projects.map((p) => p.start_date?.slice(0, 4)).filter(Boolean))].sort()
    : ["2022", "2023", "2024", "2025"];

  const filtered =
    filter === "*"
      ? projects
      : projects?.filter((p) => p.start_date?.startsWith(filter));

  const isLoading = !projects;

  return (
    <section id="portfolio" className="portfolio section-bg">
      <div className="container" data-aos="fade-up">
        <div className="section-title">
          <h2>Portfolio</h2>
          <p>
            In my work with clients, I prioritise clear communication and understanding their unique needs to
            deliver tailored solutions. My goal is to build lasting partnerships by consistently exceeding
            expectations.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="row">
          <div className="col-lg-12 d-flex justify-content-center" data-aos="fade-up" data-aos-delay="100">
            <ul id="portfolio-flters">
              <li
                className={filter === "*" ? "filter-active" : ""}
                onClick={() => setFilter("*")}
                style={{ cursor: "pointer" }}
              >
                All
              </li>
              {years.map((y) => (
                <li
                  key={y}
                  className={filter === y ? "filter-active" : ""}
                  onClick={() => setFilter(y)}
                  style={{ cursor: "pointer" }}
                >
                  {y}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Project grid */}
        <div className="row portfolio-container" data-aos="fade-up" data-aos-delay="200">
          {isLoading &&
            [...Array(6)].map((_, i) => (
              <div key={i} className="col-lg-4 col-md-6">
                <Skeleton style={{ height: 220, marginBottom: 16 }} />
              </div>
            ))}

          {filtered?.length === 0 && !isLoading && (
            <div className="col-12 text-center py-5 text-muted">
              <i className="bi bi-folder2-open" style={{ fontSize: 48 }} />
              <p className="mt-2">No projects found for {filter}</p>
            </div>
          )}

          {filtered?.map((project) => (
            <div key={project.id} className="col-lg-4 col-md-6 portfolio-item">
              <div className="portfolio-wrap">
                {project.thumbnail ? (
                  <img src={project.thumbnail} className="img-fluid" alt={project.title} />
                ) : (
                  <div
                    className="img-fluid d-flex align-items-center justify-content-center"
                    style={{ background: "#0563bb11", minHeight: 180 }}
                  >
                    <i className="bi bi-code-square" style={{ fontSize: 48, color: "#0563bb" }} />
                  </div>
                )}
                <div className="portfolio-info">
                  <h4>{project.title}</h4>
                  <p>{project.short_description}</p>
                  <div className="portfolio-links">
                    {project.thumbnail && (
                      <a
                        href={project.thumbnail}
                        className="portfolio-lightbox"
                        title={project.title}
                        onClick={(e) => { e.preventDefault(); setLightboxUrl(project.thumbnail); }}
                      >
                        <i className="bx bx-plus" />
                      </a>
                    )}
                    {project.live_url && (
                      <a href={project.live_url} target="_blank" rel="noreferrer" title="Live Demo">
                        <i className="bx bx-link" />
                      </a>
                    )}
                    {project.github_url && (
                      <a href={project.github_url} target="_blank" rel="noreferrer" title="GitHub">
                        <i className="bx bxl-github" />
                      </a>
                    )}
                  </div>

                  {/* Tech stack badges */}
                  {project.tech_stack?.length > 0 && (
                    <div className="mt-2 d-flex flex-wrap gap-1">
                      {project.tech_stack.slice(0, 4).map((sk) => (
                        <span
                          key={sk.id}
                          className="badge"
                          style={{ background: "#0563bb", fontSize: "0.65rem" }}
                        >
                          {sk.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Simple lightbox overlay */}
      {lightboxUrl && (
        <div
          style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.85)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center" }}
          onClick={() => setLightboxUrl(null)}
        >
          <img src={lightboxUrl} alt="preview" style={{ maxWidth: "90vw", maxHeight: "90vh", borderRadius: 8 }} />
          <button
            onClick={() => setLightboxUrl(null)}
            style={{ position: "absolute", top: 20, right: 20, background: "none", border: "none", color: "#fff", fontSize: 32, cursor: "pointer" }}
          >
            <i className="bi bi-x-lg" />
          </button>
        </div>
      )}
    </section>
  );
}

// ─── SERVICES SECTION ─────────────────────────────────────────────────────────
const SERVICE_ICON_MAP = {
  web: "bx bxl-dribbble",
  database: "bx bx-file",
  api: "bx bx-tachometer",
  devops: "bx bx-layer",
  deploy: "bx bx-slideshow",
  mobile: "bx bx-arch",
};

const SERVICE_COLORS = ["iconbox-blue", "iconbox-orange", "iconbox-pink", "iconbox-yellow", "iconbox-red", "iconbox-teal"];

const STATIC_SERVICES = [
  { id: 1, title: "Web Development", short_description: "Building cool and responsive websites based on client needs.", icon_class: "bx bxl-dribbble" },
  { id: 2, title: "Database Management", short_description: "Designing efficient databases with strong security rules.", icon_class: "bx bx-file" },
  { id: 3, title: "API Development", short_description: "Creating robust APIs for seamless integration between systems.", icon_class: "bx bx-tachometer" },
  { id: 4, title: "DevOps & Deployment", short_description: "Implementing CI/CD pipelines and automating deployment.", icon_class: "bx bx-layer" },
  { id: 5, title: "Deploying Websites Online", short_description: "We deploy and monitor software regularly for bug fixes.", icon_class: "bx bx-slideshow" },
  { id: 6, title: "Mobile App Development", short_description: "Building cross-platform mobile apps with exceptional UX.", icon_class: "bx bx-arch" },
];

function ServicesSection({ services }) {
  const display = services?.length ? services : STATIC_SERVICES;

  return (
    <section id="services" className="services">
      <div className="container" data-aos="fade-up">
        <div className="section-title">
          <h2>Services</h2>
          <p>
            Crafting modern and responsive websites tailored to your needs — from design to deployment. Delivering
            exceptional user experiences and designing efficient database structures.
          </p>
        </div>
        <div className="row">
          {display.map((svc, i) => (
            <div key={svc.id || i} className="col-lg-4 col-md-6 d-flex align-items-stretch mt-4" data-aos="zoom-in" data-aos-delay={100 + (i % 3) * 100}>
              <div className={`icon-box ${SERVICE_COLORS[i % SERVICE_COLORS.length]}`}>
                <div className="icon">
                  <svg width="100" height="100" viewBox="0 0 600 600" xmlns="http://www.w3.org/2000/svg">
                    <path stroke="none" strokeWidth="0" fill="#f5f5f5" d="M300,521C376,517,466,529,510,468C554,407,508,328,491,256C474,184,479,96,416,58C348,18,261,40,193,78C130,114,98,179,76,249C51,328,13,421,66,486C119,550,217,524,300,521" />
                  </svg>
                  <i className={svc.icon_class || "bx bx-cog"} />
                </div>
                <h4><a href={svc.slug ? `/services/${svc.slug}` : "#"}>{svc.title}</a></h4>
                <p>{svc.short_description}</p>
                {svc.price_from && (
                  <p className="mt-2" style={{ color: "#0563bb", fontWeight: 600 }}>
                    From {svc.currency} {parseFloat(svc.price_from).toLocaleString()}
                    {svc.delivery_days && <span className="text-muted fw-normal"> · {svc.delivery_days} days</span>}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── TESTIMONIALS SECTION ────────────────────────────────────────────────────
const STATIC_TESTIMONIALS = [
  { id: 1, author_name: "David Waweru", author_title: "Software Engineer", content: "Steve's dedication and expertise in web development were instrumental in bringing our project to life. His attention to detail and proactive communication made the entire process seamless.", rating: 5 },
  { id: 2, author_name: "Mize Khalfan", author_title: "Full Stack Developer", content: "Working with Steve was a pleasure from start to finish. His professionalism and technical proficiency were evident throughout the project. He consistently went above and beyond.", rating: 5 },
  { id: 3, author_name: "Maulid Hassan", author_title: "Client", content: "Steve's problem-solving skills and innovative approach were invaluable in overcoming complex challenges in our mobile app development project.", rating: 5 },
  { id: 4, author_name: "Mr. Kevin Agina", author_title: "Senior Lecturer", content: "His depth of knowledge and attention to detail ensured our database architecture was optimised for performance and scalability.", rating: 5 },
  { id: 5, author_name: "Dr. Rachael", author_title: "C.O.D Murang'a University", content: "Steve played a crucial role in the successful implementation of our API integration project, demonstrating a strong commitment to understanding our business needs.", rating: 5 },
];

function TestimonialsSection({ testimonials }) {
  const swiperRef = useRef(null);
  const display = testimonials?.length ? testimonials : STATIC_TESTIMONIALS;

  useEffect(() => {
    if (!window.Swiper || !swiperRef.current) return;
    const sw = new window.Swiper(swiperRef.current, {
      speed: 600,
      loop: true,
      autoplay: { delay: 5000, disableOnInteraction: false },
      slidesPerView: "auto",
      pagination: { el: ".swiper-pagination", type: "bullets", clickable: true },
    });
    return () => sw.destroy(true, true);
  }, [display]);

  return (
    <section id="testimonials" className="testimonials section-bg">
      <div className="container" data-aos="fade-up">
        <div className="section-title"><h2>Testimonials</h2></div>
        <div className="testimonials-slider swiper" ref={swiperRef} data-aos="fade-up" data-aos-delay="100">
          <div className="swiper-wrapper">
            {display.map((t) => (
              <div key={t.id} className="swiper-slide">
                <div className="testimonial-item">
                  {t.author_avatar ? (
                    <img src={t.author_avatar} className="testimonial-img" alt={t.author_name} />
                  ) : (
                    <div
                      className="testimonial-img d-flex align-items-center justify-content-center"
                      style={{ width: 80, height: 80, borderRadius: "50%", background: "#0563bb22", flexShrink: 0 }}
                    >
                      <i className="bx bx-user" style={{ fontSize: 36, color: "#0563bb" }} />
                    </div>
                  )}
                  <h3>{t.author_name}</h3>
                  <h4>
                    {t.author_title}
                    {t.author_company && ` — ${t.author_company}`}
                  </h4>
                  {/* Star rating */}
                  <div className="mb-2">
                    {[...Array(5)].map((_, i) => (
                      <i key={i} className={`bx ${i < (t.rating || 5) ? "bxs-star" : "bx-star"}`} style={{ color: "#f4b400", fontSize: 14 }} />
                    ))}
                  </div>
                  <p>
                    <i className="bx bxs-quote-alt-left quote-icon-left" />
                    {t.content}
                    <i className="bx bxs-quote-alt-right quote-icon-right" />
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="swiper-pagination" />
        </div>
      </div>
    </section>
  );
}

// ─── CONTACT SECTION ──────────────────────────────────────────────────────────
function ContactSection({ profile }) {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState("idle"); // idle | loading | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      await sendContactMessage(form);
      setStatus("success");
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      setStatus("error");
      setErrorMsg(err.message || "Something went wrong. Please try again.");
    }
  };

  return (
    <section id="contact" className="contact">
      <div className="container" data-aos="fade-up">
        <div className="section-title"><h2>Contact</h2></div>
        <div className="row mt-1">
          <div className="col-lg-4">
            <div className="info">
              <div className="address">
                <i className="bi bi-geo-alt" />
                <h4>Location:</h4>
                <p>{profile?.location || "Kasarani Mwiki, Nairobi Kenya"}</p>
              </div>
              <div className="email">
                <i className="bi bi-envelope" />
                <h4>Email:</h4>
                <p><a href={`mailto:${profile?.email || "steveongera001@gmail.com"}`}>{profile?.email || "steveongera001@gmail.com"}</a></p>
              </div>
              <div className="phone">
                <i className="bi bi-phone" />
                <h4>Call:</h4>
                <p>{profile?.phone || "+254 11-2284-093"}</p>
              </div>
            </div>
          </div>

          <div className="col-lg-8 mt-5 mt-lg-0">
            {status === "success" ? (
              <div className="alert alert-success d-flex align-items-center gap-2" role="alert">
                <i className="bi bi-check-circle-fill" style={{ fontSize: 22 }} />
                <div>
                  <strong>Message sent!</strong> I'll get back to you within 24 hours.
                </div>
              </div>
            ) : (
              <div onSubmit={handleSubmit} className="php-email-form">
                <div className="row">
                  <div className="col-md-6 form-group">
                    <input
                      type="text"
                      name="name"
                      className="form-control"
                      placeholder="Your Name"
                      required
                      value={form.name}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="col-md-6 form-group mt-3 mt-md-0">
                    <input
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="Your Email"
                      required
                      value={form.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="form-group mt-3">
                  <input
                    type="text"
                    name="subject"
                    className="form-control"
                    placeholder="Subject"
                    required
                    value={form.subject}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group mt-3">
                  <textarea
                    name="message"
                    className="form-control"
                    rows="5"
                    placeholder="Message"
                    required
                    value={form.message}
                    onChange={handleChange}
                  />
                </div>
                {status === "error" && (
                  <div className="alert alert-danger mt-3" role="alert">
                    <i className="bi bi-exclamation-triangle-fill me-2" />
                    {errorMsg}
                  </div>
                )}
                <div className="text-center mt-3">
                  <button
                    type="button"
                    className="btn btn-primary"
                    disabled={status === "loading"}
                    onClick={handleSubmit}
                  >
                    {status === "loading" ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true" />
                        Sending…
                      </>
                    ) : (
                      "Send Message"
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── CERTIFICATIONS SECTION (bonus, not in original but in data) ──────────────
function CertificationsSection({ certifications }) {
  if (!certifications?.length) return null;
  return (
    <section id="certifications" className="facts" style={{ background: "#f9f9f9" }}>
      <div className="container" data-aos="fade-up">
        <div className="section-title">
          <h2>Certifications</h2>
          <p>Professional certifications that validate my skills and expertise.</p>
        </div>
        <div className="row g-3">
          {certifications.map((cert) => (
            <div key={cert.id} className="col-lg-4 col-md-6">
              <div className="card h-100 border-0 shadow-sm" style={{ borderRadius: 12 }}>
                <div className="card-body p-4">
                  {cert.badge_image && (
                    <img src={cert.badge_image} alt={cert.title} style={{ width: 56, height: 56, objectFit: "contain", marginBottom: 12 }} />
                  )}
                  <h5 className="card-title mb-1" style={{ color: "#0563bb" }}>{cert.title}</h5>
                  <p className="text-muted small mb-1">{cert.issuing_organization}</p>
                  <p className="text-muted small mb-2">
                    Issued: {cert.issue_date}
                    {cert.expiry_date && ` · Expires: ${cert.expiry_date}`}
                  </p>
                  {cert.credential_url && (
                    <a href={cert.credential_url} className="btn btn-sm btn-outline-primary" target="_blank" rel="noreferrer">
                      <i className="bi bi-patch-check me-1" /> Verify
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── NAVBAR + HEADER ─────────────────────────────────────────────────────────
function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section");
      const scrollPos = window.scrollY + 200;
      sections.forEach((s) => {
        const top = s.offsetTop;
        const height = s.offsetHeight;
        if (scrollPos >= top && scrollPos < top + height) {
          document.querySelectorAll(".nav-link").forEach((a) => a.classList.remove("active"));
          const link = document.querySelector(`.nav-link[href="#${s.id}"]`);
          if (link) link.classList.add("active");
        }
      });
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { href: "#hero", icon: "bx bx-home", label: "Home" },
    { href: "#about", icon: "bx bx-user", label: "About" },
    { href: "#resume", icon: "bx bx-file-blank", label: "Resume" },
    { href: "#portfolio", icon: "bx bx-book-content", label: "Portfolio" },
    { href: "#services", icon: "bx bx-server", label: "Services" },
    { href: "#contact", icon: "bx bx-envelope", label: "Contact" },
  ];

  return (
    <>
      <i
        className={`bi ${mobileOpen ? "bi-x" : "bi-list"} mobile-nav-toggle d-lg-none`}
        onClick={() => setMobileOpen((o) => !o)}
        style={{ cursor: "pointer" }}
      />
      <header id="header" className="d-flex flex-column justify-content-center">
        <nav id="navbar" className={`navbar nav-menu ${mobileOpen ? "navbar-mobile" : ""}`}>
          <ul>
            {navItems.map(({ href, icon, label }) => (
              <li key={href}>
                <a
                  href={href}
                  className="nav-link scrollto"
                  onClick={() => setMobileOpen(false)}
                >
                  <i className={icon} /> <span>{label}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>
    </>
  );
}

// ─── FOOTER ───────────────────────────────────────────────────────────────────
function Footer({ profile }) {
  return (
    <footer id="footer">
      <div className="container">
        <h3>{profile?.full_name || "Steve Ongera"}</h3>
        <p>{profile?.tagline || "I am a good team player and I can adapt to any situation."}</p>
        <div className="social-links">
          <a href="https://wa.me/0112284093" className="twitter" target="_blank" rel="noreferrer"><i className="bx bxl-whatsapp" /></a>
          <a href={`mailto:${profile?.email || "steveongera001@gmail.com"}`} className="facebook"><i className="bx bxl-gmail" /></a>
          <a href="https://www.instagram.com/imran_gadafi" className="instagram" target="_blank" rel="noreferrer"><i className="bx bxl-instagram" /></a>
          {profile?.github_url && <a href={profile.github_url} className="google-plus" target="_blank" rel="noreferrer"><i className="bx bxl-github" /></a>}
          {profile?.linkedin_url && <a href={profile.linkedin_url} className="linkedin" target="_blank" rel="noreferrer"><i className="bx bxl-linkedin" /></a>}
          <a href="https://youtube.com/@gadafi_imran?si=zPSLc6EQfnmW1cmo" className="youtube" target="_blank" rel="noreferrer"><i className="bx bxl-youtube" /></a>
        </div>
        <div className="copyright">
          &copy; {new Date().getFullYear()} <strong><span>Kencom Softwares Ltd</span></strong>. All Rights Reserved
        </div>
        <div className="credits">
          <b>Developed by <a href="#">Steve Ongera | 0112284093</a></b>
        </div>
      </div>
    </footer>
  );
}

// ─── PRELOADER ────────────────────────────────────────────────────────────────
function Preloader({ visible }) {
  return <div id="preloader" style={{ display: visible ? "block" : "none" }} />;
}

// ─── BACK TO TOP ──────────────────────────────────────────────────────────────
function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 300);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <a
      href="#"
      className="back-to-top d-flex align-items-center justify-content-center"
      style={{ display: show ? "flex" : "none !important", opacity: show ? 1 : 0, visibility: show ? "visible" : "hidden" }}
      onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }}
    >
      <i className="bi bi-arrow-up-short" />
    </a>
  );
}

// ─── MAIN INDEX PAGE ──────────────────────────────────────────────────────────
export default function IndexPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useAOS();

  useEffect(() => {
    getPortfolioSummary()
      .then((d) => { setData(d); setLoading(false); })
      .catch((e) => { console.warn("API error, using fallback UI:", e.message); setError(e.message); setLoading(false); });
  }, []);

  // Re-init AOS after data loads
  useEffect(() => {
    if (!loading && window.AOS) setTimeout(() => window.AOS.refresh(), 300);
  }, [loading]);

  const profile = data?.profile || null;
  const skills = data?.skills || [];
  const projects = data?.featured_projects || null;
  const experiences = data?.experiences || [];
  const education = data?.education || [];
  const certifications = data?.certifications || [];
  const testimonials = data?.featured_testimonials || [];
  const services = data?.services || [];
  const stats = data?.stats || [];

  return (
    <>
      <Preloader visible={loading} />
      <Header />

      <HeroSection profile={profile} />

      <main id="main">
        <AboutSection profile={profile} />
        <StatsSection stats={stats} />
        <SkillsSection skills={skills} />
        <ResumeSection experiences={experiences} education={education} />
        <PortfolioSection projects={projects} />
        <ServicesSection services={services} />
        {certifications.length > 0 && <CertificationsSection certifications={certifications} />}
        <TestimonialsSection testimonials={testimonials} />
        <ContactSection profile={profile} />
      </main>

      <Footer profile={profile} />
      <BackToTop />

      {/* Shimmer animation */}
      <style>{`
        @keyframes shimmer {
          0%   { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .skeleton-box { display: block; }
        .portfolio-item { margin-bottom: 30px; }
        .php-email-form .form-group { margin-bottom: 0; }
      `}</style>
    </>
  );
}