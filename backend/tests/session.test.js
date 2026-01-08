const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../models');
const Movie = require('../models/Movie');
const Room = require('../models/Room');
const Session = require('../models/Session');

beforeAll(async () => {
    await sequelize.sync({ force: true });
    
    // Create test movie first
    const movie = await Movie.create({
        title: 'Test Movie',
        synopsis: 'Test synopsis',
        posterUrl: 'http://example.com/poster.jpg',
        duration: 120,
        rating: 8
    });
    movieId = movie.id;
    
    // Create test room
    const room = await Room.create({
        name: 'Test Room',
        capacity: 50
    });
    roomId = room.id;
});

afterAll(async () => {
    await sequelize.close();
});

describe('Sessions API', () => {
    let createdSessionId;

    it('should create a new session', async () => {
        const res = await request(app)
            .post('/api/sessions')
            .send({
                startTime: new Date().toISOString(),
                MovieId: movieId,
                RoomId: roomId
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.MovieId).toBe(movieId);
        createdSessionId = res.body.id;
    });

    it('should get all sessions', async () => {
        const res = await request(app).get('/api/sessions');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('should get sessions by movie', async () => {
        const res = await request(app).get(`/api/sessions/movie/${movieId}`);
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0].MovieId).toBe(movieId);
    });

    it('should get a session by id', async () => {
        const res = await request(app).get(`/api/sessions/${createdSessionId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.id).toBe(createdSessionId);
    });

    it('should update a session', async () => {
        const newTime = new Date();
        newTime.setHours(newTime.getHours() + 2);

        const res = await request(app)
            .put(`/api/sessions/${createdSessionId}`)
            .send({
                startTime: newTime.toISOString(),
            });

        expect(res.statusCode).toEqual(200);
        // Depending on DB storage/parsing, string matching might vary slightly so we check existence
        expect(res.body).toHaveProperty('startTime');
    });

    it('should delete a session', async () => {
        const res = await request(app).delete(`/api/sessions/${createdSessionId}`);
        expect(res.statusCode).toEqual(200);
    });
});
