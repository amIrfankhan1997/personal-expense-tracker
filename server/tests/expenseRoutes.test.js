const request = require('supertest');
const app = require('../server'); // Import the app from server.js

describe('Expense Routes', () => {

    // Test GET /expenses
    describe('GET /expenses', () => {
        it('should fetch all expenses', async () => {
            const res = await request(app).get('/expenses');
            expect(res.status).toBe(200);
            expect(Array.isArray(res.body)).toBe(true);
        });
    });

    // Test POST /expenses
    describe('POST /expenses', () => {
        it('should add new expenses', async () => {
            const expense = [
                { date: '2024-11-09', description: 'Groceries', amount: 50, category: 'Food' }
            ];
            const res = await request(app).post('/expenses').send(expense);
            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Expenses processed successfully');
        });
    });

    // Test PUT /expenses/:id
    describe('PUT /expenses/:id', () => {
        it('should update an existing expense', async () => {
            const updateData = { description: 'Updated Groceries', amount: 60 };
            const res = await request(app).put('/expenses/1').send(updateData);
            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Expense updated successfully');
        });
    });

    // Test DELETE /expenses/:id
    describe('DELETE /expenses/:id', () => {
        it('should delete an expense', async () => {
            const res = await request(app).delete('/expenses/1');
            expect(res.status).toBe(200);
            expect(res.body.message).toBe('Expense deleted successfully');
        });
    });

    // Test GET /expenses/summary
    describe('GET /expenses/summary', () => {
        it('should return expense summary', async () => {
            const res = await request(app).get('/expenses/summary');
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('totalAmount');
            expect(res.body).toHaveProperty('categoryTotals');
        });
    });
});
