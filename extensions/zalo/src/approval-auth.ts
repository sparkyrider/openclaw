import {
  createResolvedApproverActionAuthAdapter,
  resolveApprovalApprovers,
} from "openclaw/plugin-sdk/approval-runtime";
import { resolveZaloAccount } from "./accounts.js";

function normalizeZaloApproverId(value: string | number): string | undefined {
  const normalized = String(value)
    .trim()
    .replace(/^(zalo|zl):/i, "")
    .trim();
  return /^\d+$/.test(normalized) ? normalized : undefined;
}

export const zaloApprovalAuth = createResolvedApproverActionAuthAdapter({
  channelLabel: "Zalo",
  resolveApprovers: ({ cfg, accountId }) => {
    const account = resolveZaloAccount({ cfg, accountId }).config;
    return resolveApprovalApprovers({
      allowFrom: account.allowFrom,
      normalizeApprover: normalizeZaloApproverId,
    });
  },
  hasConfiguredApprovers: ({ cfg, accountId }) => {
    const account = resolveZaloAccount({ cfg, accountId }).config;
    return Boolean(account.allowFrom?.length);
  },
  normalizeSenderId: (value) => normalizeZaloApproverId(value),
});
