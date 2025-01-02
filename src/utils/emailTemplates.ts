interface EmailTemplate {
  subject: string;
  body: string;
}

export function getShareEmailTemplate(
  documentTitle: string,
  sharedBy: string,
  permission: string,
  link: string
): EmailTemplate {
  return {
    subject: `Document shared with you: ${documentTitle}`,
    body: `
Hello,

${sharedBy} has shared a document with you: "${documentTitle}"

You have been granted ${permission} access to this document.

Click the link below to access the document:
${link}

This link will expire in 7 days.

Best regards,
Your Legal Assistant Team
    `.trim()
  };
}

export function getAccessRevokedTemplate(
  documentTitle: string,
  revokedBy: string
): EmailTemplate {
  return {
    subject: `Access revoked: ${documentTitle}`,
    body: `
Hello,

Your access to the document "${documentTitle}" has been revoked by ${revokedBy}.

If you believe this is a mistake, please contact the document owner.

Best regards,
Your Legal Assistant Team
    `.trim()
  };
}