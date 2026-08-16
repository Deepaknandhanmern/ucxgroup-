export interface Author {
  name: string;
  role: string;
  photo: string;
}

export interface Post {
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  team: string;
  date: string;
  readTime: string;
  tags: string[];
  author: Author;
  body: string[];
}

const SHANGEETH: Author = {
  name: "Shangeeth Raju",
  role: "Associate, Digital Engineering",
  photo: "/brand/insights/authors/shangeeth-raju.jpg",
};

const BHUVANESHWARI: Author = {
  name: "Bhuvaneshwari",
  role: "Associate, Project & Construction Support",
  photo: "/brand/insights/authors/bhuvaneshwari.jpg",
};

export const POSTS: Post[] = [
  {
    slug: "construction-documentation-alignment",
    title: "Keeping Construction Documentation Aligned When the Design Keeps Changing",
    excerpt:
      "Design changes don't stop once documentation starts. The projects that stay on schedule are the ones with a process for absorbing late changes without the drawing set falling out of sync.",
    image: "/brand/insights/construction-documentation-alignment.jpg",
    team: "Project & Construction Support",
    date: "Aug 16, 2026",
    readTime: "5 min read",
    tags: ["Construction Support", "Documentation"],
    author: BHUVANESHWARI,
    body: [
      "Every project plan assumes design freezes at some point before construction documentation begins. In practice, it rarely does — client changes, site conditions and coordination fixes keep arriving well into the documentation phase, and the drawing set has to absorb them without falling behind.",
      "The projects that handle this well don't try to prevent late changes; they build a process that can take one in without re-touching every sheet it might affect. That means clear ownership of which drawings reference which model elements, and a revision workflow that flags downstream impact automatically instead of relying on someone remembering.",
      "Where this breaks down is usually not the big changes — those get noticed. It's the small ones: a socket moved six inches, a ceiling height adjusted for a duct clash, a finish swapped after a mockup review. Individually minor, but cumulatively they're what makes a drawing set drift out of sync with the model it's supposed to represent.",
      "Keeping documentation aligned isn't about slowing changes down. It's about making sure the record of the building updates as fast as the building's design does.",
    ],
  },
  {
    slug: "digital-twin-after-handover",
    title: "What Actually Makes a Digital Twin Useful After Handover",
    excerpt:
      "Most 'digital twins' delivered at handover are just detailed models nobody in facilities management ends up opening. Here's what separates a model that gets used from one that gets archived.",
    image: "/brand/insights/digital-twin-after-handover.jpg",
    team: "Asset & Digital Information",
    date: "Aug 15, 2026",
    readTime: "6 min read",
    tags: ["Asset Information", "Digital Handover"],
    author: SHANGEETH,
    body: [
      "A lot of projects deliver a 'digital twin' at handover that's really just a design model with a new label on it. It looks complete, it renders nicely in a walkthrough, and then it sits unopened in the facilities team's archive because it doesn't answer any of the questions they actually have day to day.",
      "The gap is almost always structured data, not geometry. Facilities teams don't need a beautifully modeled ceiling void — they need to know which asset it belongs to, when it was installed, and where the maintenance record lives. If that data isn't structured and linked at handover, no amount of visual detail makes the twin useful.",
      "The projects where the twin actually gets used are the ones where asset data requirements were defined early, alongside COBie or an equivalent structured format, and validated against what the FM team's software could actually ingest — not assumed to work because the model looked right.",
      "A digital twin earns that name by being opened six months after handover, not by how good it looks on delivery day.",
    ],
  },
  {
    slug: "why-bim-coordination-still-fails",
    title: "Why BIM Coordination Still Fails on Multidisciplinary Projects",
    excerpt:
      "Clash detection is the easy part. The real coordination problem is getting architecture, structure and MEP teams to agree on a single source of truth before it becomes expensive on site.",
    image: "/brand/insights/bim-coordination.jpg",
    team: "BIM & Digital Delivery",
    date: "Jan 12, 2026",
    readTime: "6 min read",
    tags: ["BIM", "Coordination"],
    author: BHUVANESHWARI,
    body: [
      "Most BIM coordination programs are judged by how many clashes they close before issue-for-construction. That's the visible part of the job, and it's genuinely useful — but it also isn't where multidisciplinary projects actually go wrong.",
      "The real failure point is earlier: architecture, structure and MEP teams working off models that were exported, versioned and re-imported through different pipelines, each one slightly out of sync with the others by the time anyone opens a federated view. By the time a clash report gets generated, the teams are often already arguing about whose model is 'current.'",
      "A working coordination process starts with agreeing on a single federated environment before design development gets very far — not just a shared folder, but a shared cadence for when models get published, who owns which discipline's geometry, and how tolerances are handled at discipline boundaries.",
      "None of that shows up in a clash report. It shows up in how few surprises the site team gets six months later.",
    ],
  },
  {
    slug: "scan-to-bim-as-built-conditions",
    title: "Scan-to-BIM: Turning As-Built Conditions into Usable Models",
    excerpt:
      "Point clouds are only useful once someone turns them into a model a design team can actually build on. Here's how that translation step decides whether a retrofit project stays on schedule.",
    image: "/brand/insights/scan-to-bim.jpg",
    team: "Digital Engineering",
    date: "Dec 18, 2025",
    readTime: "5 min read",
    tags: ["Scan-to-BIM", "Digital Engineering"],
    author: SHANGEETH,
    body: [
      "A laser scan tells you exactly where a building's surfaces are. It doesn't tell you what's a structural wall, what's a later partition, or which duct run is actually still in service. That interpretation step is where scan-to-BIM projects either save a retrofit schedule or quietly derail it.",
      "The biggest mistake teams make is scanning first and deciding modeling standards later. Without an agreed level of development and a clear read on which elements matter for the project's actual decisions, teams end up modeling everything to the same excessive precision — which is slow — or modeling too loosely, which means the design team can't trust the geometry.",
      "The fix is boring but effective: define what the model needs to answer before the scan happens. A structural retrofit and an MEP re-route need different things from the same point cloud.",
      "Get that scoping right, and the translation from as-built conditions to a usable model becomes a predictable production process instead of a guessing game.",
    ],
  },
  {
    slug: "designing-interiors-for-documentation",
    title: "Designing Interiors That Survive Construction Documentation",
    excerpt:
      "A beautiful interior concept means little if it can't be documented cleanly for the site team. Where handoffs between design intent and construction detail tend to break down — and how to close the gap.",
    image: "/brand/insights/interiors-documentation.jpg",
    team: "Design & Interiors",
    date: "Nov 27, 2025",
    readTime: "7 min read",
    tags: ["Design & Interiors", "Documentation"],
    author: BHUVANESHWARI,
    body: [
      "Interior concepts tend to be developed as compositions — material, light, proportion — long before anyone asks how a given junction actually gets built. That's reasonable during concept design. It becomes a problem when the same drawings get handed to a construction documentation team with no translation step in between.",
      "The handoffs that break down most often aren't the obvious ones. They're the custom joinery details that were never resolved past a render, the material transitions that look seamless in a visualization but need an actual trim profile, and the services coordination that concept design simply didn't have to think about.",
      "Closing that gap means bringing documentation-minded thinking into the design process earlier — not to constrain the concept, but so the construction set doesn't become a second round of design decisions made under deadline pressure.",
      "Projects that do this well don't necessarily look more conservative. They just survive the transition from concept to site without losing what made the concept work in the first place.",
    ],
  },
];

export function getPost(slug: string): Post | undefined {
  return POSTS.find((p) => p.slug === slug);
}
