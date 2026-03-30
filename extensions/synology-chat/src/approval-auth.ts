import type { OpenClawConfig } from "openclaw/plugin-sdk/account-resolution";
import {
  createResolvedApproverActionAuthAdapter,
  resolveApprovalApprovers,
} from "openclaw/plugin-sdk/approval-runtime";
import { resolveAccount } from "./accounts.js";

function normalizeSynologyChatApproverId(value: string | number): string | undefined {
  const trimmed = String(value).trim();
  return /^\d+$/.test(trimmed) ? trimmed : undefined;
}

export const synologyChatApprovalAuth = createResolvedApproverActionAuthAdapter({
  channelLabel: "Synology Chat",
  resolveApprovers: ({ cfg, accountId }) => {
    const account = resolveAccount((cfg ?? {}) as OpenClawConfig, accountId);
    return resolveApprovalApprovers({
      allowFrom: account.allowedUserIds,
      normalizeApprover: normalizeSynologyChatApproverId,
    });
  },
  hasConfiguredApprovers: ({ cfg, accountId }) => {
    const account = resolveAccount((cfg ?? {}) as OpenClawConfig, accountId);
    return Boolean(account.allowedUserIds?.length);
  },
  normalizeSenderId: (value) => normalizeSynologyChatApproverId(value),
});
