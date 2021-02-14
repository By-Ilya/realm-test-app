/* eslint no-tabs: ["error", { allowIndentationTabs: true }] */
import { custMessageHTMLBody, ceMessageHTMLBody } from 'helpers/survey/MessageTemplate';

/* export function genCustMessage(origEmail,custName,custEmail,projectId) {
	const messageParts = [
    `From: MongoDB Consulting <${origEmail}>`,
    `To: ${custName} <${custEmail}>`,
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: Thank you`,
    '',
    custMessageHTMLBody(custName, custEmail, projectId)
  ];
  const message = messageParts.join('\n');

  return message
} */

/* export function genCeMessage(origEmail,ceName,ceEmail,projectId,projectDesc) {
	const messageParts = [
    `From: MongoDB Consulting <${origEmail}>`,
    `To: ${ceName} <${ceEmail}>`,
    'Content-Type: text/html; charset=utf-8',
    'MIME-Version: 1.0',
    `Subject: Complete post-engagement survey`,
    '',
    ceMessageHTMLBody(ceName, ceEmail, projectId, projectDesc)
  ];
  const message = messageParts.join('\n');

  return message
} */

export function custMailParams(origEmail, custName, custEmail, projectId) {
    const toEmail = custEmail;
    const subject = 'Thank you';
    const html = custMessageHTMLBody(custName, custEmail, projectId);
    return {
        origEmail, toEmail, subject, html,
    };
}

export function ceMailParams(origEmail, ceName, ceEmail, projectId) {
    const toEmail = ceEmail;
    const subject = 'Complete post-engagement survey';
    const html = ceMessageHTMLBody(ceName, ceEmail, projectId);
    return {
        origEmail, toEmail, subject, html,
    };
}
