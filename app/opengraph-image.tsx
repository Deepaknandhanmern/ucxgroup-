import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

export const alt = "UCX Group — Unconventional Collaboration";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const markData = await readFile(join(process.cwd(), "public/brand/x-mark.png"), "base64");
const markSrc = `data:image/png;base64,${markData}`;

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          background: "#00352D",
          backgroundImage: "linear-gradient(135deg, #00352D 0%, #00211B 100%)",
          position: "relative",
        }}
      >
        <img
          src={markSrc}
          width={560}
          height={560}
          style={{ position: "absolute", right: -80, top: -60, opacity: 0.9 }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            padding: "0 0 0 88px",
            maxWidth: 760,
          }}
        >
          <div
            style={{
              display: "flex",
              fontSize: 20,
              letterSpacing: 6,
              color: "rgba(145,242,181,0.75)",
              marginBottom: 28,
              textTransform: "uppercase",
            }}
          >
            UCX Group
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 76,
              lineHeight: 1.08,
              fontWeight: 700,
              color: "#F3F1E6",
              letterSpacing: -1,
            }}
          >
            Unconventional
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 76,
              lineHeight: 1.08,
              fontWeight: 700,
              color: "#91F2B5",
              letterSpacing: -1,
              marginBottom: 32,
            }}
          >
            Collaboration.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 22,
              color: "rgba(145,242,181,0.65)",
              letterSpacing: 1,
            }}
          >
            Design · Digital Engineering · Project Delivery · Asset Information
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
