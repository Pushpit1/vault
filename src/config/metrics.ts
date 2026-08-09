import {
  collectDefaultMetrics,
  Counter,
  Histogram,
  register,
} from "prom-client";

collectDefaultMetrics({
  prefix: "vault_",
});

export const httpRequestsTotal =
  new Counter({
    name: "vault_http_requests_total",
    help: "Total number of HTTP requests",
    labelNames: [
      "method",
      "route",
      "status_code",
    ],
  });

export const httpRequestDuration =
  new Histogram({
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
      2.5,
      5,
    ],
  });

export { register };
