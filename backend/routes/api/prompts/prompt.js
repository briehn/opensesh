const questionsData = require("./data.json");
const { requireUser } = require("../../../config/passport");
const fs = require("fs");
const path = require("path");
const util = require("util");

const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

const express = require("express");
const router = express.Router();

let cachedPrompt = "";
let lastCachedTime = null;
const CACHE_EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const YEAR_IN_MS = 365 * CACHE_EXPIRATION_TIME;

async function fetchQuestion() {
  console.log("CachedPrompt: " + cachedPrompt);
  if (
    cachedPrompt
    // &&
    // lastCachedTime &&
    // Date.now() - lastCachedTime < CACHE_EXPIRATION_TIME
  ) {
    console.log("Successfully returned cachedPrompt");
    return cachedPrompt;
  }
  const validQuestions = questionsData.filter(
    (question) => question.prompt.trim() !== ""
  );

  const eligibleQuestions = validQuestions.filter((question) => {
    if (!question.lastUsed) {
      return true;
    }
    const lastUsedDate = new Date(question.lastUsed);
    const currentDate = new Date();

    const timeSinceLastUsed = currentDate - lastUsedDate;
    return timeSinceLastUsed >= YEAR_IN_MS;
  });

  console.log("Eligible Questions:" + eligibleQuestions);

  if (eligibleQuestions.length === 0) {
    const resetQuestions = validQuestions.map((question) => {
      question.lastUsed = null;
      return question;
    });

    fs.writeFile(
      path.join(__dirname, "data.json"),
      JSON.stringify(resetQuestions, null, 2),
      (err) => {
        if (err) {
          console.error("Error writing JSON file:", err);
          return "Internal Server Error Writing to AND Resetting JSON";
        }
      }
    );
  }

  const index = Math.floor(Math.random() * eligibleQuestions.length);

  const sel = eligibleQuestions[index];

  sel.lastUsed = new Date().toISOString();

  cachedPrompt = sel.prompt;
  lastCachedTime = Date.now();

  console.log("Initial CachedPrompt: " + cachedPrompt);

  // fs.readFile(path.join(__dirname, "data.json"), "utf8", (err, data) => {
  //   if (err) {
  //     console.error("Error reading JSON file:", err);
  //     return "Internal Server Error Reading JSON";
  //   }

  //   const questions = JSON.parse(data);

  //   const updatedQuestions = questions.map((question) => {
  //     if (question.id === sel.id) {
  //       question.lastUsed = sel.lastUsed;
  //     }
  //     return question;
  //   });

  //   fs.writeFile(
  //     path.join(__dirname, "data.json"),
  //     JSON.stringify(updatedQuestions, null, 2),
  //     (err) => {
  //       if (err) {
  //         console.error("Error writing JSON file:", err);
  //         return "Internal Server Error Writing to JSON";
  //       }
  //     }
  //   );
  // });

  const data = await readFileAsync(path.join(__dirname, "data.json"), "utf8");
  const questions = JSON.parse(data);

  const updatedQuestions = questions.map((question) => {
    if (question.id === sel.id) {
      question.lastUsed = sel.lastUsed;
    }
    return question;
  });

  await writeFileAsync(
    path.join(__dirname, "data.json"),
    JSON.stringify(updatedQuestions, null, 2)
  );

  console.log("Last Cached Prompt: " + cachedPrompt);

  return sel.prompt;
}

router.get("/", async (req, res, next) => {
  try {
    const prompt = await fetchQuestion();
    return res.json({ prompt: prompt });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
