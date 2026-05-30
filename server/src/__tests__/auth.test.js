import { describe, it, before, after } from "node:test";
import assert from "node:assert/strict";
import request from "supertest";
import { app, prisma } from "../app.js";

describe("POST /api/auth/register", () => {
  const email = `test-${Date.now()}@example.com`;

  after(async () => {
    await prisma.user.deleteMany({ where: { email } });
  });

  it("creates a user and returns 201 with token", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email, name: "Test User", password: "secret123" });

    assert.equal(res.status, 201);
    assert.ok(res.body.token);
    assert.equal(res.body.user.email, email);
    assert.equal(res.body.user.name, "Test User");
    assert.ok(res.body.user.id);
  });

  it("returns 400 when fields are missing", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email });

    assert.equal(res.status, 400);
    assert.ok(res.body.error);
  });

  it("returns 400 for invalid email format", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "bademail", name: "Test", password: "secret123" });

    assert.equal(res.status, 400);
  });

  it("returns 400 for short password", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email, name: "Test", password: "12" });

    assert.equal(res.status, 400);
  });

  it("returns 409 for duplicate email", async () => {
    await request(app)
      .post("/api/auth/register")
      .send({ email, name: "Test", password: "secret123" });

    const res = await request(app)
      .post("/api/auth/register")
      .send({ email, name: "Test Again", password: "secret123" });

    assert.equal(res.status, 409);
    assert.equal(res.body.error, "Email already in use");
  });
});

describe("POST /api/auth/login", () => {
  const email = `login-${Date.now()}@example.com`;

  before(async () => {
    await request(app)
      .post("/api/auth/register")
      .send({ email, name: "Login Test", password: "secret123" });
  });

  after(async () => {
    await prisma.user.deleteMany({ where: { email } });
  });

  it("returns 200 with token for valid credentials", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email, password: "secret123" });

    assert.equal(res.status, 200);
    assert.ok(res.body.token);
    assert.equal(res.body.user.email, email);
    assert.equal(res.body.user.name, "Login Test");
  });

  it("returns 401 for wrong password", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email, password: "wrongpassword" });

    assert.equal(res.status, 401);
  });

  it("returns 401 for non-existent email", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "nobody@example.com", password: "secret123" });

    assert.equal(res.status, 401);
  });

  it("returns 400 when fields are missing", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ email });

    assert.equal(res.status, 400);
  });
});
