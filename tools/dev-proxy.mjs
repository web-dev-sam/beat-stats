import http from "node:http";
import { URL } from "node:url";

const DEFAULT_PORT = 8787;
const portArg = process.argv.slice(2).find((a) => /^\d+$/.test(a));
const port = Number.parseInt(process.env.PORT || portArg || `${DEFAULT_PORT}`, 10);

// Keep this narrow so it can't be abused as a generic open proxy.
const ALLOWED_HOSTS = new Set(["scoresaber.com", "api.accsaber.com"]);
const ALLOWED_PROTOCOLS = new Set(["http:", "https:"]);

function setCors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

const server = http.createServer(async (req, res) => {
  setCors(res);

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  const requestUrl = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);
  if (req.method !== "GET" || requestUrl.pathname !== "/proxy") {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Not found");
    return;
  }

  const target = requestUrl.searchParams.get("url");
  if (!target) {
    res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Missing required query param: url");
    return;
  }

  let targetUrl;
  try {
    targetUrl = new URL(target);
  } catch {
    res.writeHead(400, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Invalid url");
    return;
  }

  if (!ALLOWED_PROTOCOLS.has(targetUrl.protocol) || !ALLOWED_HOSTS.has(targetUrl.hostname)) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Forbidden host");
    return;
  }

  try {
    const upstream = await fetch(targetUrl, {
      headers: {
        Accept: "application/json",
        // Some CDNs behave better when a UA is present.
        "User-Agent": "BeatStats dev proxy",
      },
    });

    res.writeHead(upstream.status, {
      "Content-Type": upstream.headers.get("content-type") || "application/octet-stream",
      "Cache-Control": "no-store",
    });

    const buf = Buffer.from(await upstream.arrayBuffer());
    res.end(buf);
  } catch (error) {
    res.writeHead(502, { "Content-Type": "text/plain; charset=utf-8" });
    res.end(`Upstream fetch failed: ${error?.message || error}`);
  }
});

server.listen(port, () => {
  console.log(`BeatStats dev proxy listening on http://127.0.0.1:${port}`);
  console.log("Proxy endpoint: /proxy?url=<encoded target url>");
  console.log("Allowed hosts:", [...ALLOWED_HOSTS].join(", "));
});

