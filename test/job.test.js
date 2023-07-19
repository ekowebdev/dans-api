import {
    createTestUser,
    removeTestUser
} from "./test-util.js";
import supertest from "supertest";
import {web} from "../src/application/web.js";
import jsonwebtoken from "jsonwebtoken";

describe('GET /api/jobs/:id', function () {
    beforeEach(async () => {
        await createTestUser();
    })

    afterEach(async () => {
        await removeTestUser();
    })

    it('should can get jobs', async () => {
        const jobId = "f4a7c47f-c8ac-49fa-b15b-4ab37bfd2307";
        const user = {
            email: "test@test.com",
            password: "rahasia"
        }
        const token = jsonwebtoken.sign({ user: user }, process.env.SECRET_KEY);

        await supertest(web).get('/api/jobs/').set('Cookie', `token=${token}; Domain=localhost; Path=/`);

        const result = await supertest(web)
            .get("/api/jobs/" + jobId)
            .set('Authorization', `Bearer ${token}`);

        expect(result.status).toBe(200);
        expect(result.body.id).toBe(result.id);
        expect(result.body.description).toBe(result.description);
        expect(result.body.location).toBe(result.location);
    });

    it('should return 404 if jobs id is not found', async () => {
        const jobId = "f4a7c47f-c8ac-49fa-b15b-4ab37bfd2307";
        const user = {
            email: "test@test.com",
            password: "rahasia"
        }
        const token = jsonwebtoken.sign({ user: user }, process.env.SECRET_KEY);

        await supertest(web).get('/api/jobs/').set('Cookie', `token=${token}; Domain=localhost; Path=/`);

        const result = await supertest(web)
            .get("/api/jobs/" + (jobId.id + 1))
            .set('Authorization', `Bearer ${token}`);

        expect(result.status).toBe(404);
    });
});

describe('GET /api/jobs', function () {
    beforeEach(async () => {
        await createTestUser();
    })

    afterEach(async () => {
        await removeTestUser();
    })

    it('should can search without parameter', async () => {
        const user = {
            email: "test@test.com",
            password: "rahasia"
        }
        const token = jsonwebtoken.sign({ user: user }, process.env.SECRET_KEY);

        await supertest(web).get('/api/jobs/').set('Cookie', `token=${token}; Domain=localhost; Path=/`);

        const result = await supertest(web)
            .get('/api/jobs')
            .set('Authorization', `Bearer ${token}`);

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(10);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.total_page).toBe(2);
        expect(result.body.paging.total_data).toBe(15);
    });

    it('should can search to page 2', async () => {
        const user = {
            email: "test@test.com",
            password: "rahasia"
        }
        const token = jsonwebtoken.sign({ user: user }, process.env.SECRET_KEY);

        await supertest(web).get('/api/jobs/').set('Cookie', `token=${token}; Domain=localhost; Path=/`);

        const result = await supertest(web)
            .get('/api/jobs')
            .query({
                page: 2
            })
            .set('Authorization', `Bearer ${token}`);

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(5);
        expect(result.body.paging.page).toBe(2);
        expect(result.body.paging.total_page).toBe(2);
        expect(result.body.paging.total_data).toBe(15);
    });

    it('should can search using location', async () => {
        const user = {
            email: "test@test.com",
            password: "rahasia"
        }
        const token = jsonwebtoken.sign({ user: user }, process.env.SECRET_KEY);

        await supertest(web).get('/api/jobs/').set('Cookie', `token=${token}; Domain=localhost; Path=/`);

        const result = await supertest(web)
            .get('/api/jobs')
            .query({
                location: "berlin"
            })
            .set('Authorization', `Bearer ${token}`);

        expect(result.status).toBe(200);
        expect(result.body.data.length).toBe(6);
        expect(result.body.paging.page).toBe(1);
        expect(result.body.paging.total_page).toBe(1);
        expect(result.body.paging.total_data).toBe(6);
    });
});
