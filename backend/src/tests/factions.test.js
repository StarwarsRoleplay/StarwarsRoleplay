const request = require('supertest');
const app = require('../../app');

describe('GET /api/v1/factions', () => {
  it('should return 200 OK and an array of factions', async () => {
    const res = await request(app).get('/api/v1/factions');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty('id');
    expect(res.body[0]).toHaveProperty('name');
  });
});
