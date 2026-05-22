import express from "express";
import { paymentMiddleware } from "x402-express";

const app = express();
const payTo = requiredEnv("PAYMENT_ADDRESS");

app.use(
  paymentMiddleware(payTo, {
    "/api/base-agent-report": {
      price: "$0.01",
      network: "eip155:8453",
    },
  }),
);

app.get("/api/base-agent-report", (_request, response) => {
  response.json({
    product: "AABC Base Agent Fund Pack",
    access: "granted",
    report: "Paid agent report delivered through x402.",
  });
});

app.listen(3000, () => {
  console.log("x402 endpoint listening on http://localhost:3000");
});

function requiredEnv(name: string) {
  const value = process.env[name];
  if (!value) throw new Error(`missing_required_env:${name}`);
  return value;
}
