import request from 'supertest'
import runTestServer from '../../test.server'
import router from './user.routes'
import Express from 'express'
jest.useFakeTimers()
jest.setTimeout(30000);

describe('POST /user', function () {
    it('create user account', (done) => {
        runTestServer(8080, async (app: Express.Express) => {
            app.use('/user', router)

            const payload = {
                firstName: "john",
                lastName: "doe",
                email: "johndoe@gmail.com",
                displayName: "John Doe",
                profileImage: "https://example.com/johndoe.png",
                residence: "ET",
            }

            const response = await request(app).post('/user').send(payload)
                .set('Content-Type', 'application/json')
                .set('Accept', 'application/json')

            if (response) {
                expect(response.statusCode).toBe(200)
                expect(response.body).toHaveProperty('id')
                expect(response.body).toHaveProperty('firstName')
                expect(response.body).toHaveProperty('lastName')
                expect(response.body).toHaveProperty('email')
                expect(response.body).toHaveProperty('displayName')
                expect(response.body).toHaveProperty('profileImage')
                expect(response.body).toHaveProperty('residence')

                expect(response.body.length).toBeGreaterThan(0)

            } else {
                console.log('response is null')
            }

            afterAll(async () => {
                await done()
            })
        }).close()
    })
})