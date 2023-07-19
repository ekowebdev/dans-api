import supertest from "supertest";
import {web} from "../src/application/web.js";
import {logger} from "../src/application/logging.js";
import {createTestUser, removeTestUser} from "./test-util.js";

describe('POST /api/register', function () {
    afterEach(async () => {
        await removeTestUser();
    });

    it('should can register', async () => {
        const result = await supertest(web)
            .post('/api/register')
            .send({
                name: "Testing",
                email: "test@test.com",
                password: "rahasia"
            });

        expect(result.status).toBe(200);
        expect(result.body.data.email).toBeDefined();
        expect(result.body.data.email).toBe("test@test.com");
    });

    it('should reject register if request is invalid', async () => {
        const result = await supertest(web)
            .post('/api/register')
            .send({
                name: "",
                email: "",
                password: ""
            });

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });
});

describe('POST /api/login', function () {
    beforeEach(async () => {
        await createTestUser();
    });

    afterEach(async () => {
        await removeTestUser();
    });

    it('should can login', async () => {
        const result = await supertest(web)
            .post('/api/login')
            .send({
                email: "test@test.com",
                password: "rahasia"
            });

        expect(result.status).toBe(200);
        expect(result.body.token).toBeDefined();
        expect(result.body.token).not.toBe("test");
    });

    it('should reject login if request is invalid', async () => {
        const result = await supertest(web)
            .post('/api/login')
            .send({
                email: "",
                password: ""
            });

        expect(result.status).toBe(400);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject login if password is wrong', async () => {
        const result = await supertest(web)
            .post('/api/login')
            .send({
                email: "test@test.com",
                password: "salah"
            });

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });

    it('should reject login if email is wrong', async () => {
        const result = await supertest(web)
            .post('/api/login')
            .send({
                email: "salah@test.com",
                password: "salah"
            });

        expect(result.status).toBe(401);
        expect(result.body.errors).toBeDefined();
    });
});
