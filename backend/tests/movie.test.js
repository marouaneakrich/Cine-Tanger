const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../models');

beforeAll(async () => {
    await sequelize.sync({ force: true });
});

afterAll(async () => {
    await sequelize.close();
});

describe('Movies API', () => {
    let createdMovieId;

    it('should create a new movie', async () => {
        const res = await request(app)
            .post('/api/movies')
            .send({
                title: 'Inception',
                synopsis: 'A thief who steals corporate secrets through the use of dream-sharing technology...',
                posterUrl: 'http://example.com/inception.jpg',
                duration: 148,
                rating: 9
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('id');
        expect(res.body.title).toBe('Inception');
        createdMovieId = res.body.id;
    });

    it('should get all movies', async () => {
        const res = await request(app).get('/api/movies');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('should get a movie by id', async () => {
        const res = await request(app).get(`/api/movies/${createdMovieId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.title).toBe('Inception');
    });

    it('should update a movie', async () => {
        const res = await request(app)
            .put(`/api/movies/${createdMovieId}`)
            .send({
                title: 'InceptionUpdated',
                synopsis: 'Updated synopsis',
                posterUrl: 'http://example.com/inception.jpg',
                duration: 150,
                rating: 10
            });

        expect(res.statusCode).toEqual(200);
        expect(res.body.title).toBe('InceptionUpdated');
    });

    it('should delete a movie', async () => {
        const res = await request(app).delete(`/api/movies/${createdMovieId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message');
    });

    it('should return 404 for deleted movie', async () => {
        const res = await request(app).get(`/api/movies/${createdMovieId}`);
        expect(res.statusCode).toEqual(404);
    });
});
