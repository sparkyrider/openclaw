import {
  createResolvedApproverActionAuthAdapter,
  resolveApprovalApprovers,
} from "openclaw/plugin-sdk/approval-runtime";
import { resolveWhatsAppAccount } from "./accounts.js";
import { normalizeWhatsAppTarget } from "./runtime-api.js";

function normalizeWhatsAppApproverId(value: string | number): string | undefined {
  const normalized = normalizeWhatsAppTarget(String(value));
  if (!normalized || normalized.endsWith("@g.us")) {
    return undefined;
  }
  return normalized;
}

export const whatsappApprovalAuth = createResolvedApproverActionAuthAdapter({
  channelLabel: "WhatsApp",
  resolveApprovers: ({ cfg, accountId }) => {
    const account = resolveWhatsAppAccount({ cfg, accountId });
    return resolveApprovalApprovers({
      allowFrom: account.allowFrom,
      defaultTo: account.defaultTo,
      normalizeApprover: normalizeWhatsAppApproverId,
    });
  },
  hasConfiguredApprovers: ({ cfg, accountId }) => {
    const account = resolveWhatsAppAccount({ cfg, accountId });
    return Boolean(account.allowFrom?.length || account.defaultTo?.trim());
  },
  normalizeSenderId: (value) => normalizeWhatsAppApproverId(value),
});
