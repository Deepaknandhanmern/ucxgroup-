// One-off converter: turns a raw IFC export into a compact .frag binary
// (That Open Company's Fragments format) so the site never has to parse a
// multi-megabyte IFC file in a visitor's browser — that conversion is slow
// enough that their own docs call it unusable for production. Convert once
// here, commit the .frag output, and the viewer just loads that directly.
//
// Usage: node scripts/convert-ifc.mjs <input.ifc> <output.frag>
import { readFile, writeFile } from "fs/promises";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import * as FRAGS from "@thatopen/fragments";

const [inputPath, outputPath] = process.argv.slice(2);
if (!inputPath || !outputPath) {
  console.error("Usage: node scripts/convert-ifc.mjs <input.ifc> <output.frag>");
  process.exit(1);
}

// The Node build of web-ifc loads its .wasm from the local filesystem (not
// via fetch, unlike the browser build) — point it at the locally installed
// package instead of the CDN URL used in That Open's browser examples.
const __dirname = dirname(fileURLToPath(import.meta.url));
const wasmDir = join(__dirname, "..", "node_modules", "web-ifc") + "/";

const serializer = new FRAGS.IfcImporter();
serializer.wasm = { absolute: true, path: wasmDir };

console.log(`Reading ${inputPath}...`);
const ifcBuffer = await readFile(inputPath);
const ifcBytes = new Uint8Array(ifcBuffer);
console.log(`Converting ${(ifcBytes.length / 1024 / 1024).toFixed(1)}MB IFC to Fragments...`);

const fragmentBytes = await serializer.process({
  bytes: ifcBytes,
  progressCallback: (progress) => {
    process.stdout.write(`\r  ${(progress * 100).toFixed(0)}%`);
  },
});

console.log(`\nWriting ${outputPath}...`);
await writeFile(outputPath, Buffer.from(fragmentBytes));
console.log(
  `Done — ${(fragmentBytes.byteLength / 1024 / 1024).toFixed(2)}MB ` +
    `(was ${(ifcBytes.length / 1024 / 1024).toFixed(1)}MB)`
);
