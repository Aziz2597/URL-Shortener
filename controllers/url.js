const shortid = require("shortid");
const URL = require("../models/url");

// Handle the generation of a new short URL
async function handleGenerateNewShortURL(req, res) {
  const body = req.body;
  if (!body.url) return res.status(400).json({ error: "url is required" });
  const shortID = shortid();

  await URL.create({
    shortId: shortID,
    redirectURL: body.url,
    visitHistory: [],
    createdBy: req.user._id,
  });

  return res.render("home", {
    id: shortID,
  });
}

// Handle the retrieval of analytics for a specific short URL
async function handleGetAnalytics(req, res) {
  const shortId = req.params.shortId;

  // Find the URL document in the database based on the short ID
  const result = await URL.findOne({ shortId });

  // Return JSON response with total clicks and visit history
  return res.json({
    totalClicks: result.visitHistory.length,
    analytics: result.visitHistory,
  });
}

module.exports = {
  handleGenerateNewShortURL,
  handleGetAnalytics,
};
