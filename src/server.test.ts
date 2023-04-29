import { getPort } from "./port";

describe('Getting port ', () => {
    test('should be 5000', (done) => {
        expect(getPort()).toBe(5000)
        done();
    })
})
