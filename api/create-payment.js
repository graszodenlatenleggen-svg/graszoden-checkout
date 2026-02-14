import mollieClient from "@mollie/api-client";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const { amount, description } = req.body || {};

    const mollie = mollieClient({
      apiKey: process.env.MOLLIE_API_KEY,
    });

    // Mollie requires amount as string with 2 decimals, e.g. "238.79"
    const value = Number(amount).toFixed(2);

    const payment = await mollie.payments.create({
      amount: {
        currency: "EUR",
        value: value,
      },
      description: description || "Graszoden order",
      redirectUrl: "https://www.graszodenprijs.com/bedankt",
    });

    return res.status(200).json({
      checkoutUrl: payment.getCheckoutUrl(),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Payment error",
      error: error.message,
    });
  }
}
