"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const PIECES: number[][][] = [
  [[1, 1, 1, 1]],
  [
    [1, 1],
    [1, 1],
  ],
  [
    [0, 1, 0],
    [1, 1, 1],
  ],
  [
    [1, 0],
    [1, 0],
    [1, 1],
  ],
  [
    [0, 1, 1],
    [1, 1, 0],
  ],
  [
    [1, 1, 0],
    [0, 1, 1],
  ],
  [
    [0, 1],
    [0, 1],
    [1, 1],
  ],
];

interface Cell {
  filled: boolean;
  clearing: boolean;
}

interface FallingPiece {
  shape: number[][];
  x: number;
  y: number;
}

interface TetrisLoaderProps {
  cols?: number;
  rows?: number;
  fallSpeed?: number;
}

function emptyGrid(cols: number, rows: number): Cell[][] {
  return Array.from({ length: rows }, () => Array.from({ length: cols }, () => ({ filled: false, clearing: false })));
}

function rotate(shape: number[][]): number[][] {
  const rows = shape.length;
  const cols = shape[0].length;
  const rotated: number[][] = Array.from({ length: cols }, () => Array(rows).fill(0));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      rotated[c][rows - 1 - r] = shape[r][c];
    }
  }
  return rotated;
}

export default function TetrisLoader({ cols = 8, rows = 14, fallSpeed = 55 }: TetrisLoaderProps) {
  const gridRef = useRef<Cell[][]>(emptyGrid(cols, rows));
  const pieceRef = useRef<FallingPiece | null>(null);
  const clearingRef = useRef(false);
  const frameRef = useRef<number | undefined>(undefined);
  const lastStepRef = useRef(0);
  const [snapshot, setSnapshot] = useState<{ grid: Cell[][]; piece: FallingPiece | null }>(() => ({
    grid: emptyGrid(cols, rows),
    piece: null,
  }));

  const spawnPiece = useCallback((): FallingPiece => {
    let shape = PIECES[Math.floor(Math.random() * PIECES.length)];
    const rotations = Math.floor(Math.random() * 4);
    for (let i = 0; i < rotations; i++) shape = rotate(shape);
    const x = Math.floor(Math.random() * (cols - shape[0].length + 1));
    return { shape, x, y: -shape.length };
  }, [cols]);

  const fits = useCallback(
    (p: FallingPiece, x: number, y: number, g: Cell[][]) => {
      for (let r = 0; r < p.shape.length; r++) {
        for (let c = 0; c < p.shape[r].length; c++) {
          if (!p.shape[r][c]) continue;
          const gx = x + c;
          const gy = y + r;
          if (gx < 0 || gx >= cols || gy >= rows) return false;
          if (gy >= 0 && g[gy][gx].filled) return false;
        }
      }
      return true;
    },
    [cols, rows]
  );

  useEffect(() => {
    gridRef.current = emptyGrid(cols, rows);
    pieceRef.current = spawnPiece();

    function resetBoard() {
      clearingRef.current = true;
      setTimeout(() => {
        gridRef.current = emptyGrid(cols, rows);
        pieceRef.current = spawnPiece();
        clearingRef.current = false;
      }, 260);
    }

    function landPiece(current: FallingPiece) {
      const next = gridRef.current.map((row) => row.map((cell) => ({ ...cell })));
      for (let r = 0; r < current.shape.length; r++) {
        for (let c = 0; c < current.shape[r].length; c++) {
          if (!current.shape[r][c]) continue;
          const gy = current.y + r;
          const gx = current.x + c;
          if (gy >= 0 && gy < rows && gx >= 0 && gx < cols) next[gy][gx] = { filled: true, clearing: false };
        }
      }

      const fullRows: number[] = [];
      next.forEach((row, i) => {
        if (row.every((cell) => cell.filled)) fullRows.push(i);
      });

      if (fullRows.length > 0) {
        clearingRef.current = true;
        fullRows.forEach((i) => next[i].forEach((cell) => (cell.clearing = true)));
        gridRef.current = next;
        setTimeout(() => {
          const kept = gridRef.current.filter((_, i) => !fullRows.includes(i));
          gridRef.current = [...emptyGrid(cols, fullRows.length), ...kept];
          clearingRef.current = false;
        }, 180);
      } else {
        gridRef.current = next;
      }
    }

    function step(timestamp: number) {
      if (timestamp - lastStepRef.current >= fallSpeed) {
        lastStepRef.current = timestamp;

        if (!clearingRef.current) {
          const jammed = gridRef.current
            .slice(0, 3)
            .some((row) => row.filter((cell) => cell.filled).length > cols * 0.7);

          if (jammed) {
            resetBoard();
          } else {
            const current = pieceRef.current ?? spawnPiece();
            const nextY = current.y + 1;
            if (fits(current, current.x, nextY, gridRef.current)) {
              pieceRef.current = { ...current, y: nextY };
            } else {
              landPiece(current);
              pieceRef.current = spawnPiece();
            }
          }
        }

        setSnapshot({ grid: gridRef.current, piece: pieceRef.current });
      }
      frameRef.current = requestAnimationFrame(step);
    }

    frameRef.current = requestAnimationFrame(step);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [cols, rows, fallSpeed, fits, spawnPiece]);

  const display = snapshot.grid.map((row) => row.map((cell) => ({ ...cell })));
  const piece = snapshot.piece;
  if (piece) {
    for (let r = 0; r < piece.shape.length; r++) {
      for (let c = 0; c < piece.shape[r].length; c++) {
        if (!piece.shape[r][c]) continue;
        const gy = piece.y + r;
        const gx = piece.x + c;
        if (gy >= 0 && gy < rows && gx >= 0 && gx < cols) display[gy][gx] = { filled: true, clearing: false };
      }
    }
  }

  return (
    <div className="tetl" style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}>
      {display.map((row, r) =>
        row.map((cell, c) => (
          <span
            key={`${r}-${c}`}
            className={`tetl-cell${cell.filled ? " is-filled" : ""}${cell.clearing ? " is-clearing" : ""}`}
          />
        ))
      )}
    </div>
  );
}
