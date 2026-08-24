export interface DigitalExperienceCategory {
  id: string;
  n: string;
  name: string;
  defaultImage: string;
}

// The 5 categories themselves are a fixed taxonomy, not something the
// client adds/removes — only each category's image is dashboard-editable
// (see lib/digital-experience-db.ts).
export const DIGITAL_EXPERIENCE_CATEGORIES: DigitalExperienceCategory[] = [
  { id: "bim-vdc", n: "01", name: "BIM & VDC", defaultImage: "/brand/digital/cat-bim-vdc.jpg" },
  { id: "scan-to-bim", n: "02", name: "Scan-to-BIM", defaultImage: "/brand/digital/cat-scan-to-bim.jpg" },
  { id: "as-built-bim", n: "03", name: "As-Built BIM", defaultImage: "/brand/digital/cat-as-built-bim.jpg" },
  { id: "digital-engineering", n: "04", name: "Digital Engineering", defaultImage: "/brand/digital/cat-digital-engineering.jpg" },
  { id: "prefabrication", n: "05", name: "Prefabrication", defaultImage: "/brand/digital/cat-prefabrication.jpg" },
];
