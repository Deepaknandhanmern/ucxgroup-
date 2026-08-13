export default function Footer() {
  return (
    <footer className="ucx-footer">
      <div className="footer-top">
        <div className="badge-wrap">
          <svg viewBox="0 0 420 420" role="img" aria-label="UCX ecosystem badge: Design, Digital, Delivery, Asset">
            <defs>
              <radialGradient id="badgeGlow" cx="50%" cy="42%" r="65%">
                <stop offset="0%" stopColor="var(--primary-light)" />
                <stop offset="100%" stopColor="var(--primary)" />
              </radialGradient>
            </defs>

            <circle cx="210" cy="210" r="209" fill="var(--primary)" stroke="var(--secondary)" strokeWidth="1.5" opacity="1" />
            <circle cx="210" cy="210" r="198" fill="none" stroke="var(--white)" strokeWidth="0.75" opacity="0.18" />

            <g className="ring">
              <path id="arc1" fill="none" d="M226.5,52.9 A158,158 0 0,1 367.1,193.5" />
              <path id="arc2" fill="none" d="M367.1,226.5 A158,158 0 0,1 226.5,367.1" />
              <path id="arc3" fill="none" d="M193.5,367.1 A158,158 0 0,1 52.9,226.5" />
              <path id="arc4" fill="none" d="M52.9,193.5 A158,158 0 0,1 193.5,52.9" />

              <text className="ring-label">
                <textPath href="#arc1" startOffset="50%" textAnchor="middle">&middot; DESIGN &middot;</textPath>
              </text>
              <text className="ring-label">
                <textPath href="#arc2" startOffset="50%" textAnchor="middle">&middot; DIGITAL &middot;</textPath>
              </text>
              <text className="ring-label">
                <textPath href="#arc3" startOffset="50%" textAnchor="middle">&middot; DELIVERY &middot;</textPath>
              </text>
              <text className="ring-label">
                <textPath href="#arc4" startOffset="50%" textAnchor="middle">&middot; ASSET &middot;</textPath>
              </text>
            </g>

            <circle cx="210" cy="210" r="122" fill="url(#badgeGlow)" stroke="var(--secondary)" strokeWidth="1" opacity="1" />
            <image
              href="/brand/footer/ucx-mark-badge.png"
              x="122"
              y="177"
              width="176"
              height="90"
              preserveAspectRatio="xMidYMid meet"
            />
          </svg>
        </div>

        <div>
          <p className="eyebrow">UCX Engineering Technologies</p>
          <h2 className="headline">One connected delivery ecosystem</h2>
          <p className="services-line">DESIGN &middot; DIGITAL ENGINEERING &middot; PROJECT DELIVERY &middot; ASSET INFORMATION</p>
          <p className="location-line">India-based &middot; Global collaboration</p>
        </div>
      </div>

      <div className="footer-mid">
        <div>
          <p className="col-title">Explore</p>
          <ul className="col-links">
            <li><a href="#">Capabilities</a></li>
            <li><a href="#">Projects</a></li>
            <li><a href="#">Collaboration Lab</a></li>
            <li><a href="/about-us">About UCX</a></li>
            <li><a href="#">Insights</a></li>
          </ul>
        </div>

        <div>
          <p className="col-title">Connect</p>
          <a className="cta-link" href="#">
            Start a conversation <span>&rarr;</span>
          </a>
          <br />
          <a className="email-link" href="mailto:collaborate@ucx-group.com">collaborate@ucx-group.com</a>
        </div>

        <div>
          <p className="col-title">Follow</p>
          <div className="social-row">
            <a href="#">LinkedIn</a>
            <a href="#">Instagram</a>
            <a href="#">YouTube</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p className="copyright">&copy; 2026 UCX. All rights reserved.</p>
        <ul className="legal-links">
          <li><a href="#">Privacy</a></li>
          <li><a href="#">Terms</a></li>
          <li><a href="#">Cookies</a></li>
        </ul>
      </div>
    </footer>
  );
}
