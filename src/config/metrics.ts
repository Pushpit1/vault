import client from "prom-client";

client.collectDefaultMetrics();

export const httpRequestsTotal =
  new client.Counter({
    name: "vault_http_requests_total",
    help: "Total number of HTTP requests",
    labelNames: [
      "method",
      "route",
      "status_code",
    ],
  });

export const httpRequestDuration =
  new client.Histogram({
    name: "vault_http_request_duration_seconds",
    help: "HTTP request duration in seconds",
    labelNames: [
      "method",
      "route",
      "status_code",
    ],
    buckets: [
      0.005,
      0.01,
      0.025,
      0.05,
      0.1,
      0.25,
      0.5,
      1,
      2,
      5,
    ],
  });

export const register =
  client.register;