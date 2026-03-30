import {
  createResolvedApproverActionAuthAdapter,
  resolveApprovalApprovers,
} from "openclaw/plugin-sdk/approval-runtime";
import { resolveFeishuAccount } from "./accounts.js";
import { normalizeFeishuTarget } from "./targets.js";

function normalizeFeishuApproverId(value: string | number): string | undefined {
  const normalized = normalizeFeishuTarget(String(value));
  const trimmed = normalized?.trim().toLowerCase();
  return trimmed?.startsWith("ou_") ? trimmed : undefined;
}

export const feishuApprovalAuth = createResolvedApproverActionAuthAdapter({
  channelLabel: "Feishu",
  resolveApprovers: ({ cfg, accountId }) => {
    const account = resolveFeishuAccount({ cfg, accountId }).config;
    return resolveApprovalApprovers({
      allowFrom: account.allowFrom,
      normalizeApprover: normalizeFeishuApproverId,
    });
  },
  hasConfiguredApprovers: ({ cfg, accountId }) => {
    const account = resolveFeishuAccount({ cfg, accountId }).config;
    return Boolean(account.allowFrom?.length);
  },
  normalizeSenderId: (value) => normalizeFeishuApproverId(value),
});
