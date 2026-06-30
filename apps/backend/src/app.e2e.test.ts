import { Test } from "@nestjs/testing";
import request from "supertest";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { AppModule } from "./app.module.js";

describe("plans API", () => {
  let app: { close: () => Promise<void>; getHttpAdapter: () => { getInstance: () => unknown } };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();

    const nestApp = moduleRef.createNestApplication();
    await nestApp.init();
    app = nestApp;
  });

  afterEach(async () => {
    await app.close();
  });

  it("creates a plan, accepts a participant response, and exposes admin responses", async () => {
    const server = app.getHttpAdapter().getInstance();

    const createResponse = await request(server)
      .post("/plans")
      .send({
        title: "여름 휴가 언제 같이가지?",
        adminPassword: "secret123",
        questions: [
          { label: "술먹고싶어?", type: "boolean" },
          { label: "인당 예산 얼마 생각해?", type: "number" },
          { label: "건의사항있어?", type: "string" }
        ]
      })
      .expect(201);

    expect(createResponse.body.handle).toMatch(/^[A-Za-z0-9_-]{10}$/);
    expect(createResponse.body.shareUrl).toContain(createResponse.body.handle);

    const publicPlan = await request(server)
      .get(`/plans/${createResponse.body.handle}`)
      .expect(200);

    expect(publicPlan.body.questions).toHaveLength(3);

    const submitResponse = await request(server)
      .post(`/plans/${createResponse.body.handle}/responses`)
      .send({
        nickname: "동동",
        desiredNights: 2,
        availabilityRanges: [
          { startDate: "2026-08-01", endDate: "2026-08-04" }
        ],
        answers: [
          {
            questionId: publicPlan.body.questions[0].id,
            type: "boolean",
            value: true
          }
        ]
      })
      .expect(201);

    expect(submitResponse.body.participant.nickname).toBe("동동");

    const results = await request(server)
      .get(`/plans/${createResponse.body.handle}/results`)
      .expect(200);

    expect(results.body.participants).toHaveLength(1);

    await request(server)
      .get(`/admin/plans/${createResponse.body.handle}/responses`)
      .expect(401);

    const login = await request(server)
      .post(`/admin/plans/${createResponse.body.handle}/login`)
      .send({ password: "secret123" })
      .expect(201);

    expect(login.headers["set-cookie"]).toBeDefined();

    const adminResponses = await request(server)
      .get(`/admin/plans/${createResponse.body.handle}/responses`)
      .set("Cookie", login.headers["set-cookie"])
      .expect(200);

    expect(adminResponses.body.participants).toHaveLength(1);
    expect(adminResponses.body.calendarEvents[0]).toMatchObject({
      participantNickname: "동동",
      start: "2026-08-01",
      end: "2026-08-04"
    });
  });
});
