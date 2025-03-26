import {expect, test} from "vitest";
import request from "supertest";
import app from "../backend.js";




test('GET /users  should return List of Users', async () => {
    const response = await request(app).get('/users');
    expect(response.status).toBe(200);
    expect(response.body.length).toBeGreaterThan(0);
})
