const request = require('supertest');
const app = require('../app');
const { LegalDocument, User } = require('../models');
const emailService = require('../services/emailService');

jest.mock('../services/emailService');

describe('Legal Controller', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getAllDocuments', () => {
        it('returns all documents', async () => {
            const documents = [{ id: 1, documentType: 'CGV', title: 'Terms' }];
            LegalDocument.findAll = jest.fn().mockResolvedValue(documents);

            const res = await request(app).get('/legal-documents');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(documents);
        });

        it('returns documents filtered by documentType', async () => {
            const documents = [{ id: 1, documentType: 'CGV', title: 'Terms' }];
            LegalDocument.findAll = jest.fn().mockResolvedValue(documents);

            const res = await request(app).get('/legal-documents?documentType=CGV');

            expect(res.status).toBe(200);
            expect(res.body).toEqual(documents);
        });

        it('handles errors', async () => {
            LegalDocument.findAll = jest.fn().mockRejectedValue(new Error('Database error'));

            const res = await request(app).get('/legal-documents');

            expect(res.status).toBe(500);
        });
    });

    describe('updateDocument', () => {
        it('updates a document and sends email', async () => {
            const document = { id: 1, documentType: 'CGV', title: 'Updated Terms' };
            const users = [{ id: 1, email: 'user@example.com' }];
            LegalDocument.update = jest.fn().mockResolvedValue([1]);
            LegalDocument.findByPk = jest.fn().mockResolvedValue(document);
            User.findAll = jest.fn().mockResolvedValue(users);
            emailService.sendUpdatedTermsEmail.mockResolvedValue();

            const res = await request(app)
                .put('/legal-documents/1')
                .send({ title: 'Updated Terms' });

            expect(res.status).toBe(200);
            expect(res.body).toEqual(document);
            expect(LegalDocument.update).toHaveBeenCalledWith({ title: 'Updated Terms' }, { where: { id: '1' } });
            expect(LegalDocument.findByPk).toHaveBeenCalledWith('1');
            expect(User.findAll).toHaveBeenCalled();
            expect(emailService.sendUpdatedTermsEmail).toHaveBeenCalledWith(users, document.documentType, document.title);
        });

        it('returns 404 if document not found', async () => {
            LegalDocument.update = jest.fn().mockResolvedValue([0]);

            const res = await request(app)
                .put('/legal-documents/1')
                .send({ title: 'Updated Terms' });

            expect(res.status).toBe(404);
        });

        it('handles errors', async () => {
            LegalDocument.update = jest.fn().mockRejectedValue(new Error('Database error'));

            const res = await request(app)
                .put('/legal-documents/1')
                .send({ title: 'Updated Terms' });

            expect(res.status).toBe(500);
        });
    });
});
