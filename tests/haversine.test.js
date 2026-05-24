const { haversineDistance } = require("../src/haversine");

describe("haversineDistance", () => {
  test("returns 0 for identical coordinates", () => {
    expect(haversineDistance(40.7128, -74.006, 40.7128, -74.006)).toBe(0);
  });

  test("calculates approximate distance between New York and Los Angeles (~3940 km)", () => {
    const dist = haversineDistance(40.7128, -74.006, 34.0522, -118.2437);
    expect(dist).toBeGreaterThan(3900);
    expect(dist).toBeLessThan(4000);
  });

  test("calculates approximate distance between nearby points (~0.5 km)", () => {
    // Two points roughly 0.5 km apart
    const dist = haversineDistance(40.7128, -74.006, 40.7173, -74.006);
    expect(dist).toBeGreaterThan(0.4);
    expect(dist).toBeLessThan(0.6);
  });

  test("is symmetric (distance A->B equals B->A)", () => {
    const d1 = haversineDistance(40.7128, -74.006, 40.7158, -74.009);
    const d2 = haversineDistance(40.7158, -74.009, 40.7128, -74.006);
    expect(d1).toBeCloseTo(d2, 5);
  });
});
