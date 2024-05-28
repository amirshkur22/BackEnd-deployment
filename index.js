import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import Stripe from "stripe";
dotenv.config();
const stripe = Stripe(process.env.VITE_STRIPE_KEY);
const App = express();
App.use(cors({ origin: true }));
App.use(express.json());
App.get("/", (req, res) => {
  res.status(200).json({
    message: "Successful!",
  });
});
App.post("/payment/create", async (req, res) => {
  try {
    const total = req.query.total;
    if (total > 0) {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: total,
        currency: "usd",
      });
      // console.log(paymentIntent.amount);
      //The client_secret is used on the client side to complete the payment.
      res.status(201).json({ clientSecret: paymentIntent.client_secret });
    } else {
      res.status(403).json({
        message: "total must be greater than 0",
      });
    }
  } catch (error) {}
});

App.listen(2024, (err) => {
  if (err) throw err;
  console.log("Server Running and Listening on https://localhost:2024");
});
