const request = require("supertest");
const app = require("../src/app");

describe("GET /random-url", () => {
  it("should return 404", async () => {
    await request(app).get("/reset").expect(404);
  });
});

describe("GET /healthz", () => {
  it("should return http 200 with healthy", async () => {
    const response = await request(app).get("/api/healthz").expect(200);
    expect(response.text).toEqual("healthy");
  });
});

describe("GET /dates", () => {
  it("should return http 200", async () => {
      const response = await request(app).get("/api/dates").expect(200);
      expect(response.text).not.toBeNull();
  });
});

describe("GET /rates", () => {
  it("should return http 400 bad request", async () => {
      const response = await request(app).get("/api/rates").expect(400);
      expect(response.text).toEqual("missing date parameter");
  });
});
