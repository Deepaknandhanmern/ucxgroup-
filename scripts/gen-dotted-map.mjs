// One-off generator: produces a static dotted-world-map SVG asset so the
// site doesn't need `dotted-map` as a runtime dependency. Re-run this and
// commit the output if the map style ever needs to change.
import DottedMap from "dotted-map";
import { writeFileSync } from "fs";

const map = new DottedMap({ height: 100, grid: "diagonal" });

const raw = map.getSVG({
  radius: 0.22,
  color: "#00352D",
  shape: "circle",
  backgroundColor: "transparent",
});

// getSVG repeats fill="#00352D" on every circle (thousands of them) and
// emits full float precision + a newline per dot — hoist the fill onto one
// wrapping <g>, round coordinates, and strip whitespace to cut file size.
const svg = raw
  .replace(/<svg ([^>]*)>/, '<svg $1><g fill="#00352D">')
  .replace(/<\/svg>\s*$/, "</g></svg>")
  .replace(/ fill="#00352D"(?=\s*\/>)/g, "")
  .replace(/(-?\d+\.\d{3})\d+/g, "$1")
  .replace(/>\s+</g, "><");

writeFileSync("public/brand/world-dotted-map.svg", svg);
console.log("wrote public/brand/world-dotted-map.svg");
