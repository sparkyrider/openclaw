import { describe, expect, it } from "vitest";
import { googleChatApprovalAuth } from "./approval-auth.js";

describe("googleChatApprovalAuth", () => {
  it("authorizes stable users/* ids and rejects unresolved email-style approvers", () => {
    expect(
      googleChatApprovalAuth.authorizeActorAction({
        cfg: { channels: { googlechat: { dm: { allowFrom: ["users/123"] } } } },
        senderId: "users/123",
        action: "approve",
        approvalKind: "exec",
      }),
    ).toEqual({ authorized: true });

    expect(
      googleChatApprovalAuth.authorizeActorAction({
        cfg: { channels: { googlechat: { dm: { allowFrom: ["owner@example.com"] } } } },
        senderId: "users/attacker",
        action: "approve",
        approvalKind: "exec",
      }),
    ).toEqual({
      authorized: false,
      reason: "❌ You are not authorized to approve exec requests on Google Chat.",
    });
  });
});
