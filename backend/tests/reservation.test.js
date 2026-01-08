const request = require('supertest');
const app = require('../src/app');
const { sequelize } = require('../models');
const Movie = require('../models/Movie');
const Room = require('../models/Room');
const Session = require('../models/Session');
const Reservation = require('../models/Reservation');

beforeAll(async () => {
    await sequelize.sync({ force: true });
});

afterAll(async () => {
    await sequelize.close();
});

describe('Reservations API', () => {
    let createdReservationId;
    let sessionId;

    beforeAll(async () => {
        const movie = await Movie.create({
            title: 'Reservation Movie',
            synopsis: 'Test',
            duration: 100,
            rating: 8
        });

        const room = await Room.create({
            name: 'Reservation Room',
            capacity: 50
        });

        const session = await Session.create({
            startTime: new Date(),
            MovieId: movie.id,
            RoomId: room.id
        });
        sessionId = session.id;
    });

    it('should create a new reservation', async () => {
        const res = await request(app)
            .post('/api/reservations')
            .send({
                customerName: 'Alice',
                customerEmail: 'alice@example.com',
                seatNumber: 'A1',
                sessionId: sessionId
            });

        expect(res.statusCode).toEqual(201);
        expect(res.body.customerName).toBe('Alice');
        createdReservationId = res.body.id;
    });

    it('should get all reservations', async () => {
        const res = await request(app).get('/api/reservations');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBeGreaterThan(0);
    });

    it('should get reservation by id', async () => {
        const res = await request(app).get(`/api/reservations/${createdReservationId}`);
        expect(res.statusCode).toEqual(200);
        expect(res.body.customerName).toBe('Alice');
    });

    it('should get reservations by session', async () => {
        const res = await request(app).get(`/api/reservations/session/${sessionId}`);
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0].SessionId).toBe(sessionId);
    });

    it('should get reservations by customer email', async () => {
        const res = await request(app).get('/api/reservations/customer/alice@example.com');
        expect(res.statusCode).toEqual(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body[0].customerEmail).toBe('alice@example.com');
    });

    it('should delete a reservation', async () => {
        const res = await request(app).delete(`/api/reservations/${createdReservationId}`);
        expect(res.statusCode).toEqual(200);
    });
});
