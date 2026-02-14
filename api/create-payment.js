import mollieClient from '@mollie/api-client';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { amount, description } = req.body;

    const mollie = mollieClient({
      apiKey: process.env.MOLLIE_API_KEY,
    });

    const payment = await mollie.payments.create({
      amount: {
        currency: 'EUR',
        value: amount // moet formaat hebben: "238.79"
      },
      description: description || "Bestelling Graszoden",
      redirectUrl: 'https://www.graszodenprijs.com/bedankt',
      webhookUrl: 'https://www.graszodenprijs.com/api/webhook',
    });

    res.status(200).json({
      checkoutUrl: payment.getCheckoutUrl()
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: 'Payment error',
      error: error.message
    });
  }
}
