const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../models');

beforeAll(async () => {
    await sequelize.sync({ force: true });
});

afterAll(async () => {
    // We don't close here because other tests might run in the same process if run sequentially, 
    // but Jest typically isolates. However, 'sequelize.close()' might prevent other tests from re-opening if sharing the instance.
    // Actually, since we import the singleton instance, we should be careful. 
    // For Jest with --runInBand or default, reusing the instance is fine as long as we reset data.
    // But let's just close it to be safe and clean.
    // Wait, if I close it, subsequent test files might fail if they require the same module and get a closed connection.
    // Better to NOT close connection in afterAll if we reusing the process, but standard practice in Jest is per-file setup.
    // Let's close it.
    await sequelize.close();
});

describe('Rooms API', () => {
    let createdRoomId;

    it('should create a new room', async () => {
        const res = await request(app)
            .post('/api/rooms')
            .send({
                name: 'IMAX Hall',
                capacity: 250
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.name).toBe('IMAX Hall');
        createdRoomId = res.body.id;
    });

    it('should get all rooms', async () => {
        const res = await request(app).get('/api/rooms');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('should get a room by id', async () => {
        const res = await request(app).get(`/api/rooms/${createdRoomId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.name).toBe('IMAX Hall');
    });

    it('should update a room', async () => {
        const res = await request(app)
            .put(`/api/rooms/${createdRoomId}`)
            .send({
                name: 'IMAX Hall Updated',
                capacity: 300
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body.name).toBe('IMAX Hall Updated');
        expect(res.body.capacity).toBe(300);
    });

    it('should delete a room', async () => {
        const res = await request(app).delete(`/api/rooms/${createdRoomId}`);
        expect(res.statusCode).toEqual(200);
    });

    it('should return 404 for deleted room', async () => {
        const res = await request(app).get(`/api/rooms/${createdRoomId}`);
        expect(res.statusCode).toEqual(404);
    });
});
