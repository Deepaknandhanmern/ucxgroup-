export default function InteriorsHero() {
  return (
    <div className="ih-hero">
      <div className="ih-bg" aria-hidden="true">
        <span className="ih-blob b1"></span>
        <span className="ih-blob b2"></span>
        <span className="ih-blob b3"></span>
        <span className="ih-blob b4"></span>
        <div className="ih-grid"></div>
        <div className="ih-vignette"></div>
      </div>

      <div className="ih-content">
        <span className="ih-badge">
          <i></i> Design &amp; Interiors
        </span>

        <h1 className="ih-heading">
          <span className="ih-line ih-line-lead">Design, Documentation &amp;</span>
          <span className="ih-line ih-line-bold">Delivery</span>
          <span className="ih-line ih-line-italic">for Interior Environments</span>
        </h1>

        <p className="ih-intro">
          UCX combines interior design expertise with BIM, technical documentation, coordination and execution
          support to connect design intent with project delivery.
        </p>

        <div className="ih-actions">
          <a className="ih-cta ih-cta-solid" href="#closing">
            Start a Project
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h13M13 6l6 6-6 6" />
            </svg>
          </a>
          <a className="ih-cta ih-cta-ghost" href="#categories">
            Explore Our Work
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h13M13 6l6 6-6 6" />
            </svg>
          </a>
        </div>
      </div>

      <div className="ih-mark" aria-hidden="true">
        <svg viewBox="0 0 200 200">
          <defs>
            <path id="ihRingPath" d="M 100,100 m -78,0 a 78,78 0 1,1 156,0 a 78,78 0 1,1 -156,0" />
          </defs>
          <g className="ih-mark-spin">
            <text className="ih-mark-text">
              <textPath href="#ihRingPath" startOffset="0%">
                SPAYCEX &middot; DESIGN &amp; INTERIORS &middot; SPAYCEX &middot; DESIGN &amp; INTERIORS &middot;
              </textPath>
            </text>
          </g>
          <circle className="ih-mark-pulse" cx="100" cy="100" r="30" />
          <circle className="ih-mark-core" cx="100" cy="100" r="30" />
          <text className="ih-mark-letter" x="100" y="107" textAnchor="middle">
            S
          </text>
        </svg>
      </div>
    </div>
  );
}
