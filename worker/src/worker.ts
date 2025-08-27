export default {
 async fetch(req: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
   const url = new URL(req.url);

   // CORS preflight
   if (req.method === "OPTIONS") {
     return new Response(null, { status: 204, headers: corsHeaders(url) });
   }

   if (url.pathname === "/openai") {
     return proxyOpenAI(req, env, url);
   } else if (url.pathname === "/anthropic") {
     return proxyAnthropic(req, env, url);
   } else if (url.pathname === "/health") {
     return new Response("ok", { headers: corsHeaders(url) });
   }

   return new Response("Not Found", { status: 404, headers: corsHeaders(url) });
 },
} satisfies ExportedHandler<Env>;

export interface Env {
 OPENAI_API_KEY: string;
 ANTHROPIC_API_KEY: string;
 // (Optional) to block origin: ORIGIN_ALLOWLIST="https://yourdomain.com,https://other.com"
 ORIGIN_ALLOWLIST?: string;
}

function corsHeaders(url: URL): HeadersInit {
 // If you want to restrict: replace "*" with your domain or use allowlist
 return {
   "Access-Control-Allow-Origin": allowedOrigin(url),
   "Access-Control-Allow-Methods": "GET,POST,OPTIONS",
   "Access-Control-Allow-Headers": "Content-Type,Authorization,x-api-key,anthropic-version",
   "Access-Control-Max-Age": "86400",
 };
}

function allowedOrigin(url: URL): string {
 // Simplification: allow everyone. For prod, use allowlist from env.
 return "*";
}

async function proxyOpenAI(req: Request, env: Env, url: URL): Promise<Response> {
 if (req.method !== "POST") {
   return new Response("Method Not Allowed", { status: 405, headers: corsHeaders(url) });
 }

 const body = await req.json<any>();
 // Enable SSE streaming for reactive UX (you can disable if you prefer)
 body.stream = body.stream ?? true;

 const upstream = await fetch("https://api.openai.com/v1/chat/completions", {
   method: "POST",
   headers: {
     "Authorization": `Bearer ${env.OPENAI_API_KEY}`,
     "Content-Type": "application/json",
   },
   body: JSON.stringify(body),
 });

 // Pass-through stream + CORS
 const headers = new Headers(upstream.headers);
 // Avoid propagating sensitive/non-CORS-friendly headers; set your own
 headers.set("Access-Control-Allow-Origin", allowedOrigin(url));
 headers.set("Access-Control-Expose-Headers", "content-type");

 return new Response(upstream.body, {
   status: upstream.status,
   headers,
 });
}

async function proxyAnthropic(req: Request, env: Env, url: URL): Promise<Response> {
 if (req.method !== "POST") {
   return new Response("Method Not Allowed", { status: 405, headers: corsHeaders(url) });
 }

 const body = await req.json<any>();
 body.stream = body.stream ?? true;

 const upstream = await fetch("https://api.anthropic.com/v1/messages", {
   method: "POST",
   headers: {
     "x-api-key": env.ANTHROPIC_API_KEY,
     "anthropic-version": "2023-06-01",
     "content-type": "application/json",
   },
   body: JSON.stringify(body),
 });

 const headers = new Headers(upstream.headers);
 headers.set("Access-Control-Allow-Origin", allowedOrigin(url));
 headers.set("Access-Control-Expose-Headers", "content-type");

 return new Response(upstream.body, {
   status: upstream.status,
   headers,
 });
}