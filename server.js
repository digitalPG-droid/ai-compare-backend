import express from "express";
import cors from "cors";
import fetch from "node-fetch";

const app = express();
app.use(cors());
app.use(express.json());

const HF_API_KEY = process.env.HF_API_KEY;

async function callModel(model, prompt) {
  const res = await fetch(
    `https://api-inference.huggingface.co/models/${model}`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ inputs: prompt })
    }
  );
  return await res.json();
}

app.post("/compare", async (req, res) => {
  const q = req.body.query;

  const [a, b] = await Promise.all([
    callModel("google/flan-t5-large", q),
    callModel("facebook/bart-large-cnn", q)
  ]);

  res.json({ a, b });
});

app.listen(5000);
