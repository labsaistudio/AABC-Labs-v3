import { paymentMiddleware } from "@x402/next";

const payTo = process.env.PAYMENT_ADDRESS;
if (!payTo) throw new Error("missing_required_env:PAYMENT_ADDRESS");

export const middleware = paymentMiddleware(
  payTo,
  {
    "/api/base-agent-report": {
      price: "$0.01",
      network: "eip155:8453",
    },
  },
);

export const config = {
  matcher: ["/api/base-agent-report"],
};
