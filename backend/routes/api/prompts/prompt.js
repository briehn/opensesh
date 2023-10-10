const { requireUser } = require("../../config/passport");

const express = require("express");
const router = express.Router();

let cachedPrompt = "";
let lastCachedTime = null;
const CACHE_EXPIRATION_TIME = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

module.exports = router;
