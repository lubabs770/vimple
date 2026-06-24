// A tiny, self-contained HTTP router — enough to feel like a real web API while
// keeping every symbol you jump-to-definition into inside this repo.
export type Req = {
  method: string;
  path: string;
  params: Record<string, string>;
  body: unknown;
};

export type Res = {
  status: number;
  body: unknown;
};

export type Handler = (req: Req) => Res | Promise<Res>;

type Route = { method: string; pattern: string; handler: Handler };

export function createApp() {
  const routes: Route[] = [];
  const add = (method: string) => (pattern: string, handler: Handler) => {
    routes.push({ method, pattern, handler });
  };
  return {
    get: add("GET"),
    post: add("POST"),
    put: add("PUT"),
    delete: add("DELETE"),
    routes,
    async handle(method: string, path: string, body: unknown = null): Promise<Res> {
      for (const r of routes) {
        if (r.method !== method) continue;
        const params = matchPath(r.pattern, path);
        if (params) return r.handler({ method, path, params, body });
      }
      return { status: 404, body: { error: "not found" } };
    },
  };
}

export type App = ReturnType<typeof createApp>;

function matchPath(pattern: string, path: string): Record<string, string> | null {
  const pp = pattern.split("/").filter(Boolean);
  const xp = path.split("/").filter(Boolean);
  if (pp.length !== xp.length) return null;
  const params: Record<string, string> = {};
  for (let i = 0; i < pp.length; i++) {
    const seg = pp[i]!;
    const val = xp[i]!;
    if (seg.startsWith(":")) params[seg.slice(1)] = val;
    else if (seg !== val) return null;
  }
  return params;
}
