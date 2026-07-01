import { expect, test } from "@playwright/test";
import type { Page } from "@playwright/test";

async function moveCalendarToMonth(page: Page, targetMonth: string) {
  for (let attempt = 0; attempt < 36; attempt += 1) {
    const visibleLabel = await page.locator(".calendar-nav strong").first().textContent();

    if (visibleLabel === targetMonth) {
      return;
    }

    if (!visibleLabel) {
      throw new Error("캘린더 월 표시를 찾지 못했습니다.");
    }

    await page
      .getByRole("button", {
        name: visibleLabel < targetMonth ? "다음 달" : "이전 달"
      })
      .first()
      .click();
  }

  throw new Error(`${targetMonth} 캘린더로 이동하지 못했습니다.`);
}

test("creates a vacation plan and submits a participant response", async ({
  page
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "계획 만들기" }).click();

  await page.getByLabel("관리자 암호").fill("secret123");
  await page.getByRole("button", { name: "계획 만들기" }).click();

  await expect(page.getByText("공유 URL이 생겼어요")).toBeVisible();

  const shareText = await page
    .getByText(/톡방 공유:/)
    .textContent({ timeout: 10_000 });
  const shareUrl = shareText?.replace("톡방 공유: ", "");

  expect(shareUrl).toContain("/p/");

  await page.goto(shareUrl ?? "/");
  await page.getByLabel("닉네임").fill("동동");
  await page.getByLabel("희망 숙박수").fill("2");
  await moveCalendarToMonth(page, "2026년 8월");
  await page.getByRole("button", { name: /2026-08-01 선택/ }).click();
  await page.getByRole("button", { name: /2026-08-04 선택/ }).click();
  await page.getByRole("button", { name: "답변 제출" }).click();

  await expect(page.getByText("답변이 저장됐어요.")).toBeVisible();
  await page.getByRole("button", { name: "다른 사람 답변 보기" }).click();

  await expect(page.getByText("동동")).toBeVisible();
  await expect(page.getByText("희망 숙박수: 2박")).toBeVisible();
});
