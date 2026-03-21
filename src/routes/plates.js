const express = require("express");
const { haversineDistance } = require("../haversine");
const plates = require("../platesData");

const router = express.Router();

const DEFAULT_RADIUS_KM = 10;
const MAX_RADIUS_KM = 100;

/**
 * GET /plates/nearest
 *
 * Returns plates sorted by distance from the provided coordinates.
 *
 * Query parameters:
 *   lat      {number} - Latitude of the user's location (required)
 *   lng      {number} - Longitude of the user's location (required)
 *   radius   {number} - Search radius in kilometers (optional, default: 10, max: 100)
 *   limit    {number} - Maximum number of results to return (optional)
 */
router.get("/nearest", (req, res) => {
  const lat = parseFloat(req.query.lat);
  const lng = parseFloat(req.query.lng);

  if (isNaN(lat) || isNaN(lng)) {
    return res
      .status(400)
      .json({ error: "Query parameters 'lat' and 'lng' are required and must be valid numbers." });
  }

  if (lat < -90 || lat > 90) {
    return res.status(400).json({ error: "Latitude must be between -90 and 90." });
  }

  if (lng < -180 || lng > 180) {
    return res.status(400).json({ error: "Longitude must be between -180 and 180." });
  }

  let radius = parseFloat(req.query.radius);
  if (isNaN(radius) || radius <= 0) {
    radius = DEFAULT_RADIUS_KM;
  } else if (radius > MAX_RADIUS_KM) {
    radius = MAX_RADIUS_KM;
  }

  const limit = parseInt(req.query.limit, 10);

  const nearby = plates
    .map((plate) => ({
      ...plate,
      distance: parseFloat(haversineDistance(lat, lng, plate.lat, plate.lng).toFixed(2))
    }))
    .filter((plate) => plate.distance <= radius)
    .sort((a, b) => a.distance - b.distance);

  const results = !isNaN(limit) && limit > 0 ? nearby.slice(0, limit) : nearby;

  return res.json({ results, count: results.length });
});

module.exports = router;
