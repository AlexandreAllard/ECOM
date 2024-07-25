const request = require('supertest');
const app = require('../app');
const { User } = require('../models');
const emailService = require('../services/emailService');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

jest.mock('../services/emailService');
jest.mock('jsonwebtoken');
jest.mock('bcryptjs');
jest.mock('uuid');

describe('User Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllUsers', () => {
        it('returns all users', async () => {
            const users = [{ id: 1, email: 'test@example.com' }];
            User.findAll = jest.fn().mockResolvedValue(users);

            const res = await request(app).get('/users');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(users);
        });

        it('handles errors', async () => {
            User.findAll = jest.fn().mockRejectedValue(new Error('Database error'));

            const res = await request(app).get('/users');

            expect(res.status).toBe(500);
        });
    });

    describe('getUserById', () => {
        it('returns a user by id', async () => {
            const user = { id: 1, email: 'test@example.com' };
            User.findByPk = jest.fn().mockResolvedValue(user);

            const res = await request(app).get('/users/1');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(user);
        });

        it('returns 404 if user not found', async () => {
            User.findByPk = jest.fn().mockResolvedValue(null);

            const res = await request(app).get('/users/1');

            expect(res.status).toBe(404);
        });

        it('handles errors', async () => {
            User.findByPk = jest.fn().mockRejectedValue(new Error('Database error'));

            const res = await request(app).get('/users/1');

            expect(res.status).toBe(500);
        });
    });

    describe('registerUser', () => {
        it('registers a new user', async () => {
            const user = { id: 1, email: 'test@example.com' };
            const token = 'token';
            jwt.sign.mockReturnValue(token);
            User.create = jest.fn().mockResolvedValue(user);
            emailService.sendVerificationEmail.mockResolvedValue();

            const res = await request(app)
                .post('/users')
                .send({ email: 'test@example.com', password: 'password', firstname: 'John', lastname: 'Doe' });

            expect(res.status).toBe(201);
            expect(res.body).toEqual({ id: user.id, email: user.email });
        });

        it('returns 422 if validation fails', async () => {
            const res = await request(app)
                .post('/users')
                .send({ email: '', password: '', firstname: '', lastname: '' });

            expect(res.status).toBe(422);
        });

        it('returns 409 if email already exists', async () => {
            User.create = jest.fn().mockRejectedValue({ name: 'SequelizeUniqueConstraintError' });

            const res = await request(app)
                .post('/users')
                .send({ email: 'test@example.com', password: 'password', firstname: 'John', lastname: 'Doe' });

            expect(res.status).toBe(409);
        });

        it('handles errors', async () => {
            User.create = jest.fn().mockRejectedValue(new Error('Database error'));

            const res = await request(app)
                .post('/users')
                .send({ email: 'test@example.com', password: 'password', firstname: 'John', lastname: 'Doe' });

            expect(res.status).toBe(500);
        });
    });

    describe('deleteUser', () => {
        it('deletes a user', async () => {
            const user = { id: 1, email: 'test@example.com' };
            User.findByPk = jest.fn().mockResolvedValue(user);
            User.update = jest.fn().mockResolvedValue([1]);
            bcrypt.hash.mockResolvedValue('hashedPassword');
            uuidv4.mockReturnValue('uuid');

            const res = await request(app).delete('/users/1');

            expect(res.status).toBe(200);
        });

        it('returns 404 if user not found', async () => {
            User.findByPk = jest.fn().mockResolvedValue(null);

            const res = await request(app).delete('/users/1');

            expect(res.status).toBe(404);
        });

        it('handles errors', async () => {
            User.findByPk = jest.fn().mockRejectedValue(new Error('Database error'));

            const res = await request(app).delete('/users/1');

            expect(res.status).toBe(500);
        });
    });

    describe('updateUser', () => {
        it('updates a user', async () => {
            User.update = jest.fn().mockResolvedValue([1]);

            const res = await request(app)
                .put('/users/1')
                .send({ email: 'updated@example.com' });

            expect(res.status).toBe(200);
        });

        it('returns 401 if user is not authenticated', async () => {
            const res = await request(app)
                .put('/users/1')
                .send({ email: 'updated@example.com' });

            expect(res.status).toBe(401);
        });

        it('returns 400 if no data is provided', async () => {
            const res = await request(app)
                .put('/users/1')
                .send({});

            expect(res.status).toBe(400);
        });

        it('returns 404 if user not found', async () => {
            User.update = jest.fn().mockResolvedValue([0]);

            const res = await request(app)
                .put('/users/1')
                .send({ email: 'updated@example.com' });

            expect(res.status).toBe(404);
        });

        it('handles validation errors', async () => {
            User.update = jest.fn().mockRejectedValue({ name: 'SequelizeValidationError' });

            const res = await request(app)
                .put('/users/1')
                .send({ email: 'invalid-email' });

            expect(res.status).toBe(400);
        });

        it('handles errors', async () => {
            User.update = jest.fn().mockRejectedValue(new Error('Database error'));

            const res = await request(app)
                .put('/users/1')
                .send({ email: 'updated@example.com' });

            expect(res.status).toBe(500);
        });
    });
});
