const { requireUser } = require("../../config/passport");

const express = require("express");
const router = express.Router();
const axios = require("axios");

let cachedPrompt = "";
let lastCachedTime = null;
const CACHE_EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

router.get("/random-prompt", async (req, res) => {
  try {
    // Check if the prompt is already cached and not expired
    if (
      cachedPrompt &&
      lastCachedTime &&
      Date.now() - lastCachedTime < CACHE_EXPIRATION_TIME
    ) {
      return res.json({ prompt: cachedPrompt });
    }

    // Make a request to the OpenAI API
    const response = await axios.post(
      "https://api.openai.com/v1/engines/gpt-3.5-turbo-0301/completions",
      {
        prompt:
          "Can you give me one prompt that is designed to spark conversations or bring humor? I need a prompt that is suitable for a daily question on a social media platform.",
        max_tokens: 100,
        temperature: 0.7,
        n: 1,
      },
      {
        headers: {
          Authorization:
            "Bearer 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",
          "Content-Type": "application/json",
        },
      }
    );

    const randomPrompt = response.data.choices[0].text.trim();

    // Cache the generated prompt and update the last cached time
    cachedPrompt = randomPrompt;
    lastCachedTime = Date.now();

    res.json({ prompt: randomPrompt });
  } catch (error) {
    console.error("Error:", error.response);
    res.status(500).json({ error: "An error occurred" });
  }
});

module.exports = router;
