"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { SearchItem } from "@/app/api/search/route";

const TYPE_LABEL: Record<SearchItem["type"], string> = {
  page: "Pages",
  insight: "Insights",
  resource: "Resources",
  "case-study": "Case Studies",
  team: "Team",
};

const TYPE_ORDER: SearchItem["type"][] = ["page", "team", "insight", "resource", "case-study"];

function score(item: SearchItem, query: string): number {
  const q = query.trim().toLowerCase();
  if (!q) return 0;
  const title = item.title.toLowerCase();
  const excerpt = item.excerpt.toLowerCase();
  const category = item.category.toLowerCase();

  if (title === q) return 100;
  if (title.startsWith(q)) return 80;
  if (title.includes(q)) return 60;
  if (category.includes(q)) return 30;
  if (excerpt.includes(q)) return 20;

  const tokens = q.split(/\s+/).filter(Boolean);
  if (tokens.length > 1 && tokens.every((t) => title.includes(t) || excerpt.includes(t))) return 15;

  return -1;
}

export default function SearchPalette() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<SearchItem[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const loadItems = useCallback(() => {
    if (items || loading) return;
    setLoading(true);
    fetch("/api/search")
      .then((res) => res.json())
      .then((data: SearchItem[]) => setItems(data))
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, [items, loading]);

  const openPalette = useCallback(() => {
    setOpen(true);
    loadItems();
  }, [loadItems]);

  const closePalette = useCallback(() => {
    setOpen(false);
    setQuery("");
    setActiveIndex(0);
  }, []);

  // global shortcut: Cmd/Ctrl+K to open, Escape to close
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((prev) => {
          if (!prev) loadItems();
          return !prev;
        });
      } else if (e.key === "Escape") {
        setOpen(false);
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [loadItems]);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => inputRef.current?.focus());
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const results = useMemo(() => {
    if (!items) return [];
    if (!query.trim()) {
      return items.filter((it) => it.type === "page").slice(0, 8);
    }
    return items
      .map((it) => ({ item: it, s: score(it, query) }))
      .filter((r) => r.s >= 0)
      .sort((a, b) => b.s - a.s)
      .slice(0, 24)
      .map((r) => r.item);
  }, [items, query]);

  const grouped = useMemo(() => {
    const groups = new Map<SearchItem["type"], SearchItem[]>();
    for (const item of results) {
      const list = groups.get(item.type) ?? [];
      list.push(item);
      groups.set(item.type, list);
    }
    return TYPE_ORDER.filter((t) => groups.has(t)).map((t) => ({ type: t, items: groups.get(t)! }));
  }, [results]);

  function goTo(href: string) {
    closePalette();
    router.push(href);
  }

  function onInputKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const target = results[activeIndex];
      if (target) goTo(target.href);
    }
  }

  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-index="${activeIndex}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  let flatIndex = -1;

  return (
    <>
      <button type="button" className="ucx-search-trigger" onClick={openPalette} aria-label="Search the site">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
      </button>

      {open && (
        <div className="ucx-search-overlay" onClick={closePalette}>
          <div className="ucx-search-panel" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label="Site search">
            <div className="ucx-search-input-row">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" />
              </svg>
              <input
                ref={inputRef}
                type="text"
                placeholder="Search pages, insights, resources, case studies…"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setActiveIndex(0);
                }}
                onKeyDown={onInputKeyDown}
              />
              <button type="button" className="ucx-search-close" onClick={closePalette} aria-label="Close search">
                esc
              </button>
            </div>

            <div className="ucx-search-results" ref={listRef}>
              {loading && <div className="ucx-search-empty">Loading…</div>}
              {!loading && grouped.length === 0 && (
                <div className="ucx-search-empty">No results for &ldquo;{query}&rdquo;.</div>
              )}
              {!loading &&
                grouped.map((group) => (
                  <div className="ucx-search-group" key={group.type}>
                    <span className="ucx-search-group-label">{TYPE_LABEL[group.type]}</span>
                    {group.items.map((it) => {
                      flatIndex += 1;
                      const idx = flatIndex;
                      return (
                        <button
                          type="button"
                          key={`${it.type}-${it.href}-${it.title}`}
                          data-index={idx}
                          className={`ucx-search-result${idx === activeIndex ? " is-active" : ""}`}
                          onMouseEnter={() => setActiveIndex(idx)}
                          onClick={() => goTo(it.href)}
                        >
                          <span className="ucx-search-result-title">{it.title}</span>
                          <span className="ucx-search-result-excerpt">{it.excerpt}</span>
                          <span className="ucx-search-result-cat">{it.category}</span>
                        </button>
                      );
                    })}
                  </div>
                ))}
            </div>

            <div className="ucx-search-footer">
              <span><i>↑↓</i> Navigate</span>
              <span><i>↵</i> Select</span>
              <span><i>esc</i> Close</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
