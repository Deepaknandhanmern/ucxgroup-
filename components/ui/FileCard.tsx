"use client";

import type { ReactNode } from "react";

export type FileFormat =
  | "doc" | "pdf" | "md" | "mdx" | "csv" | "xls" | "xlsx" | "txt"
  | "ppt" | "pptx" | "zip" | "rar" | "tar" | "gz"
  | "code" | "html" | "js" | "jsx" | "tsx" | "css" | "json"
  | "img" | "png" | "jpg" | "jpeg" | "video";

const BANNER_CLASS: Record<FileFormat, string> = {
  doc: "banner-blue", pdf: "banner-red", md: "banner-slate", mdx: "banner-slate",
  txt: "banner-gray", csv: "banner-teal", xls: "banner-green", xlsx: "banner-green",
  ppt: "banner-orange", pptx: "banner-orange", zip: "banner-purple", rar: "banner-purple",
  tar: "banner-amber", gz: "banner-amber", html: "banner-orange", js: "banner-amber",
  jsx: "banner-blue", css: "banner-blue", json: "banner-amber", tsx: "banner-blue",
  code: "banner-orange", img: "banner-pink", png: "banner-slate", jpg: "banner-green",
  jpeg: "banner-green", video: "banner-green",
};

function DefaultPlaceholder() {
  return (
    <div className="fc-lines">
      <div className="fc-row"><span className="w50" /></div>
      <div className="fc-row"><span className="w33" /><span className="w33" /></div>
      <div className="fc-row"><span className="w50" /><span className="w33" /></div>
      <div className="fc-row"><span className="w33" /><span className="w33" /></div>
      <div className="fc-row"><span className="w33" /><span className="w50" /></div>
      <div className="fc-row"><span className="w33" /></div>
    </div>
  );
}

function placeholderFor(format: FileFormat): ReactNode {
  if (format === "md" || format === "mdx") {
    return (
      <div className="fc-lines">
        <div className="fc-row"><span className="fc-hash">#</span><span className="w24" /></div>
        <div className="fc-row"><span className="w33" /></div>
        <div className="fc-row"><span className="w28" /></div>
        <div className="fc-row"><span className="w28" /></div>
        <div className="fc-row"><span className="w33" /></div>
      </div>
    );
  }
  if (format === "xls" || format === "xlsx") {
    return (
      <div className="fc-sheet">
        <div className="fc-sheet-row header"><span /><span /><span /></div>
        <div className="fc-sheet-row"><span /><span /><span /><span /><span /><span /></div>
        <div className="fc-sheet-row"><span /><span /></div>
        <div className="fc-sheet-row"><span /></div>
      </div>
    );
  }
  if (format === "csv") {
    return (
      <div className="fc-csv">
        <div className="fc-csv-row header"><span /><span /><span /></div>
        <div className="fc-csv-row"><span /><span /><span /></div>
        <div className="fc-csv-row"><span /><span /><span /></div>
        <div className="fc-csv-row"><span /><span /></div>
        <div className="fc-csv-row"><span /></div>
      </div>
    );
  }
  if (format === "zip" || format === "rar" || format === "tar" || format === "gz") {
    return (
      <div className="fc-zip">
        {Array.from({ length: 9 }).map((_, i) => (
          <div className="fc-zip-row" key={i}>
            <span className={i % 2 === 0 ? "on" : "off"} />
            <span className={i % 2 === 0 ? "off" : "on"} />
          </div>
        ))}
      </div>
    );
  }
  if (format === "ppt" || format === "pptx") {
    return (
      <>
        <div className="fc-thumb"><span className="fc-swatch orange" /><span className="fc-cap" /></div>
        <div className="fc-row center"><span className="w28" /><span className="w16" /></div>
        <div className="fc-lines"><span className="w16" /><span className="w20" /></div>
      </>
    );
  }
  if (format === "img" || format === "png" || format === "jpg" || format === "jpeg") {
    return (
      <div className="fc-thumb">
        <span className="fc-swatch yellow" />
        <span className="fc-cap short" />
        <span className="fc-cap" />
      </div>
    );
  }
  if (format === "video") {
    return (
      <div className="fc-thumb">
        <span className="fc-play" />
        <span className="fc-cap short" />
        <span className="fc-cap" />
      </div>
    );
  }
  if (format === "html" || format === "js" || format === "jsx" || format === "tsx" || format === "code") {
    return (
      <div className="fc-code">
        <div><span className="fc-bracket">&lt;</span><span className="tag emerald" /><span className="fc-bracket">&gt;</span></div>
        <div className="indent"><span className="fc-bracket">&lt;</span><span className="tag sky" /><span className="fc-bracket">&gt;</span></div>
        <div className="indent"><span className="fc-bracket">&lt;/</span><span className="tag sky" /><span className="fc-bracket">&gt;</span></div>
        <div><span className="fc-bracket">&lt;</span><span className="tag emerald short" /><span className="fc-bracket">/&gt;</span></div>
      </div>
    );
  }
  if (format === "css") {
    return (
      <div className="fc-code">
        <div><span className="fc-brace">{"{"}</span></div>
        <div className="indent"><span className="tag sky" /><span className="tag sky wide" /></div>
        <div className="indent"><span className="tag sky wide" /><span className="tag sky" /></div>
        <div className="indent"><span className="tag sky" /><span className="tag sky wide" /></div>
        <div><span className="fc-brace">{"}"}</span></div>
      </div>
    );
  }
  if (format === "json") {
    return (
      <div className="fc-code">
        <div><span className="fc-brace">{"{"}</span></div>
        <div className="indent"><span className="tag" /><span className="tag wide" /></div>
        <div className="indent"><span className="tag dim wide" /><span className="tag dim" /></div>
        <div className="indent"><span className="tag dim" /><span className="tag dim wide" /></div>
        <div className="indent"><span className="tag dim" /></div>
        <div><span className="fc-brace">{"}"}</span></div>
      </div>
    );
  }
  return <DefaultPlaceholder />;
}

export default function FileCard({ format }: { format: FileFormat }) {
  return (
    <div className="ucx-filecard" aria-hidden="true">
      <span className={`fc-banner ${BANNER_CLASS[format]}`}>{format}</span>
      <div className="fc-body">{placeholderFor(format)}</div>
    </div>
  );
}
