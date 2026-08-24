// Minimal ambient types for node:sqlite (stable in Node 22.5+/24), which
// predates this project's pinned @types/node version. Covers only the
// surface actually used in lib/db.ts and the *-db.ts data-access modules.
declare module "node:sqlite" {
  export interface StatementResultingChanges {
    lastInsertRowid: number | bigint;
    changes: number | bigint;
  }

  export class StatementSync {
    run(...params: unknown[]): StatementResultingChanges;
    get(...params: unknown[]): unknown;
    all(...params: unknown[]): unknown[];
  }

  export class DatabaseSync {
    constructor(path: string, options?: Record<string, unknown>);
    exec(sql: string): void;
    prepare(sql: string): StatementSync;
    close(): void;
  }
}
