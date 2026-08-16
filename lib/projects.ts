export type Cat = "bim" | "interiors" | "construction" | "asset";

export interface Project {
  slug: string;
  cat: Cat;
  title: string;
  sector: string;
  location: string;
  discipline: string;
  stage: string;
  technology: string[];
  image: string;
  summary: string;
  body: string[];
  scope: string[];
}

export const FILTERS: { cat: Cat | "all"; label: string }[] = [
  { cat: "all", label: "All Projects" },
  { cat: "bim", label: "BIM & Digital Delivery" },
  { cat: "interiors", label: "Design & Interiors" },
  { cat: "construction", label: "Construction Support" },
  { cat: "asset", label: "Asset Information" },
];

export const PROJECTS: Project[] = [
  {
    slug: "bim-coordination-cultural-campus",
    cat: "bim",
    title: "BIM Coordination for a Mixed-Use Cultural Campus",
    sector: "Institutional",
    location: "India",
    discipline: "BIM & VDC",
    stage: "As-Built",
    technology: ["Revit", "Navisworks", "ACC"],
    image: "/brand/projects/cultural-campus.jpg",
    summary:
      "Federated BIM coordination across architecture, structure and MEP for a multi-building cultural campus, resolving clashes before they reached the site team.",
    body: [
      "The campus brought together a performance hall, a library and an exhibition wing on a single shared podium — three design teams working to different schedules, all tying back into one structural and services grid.",
      "UCX ran federated model coordination from design development through issue-for-construction: publishing cadence across disciplines, clash detection sweeps at each milestone, and a shared coordination log so every resolved issue had a record the site team could trust.",
      "By the time drawings were issued for construction, the disciplines had already reconciled their geometry against one federated model — not three separate ones exported into the same folder.",
    ],
    scope: ["Federated BIM coordination", "Clash detection & resolution", "Multidisciplinary model management", "Coordination documentation"],
  },
  {
    slug: "hospitality-interior-design-documentation",
    cat: "interiors",
    title: "Interior Design & Documentation for a Hospitality Development",
    sector: "Hospitality",
    location: "UAE",
    discipline: "Design & Interiors",
    stage: "Construction",
    technology: ["Revit", "SketchUp", "ACC"],
    image: "/brand/projects/hospitality-interiors.jpg",
    summary:
      "Interior design development and construction documentation for a hospitality property, carrying concept intent through to a buildable drawing set.",
    body: [
      "The brief called for a guest experience built around material warmth and custom joinery — the kind of detail that reads well in a concept render but needs real resolution before it can go to site.",
      "UCX's interiors team worked alongside the design lead through design development, resolving material transitions, custom furniture details and services coordination, then carried that resolution into a full construction documentation set.",
      "The result was a drawing package the contractor could actually build from, without the usual second round of design decisions happening on site under deadline pressure.",
    ],
    scope: ["Interior design development", "Custom furniture detailing", "Construction documentation", "Material & finish coordination"],
  },
  {
    slug: "construction-support-medical-campus",
    cat: "construction",
    title: "Construction Support for a Regional Medical Campus",
    sector: "Healthcare",
    location: "India",
    discipline: "Construction Support",
    stage: "Construction",
    technology: ["Revit", "Navisworks", "ACC"],
    image: "/brand/projects/medical-campus.jpg",
    summary:
      "On-site aligned construction support and QA/QC coordination for a regional medical campus, keeping documentation in step with a fast-moving build.",
    body: [
      "Healthcare construction carries tighter tolerances than most sectors — services coordination in particular has almost no room for on-site improvisation once walls close in.",
      "UCX provided construction-phase support: tracking RFIs against the model, running QA/QC checks on issued drawings before they reached the contractor, and keeping the documentation set current as site conditions surfaced changes.",
      "The campus stayed on its documentation schedule through a construction phase that saw more late-stage coordination changes than the original program anticipated.",
    ],
    scope: ["Construction-phase support", "QA/QC coordination", "RFI tracking against model", "Documentation control"],
  },
  {
    slug: "asset-information-infrastructure-corridor",
    cat: "asset",
    title: "Asset Information Delivery for an Urban Infrastructure Corridor",
    sector: "Infrastructure",
    location: "United Kingdom",
    discipline: "Asset Information",
    stage: "As-Built",
    technology: ["Revit", "COBie", "ACC"],
    image: "/brand/projects/infrastructure-corridor.jpg",
    summary:
      "Structured asset information delivery for an urban infrastructure corridor, built to the client's data requirements from day one rather than reverse-engineered at handover.",
    body: [
      "Infrastructure corridors hand over to operations teams who need structured data more than they need visual detail — asset type, install date, maintenance record linkage.",
      "UCX defined the asset information requirements early against a COBie-equivalent structure, validated it against the operator's own FM software, and delivered a dataset built to be opened, not archived.",
      "The corridor's operations team had a usable asset register from day one of handover, not a design model relabeled as a digital twin.",
    ],
    scope: ["Asset information requirements", "COBie-structured data delivery", "FM system validation", "Digital handover support"],
  },
  {
    slug: "scan-to-bim-urban-development",
    cat: "bim",
    title: "Scan-to-BIM for a Multi-Zone Urban Development",
    sector: "Infrastructural",
    location: "United States",
    discipline: "Scan-to-BIM",
    stage: "Design",
    technology: ["Revit", "Recap", "Navisworks"],
    image: "/brand/projects/urban-development.jpg",
    summary:
      "Point-cloud-to-model translation across a multi-zone urban redevelopment, scoped to the specific decisions each zone's design team needed to make.",
    body: [
      "A multi-zone retrofit meant the scan-to-BIM scope wasn't uniform — a structural retrofit zone and an MEP re-route zone needed different things from the same underlying point cloud data.",
      "UCX defined level-of-development requirements per zone before scanning began, then modeled each zone to answer the specific questions its design team had, rather than modeling everything to a single blanket standard.",
      "That scoping decision kept the translation from as-built conditions to usable models on schedule across all zones, instead of the slowest zone setting the pace for the rest.",
    ],
    scope: ["Point cloud registration", "Scan-to-BIM modeling", "Level of development scoping", "As-built model QA"],
  },
  {
    slug: "workplace-interiors-corporate-hq",
    cat: "interiors",
    title: "Workplace Interiors for a Corporate Headquarters",
    sector: "Commercial",
    location: "India",
    discipline: "Workplace & Office",
    stage: "Design",
    technology: ["Revit", "SketchUp", "ACC"],
    image: "/brand/projects/corporate-workplace.jpg",
    summary:
      "Workplace interior design and delivery for a corporate headquarters fit-out, balancing an open-plan brief against real services and structural constraints.",
    body: [
      "The client wanted an open, flexible floor plate across several levels of an existing shell — which meant the interiors team was designing around structural columns, existing services risers and fire compartmentation rather than a blank slate.",
      "UCX worked through design development and documentation to reconcile the workplace brief with those fixed constraints, keeping the open-plan intent intact while resolving it against what the building could actually support.",
      "The fit-out delivered the flexible workplace the brief asked for, without the compromises that usually surface only once construction starts.",
    ],
    scope: ["Workplace interior design", "Fit-out documentation", "Services & structural coordination", "Modular furniture planning"],
  },
];

export function getProject(slug: string): Project | undefined {
  return PROJECTS.find((p) => p.slug === slug);
}
