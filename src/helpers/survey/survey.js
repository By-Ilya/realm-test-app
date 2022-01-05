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

/***
 * Customer Mail Params
 *
 * Creates a set of parameters that defines the email sent to the customer
 *
 * @param origEmail     A String representing the "from" email address
 * @param custName      A String representing the customer name to which the email will be sent
 * @param custEmail     A String representing the customer email address to which the email will be sent
 * @param projectId     A String representing the PS Project ID
 * @returns {Promise<{subject: string, origEmail, html: string, toEmail}>}
 */
export async function custMailParams(origEmail, custName, custEmail, projectId) {
    const toEmail = custEmail;
    const subject = 'Thank you';
    const html = await custMessageHTMLBody(custName, custEmail, projectId);
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
