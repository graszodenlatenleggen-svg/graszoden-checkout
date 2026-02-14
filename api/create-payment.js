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

    // Mollie verwacht bedrag als string met 2 decimalen: "238.79"
    const value = Number(amount).toFixed(2);

    const payment = await mollie.payments.create({
      amount: { currency: "EUR", value },
      description: description || "Bestelling Graszoden",
      // later zetten we dit naar je checkout-domein; voor nu is dit oké
      redirectUrl: "https://www.graszodenprijs.com/bedankt",
    });

    return res.status(200).json({ checkoutUrl: payment.getCheckoutUrl() });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Payment error", error: error.message });
  }
