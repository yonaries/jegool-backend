import request from 'supertest';
import IUser from './user.model';
import runTestServer from '../../test.server';
import router from './user.routes';

describe('GET /user', function () {
    test('responds with json', async () => {
        // rome-ignore lint/suspicious/noExplicitAny: <explanation>
        runTestServer(8080, async (app: any) => {
            app.use('/user-example', router);

            const response = await request(app).get('/user-example');
            expect(response.statusCode).toBe(200);
            expect(response.type).toBe('application/json');
            expect(response.body).toHaveProperty('users');
            expect(response.body.users).toBeInstanceOf(Array);
            expect(response.body.users.length).toBeGreaterThan(0);

            response.body.users.forEach((user: IUser) => {
                expect(user).toHaveProperty('id');
                expect(user).toHaveProperty('name');
                expect(user).toHaveProperty('email');
                expect(user).toHaveProperty('password');
                expect(user).toHaveProperty('createdAt');
                expect(user).toHaveProperty('updatedAt');
            });

        }).close()
    });
});