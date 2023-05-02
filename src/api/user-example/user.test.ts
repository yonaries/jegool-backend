import app from '@/server';
import request from 'supertest';

describe('GET /user', function () {
    it('responds with json', function (done) {
        request(app)
            .get('/user-example')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done)
            .end(function (err, res) {
                if (err) return done(err);
                return done();
            });
    });
});