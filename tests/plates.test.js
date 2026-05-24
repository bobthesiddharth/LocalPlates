const request = require("supertest");
const app = require("../src/app");

describe("GET /plates/nearest", () => {
  const NYC_LAT = 40.7128;
  const NYC_LNG = -74.006;

  test("returns plates sorted by distance for valid coordinates", async () => {
    const res = await request(app)
      .get("/plates/nearest")
      .query({ lat: NYC_LAT, lng: NYC_LNG });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("results");
    expect(res.body).toHaveProperty("count");
    expect(Array.isArray(res.body.results)).toBe(true);

    const results = res.body.results;
    expect(results.length).toBeGreaterThan(0);

    // Each result should have a distance field
    results.forEach((plate) => {
      expect(plate).toHaveProperty("distance");
      expect(typeof plate.distance).toBe("number");
    });

    // Results should be sorted by distance (ascending)
    for (let i = 1; i < results.length; i++) {
      expect(results[i].distance).toBeGreaterThanOrEqual(results[i - 1].distance);
    }
  });

  test("filters plates outside the given radius", async () => {
    const res = await request(app)
      .get("/plates/nearest")
      .query({ lat: NYC_LAT, lng: NYC_LNG, radius: 1 });

    expect(res.status).toBe(200);
    res.body.results.forEach((plate) => {
      expect(plate.distance).toBeLessThanOrEqual(1);
    });
  });

  test("respects limit parameter", async () => {
    const res = await request(app)
      .get("/plates/nearest")
      .query({ lat: NYC_LAT, lng: NYC_LNG, limit: 3 });

    expect(res.status).toBe(200);
    expect(res.body.results.length).toBeLessThanOrEqual(3);
  });

  test("returns 400 when lat is missing", async () => {
    const res = await request(app)
      .get("/plates/nearest")
      .query({ lng: NYC_LNG });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  test("returns 400 when lng is missing", async () => {
    const res = await request(app)
      .get("/plates/nearest")
      .query({ lat: NYC_LAT });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  test("returns 400 when lat is out of range", async () => {
    const res = await request(app)
      .get("/plates/nearest")
      .query({ lat: 95, lng: NYC_LNG });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  test("returns 400 when lng is out of range", async () => {
    const res = await request(app)
      .get("/plates/nearest")
      .query({ lat: NYC_LAT, lng: 200 });

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("error");
  });

  test("returns empty results when location is far from all plates", async () => {
    // Coordinates for Tokyo, Japan - far from sample NYC plates
    const res = await request(app)
      .get("/plates/nearest")
      .query({ lat: 35.6762, lng: 139.6503, radius: 1 });

    expect(res.status).toBe(200);
    expect(res.body.results).toHaveLength(0);
    expect(res.body.count).toBe(0);
  });

  test("returns all plates within radius when no limit specified", async () => {
    const res = await request(app)
      .get("/plates/nearest")
      .query({ lat: NYC_LAT, lng: NYC_LNG, radius: 10 });

    expect(res.status).toBe(200);
    expect(res.body.count).toBe(res.body.results.length);
  });

  test("caps radius at MAX_RADIUS_KM (100 km)", async () => {
    const resLarge = await request(app)
      .get("/plates/nearest")
      .query({ lat: NYC_LAT, lng: NYC_LNG, radius: 200 });

    const resCapped = await request(app)
      .get("/plates/nearest")
      .query({ lat: NYC_LAT, lng: NYC_LNG, radius: 100 });

    expect(resLarge.status).toBe(200);
    expect(resLarge.body.count).toBe(resCapped.body.count);
  });
});

describe("GET /", () => {
  test("returns welcome message", async () => {
    const res = await request(app).get("/");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("message");
  });
});
