




import dotenv from "dotenv";

dotenv.config();

import express from "express";
import cors from "cors";
import axios from "axios";
const app = express();
app.use(cors());
app.use(express.json());

const OFFICIAL_EMAIL = "ravneet1188.be23@chitkara.edu.in";

// api
process.env.GEMINI_API_KEY


// Utility functions
const getFibonacci = (n) => {
  if (n < 0) return [];
  let arr = [0, 1];
  for (let i = 2; i < n; i++) {
    arr.push(arr[i - 1] + arr[i - 2]);
  }
  return arr.slice(0, n);
};

const isPrime = (num) => {
  if (num < 2) return false;
  for (let i = 2; i * i <= num; i++) {
    if (num % i === 0) return false;
  }
  return true;
};

const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));
const hcfArray = (arr) => arr.reduce((a, b) => gcd(a, b));
const lcm = (a, b) => (a * b) / gcd(a, b);
const lcmArray = (arr) => arr.reduce((a, b) => lcm(a, b));

// POST /bfhl
app.post("/bfhl", async (req, res) => {
  try {
    const body = req.body;

    if (!body || typeof body !== "object") {
      return res.status(400).json({
        is_success: false,
        message: "Invalid JSON body",
      });
    }

    if (body.fibonacci !== undefined) {
      if (!Number.isInteger(body.fibonacci) || body.fibonacci < 0) {
        return res.status(400).json({ is_success: false });
      }

      return res.json({
        is_success: true,
        official_email: OFFICIAL_EMAIL,
        data: getFibonacci(body.fibonacci),
      });
    }

    if (body.prime !== undefined) {
      if (!Array.isArray(body.prime)) {
        return res.status(400).json({ is_success: false });
      }

      const primes = body.prime.filter(isPrime);
      return res.json({
        is_success: true,
        official_email: OFFICIAL_EMAIL,
        data: primes,
      });
    }

    if (body.lcm !== undefined) {
      if (!Array.isArray(body.lcm)) {
        return res.status(400).json({ is_success: false });
      }

      return res.json({
        is_success: true,
        official_email: OFFICIAL_EMAIL,
        data: lcmArray(body.lcm),
      });
    }

    if (body.hcf !== undefined) {
      if (!Array.isArray(body.hcf)) {
        return res.status(400).json({ is_success: false });
      }

      return res.json({
        is_success: true,
        official_email: OFFICIAL_EMAIL,
        data: hcfArray(body.hcf),
      });
    }

    // AI
   // AI

if (body.AI !== undefined) {
  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
      {
        contents: [
          {
            role: "user",
            parts: [{ text: body.AI }]
          }
        ]
      },
      {
        params: {
          key: process.env.GEMINI_API_KEY
        },
        headers: {
          "Content-Type": "application/json"
        }
      }
    );

    const text =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    const singleWord = text.trim().split(/\s+/)[0];

    return res.json({
      is_success: true,
      official_email: OFFICIAL_EMAIL,
      data: singleWord.replace(/[^a-zA-Z]/g, ""),
    });
  } catch (aiErr) {
    console.error("Gemini Error:", aiErr?.response?.data || aiErr.message);
    return res.status(500).json({
      is_success: false,
      message: "AI service failed",
    });
  }
}

 return res.status(400).json({
      is_success: false,
      message: "No valid operation provided",
    });

  } catch (err) {
    console.error("Server Error:", err.message);
    return res.status(500).json({
      is_success: false,
      message: "Internal server error",
    });
  }
});
  


// GET /health
app.get("/health", (req, res) => {
  res.json({
    is_success: true,
    official_email: OFFICIAL_EMAIL,
  });
});
export default app;
