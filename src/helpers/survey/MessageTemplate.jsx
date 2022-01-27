/* eslint no-tabs: ["error", { allowIndentationTabs: true }] */
import React from 'react';
import PropTypes from 'prop-types';
import ReactHtmlParser from 'react-html-parser';

const SURVEY_LINKS = Object.freeze({
    cust: 'https://mongodb.co1.qualtrics.com/jfe/form/SV_2oCghQbYfJdV5Mp?',
    ce: 'https://mongodb.co1.qualtrics.com/jfe/form/SV_aUX8tfdgGcbd4j3?',
});

function generateSpecificUrlParams(name, email, projectId) {
    return `Name=${encodeURIComponent(name)}&` +
		`Email=${encodeURIComponent(email)}&` +
		`ProjectID=${encodeURIComponent(projectId)}`;
}

function generateCustSurveyLink(custName, custEmail, projectId) {
    return `${SURVEY_LINKS.cust}${generateSpecificUrlParams(
        custName,
        custEmail,
        projectId,
    )}`;
}


function generateCeSurveyLink(ceName, ceEmail, projectId) {
    return `${SURVEY_LINKS.ce}${generateSpecificUrlParams(
        ceName,
        ceEmail,
        projectId,
    )}`;
}

/***
 * Get Question Response Value
 *
 * Returns a string that represents the pre-encoded question value in the format necessary for Qualtrics embedded data
 *
 * @param questionID                A String representing the question id
 * @param questionResponseValue     A String representing the question value
 * @returns {string}                A String representing the pre-encoded qualtrics piped text for that question and value
 */
export function getQuestionResponseValue(questionID, questionResponseValue) {
    return `{${questionID}:${questionResponseValue}}`;
}

/***
 * Generate Question Table HTML
 *
 * Generate the HTML Table for the qualtrics survey question to be used in the survey email.
 *
 * @param surveyData        An valid HTTP response from Qualtrics which contains information about the survey to use as
 *                          the initial question in the survey email.
 * @returns {string}        A String representing the HTML table
 */
function generateQuestionTableHTML(surveyData) {
    const surveyId = surveyData.result.ProjectInfo.SurveyID;
    const mongodbQualtricsBaseUrl = surveyData.result.BrandBaseURL;
    const surveyResponseLink = `${mongodbQualtricsBaseUrl}/jfe/form/${surveyId}`;

    // Other embedded data: customer email, customer name, project id
    const questionIDNum = '16';
    const questionID = `QID${questionIDNum}`;
    const questionText = surveyData.result.Questions[questionID].QuestionText;
    const question1Response5Link = `${surveyResponseLink}?Q_CHL=email&Q_PopulateResponse=${encodeURIComponent(getQuestionResponseValue(questionID, 5))}&Q_PopulateValidate=1`;
    const question1Response5ChoiceDescription = surveyData.result.Questions[questionID].Choices['5'].Display;

    const question1Response4Link = `${surveyResponseLink}?Q_CHL=email&Q_PopulateResponse=${encodeURIComponent(getQuestionResponseValue(questionID, 4))}&Q_PopulateValidate=1`;
    const question1Response4ChoiceDescription = surveyData.result.Questions[questionID].Choices['4'].Display;

    const question1Response3Link = `${surveyResponseLink}?Q_CHL=email&Q_PopulateResponse=${encodeURIComponent(getQuestionResponseValue(questionID, 3))}&Q_PopulateValidate=1`;
    const question1Response3ChoiceDescription = surveyData.result.Questions[questionID].Choices['3'].Display;

    const question1Response2Link = `${surveyResponseLink}?Q_CHL=email&Q_PopulateResponse=${encodeURIComponent(getQuestionResponseValue(questionID, 2))}&Q_PopulateValidate=1`;
    const question1Response2ChoiceDescription = surveyData.result.Questions[questionID].Choices['2'].Display;

    const question1Response1Link = `${surveyResponseLink}?Q_CHL=email&Q_PopulateResponse=${encodeURIComponent(getQuestionResponseValue(questionID, 1))}&Q_PopulateValidate=1`;
    const question1Response1ChoiceDescription = surveyData.result.Questions[questionID].Choices['1'].Display;

    return `
      <br /> &nbsp;
        <table align="center" border="0" cellpadding="0" style="padding:16px; background-color:#F2F4F8; border:1px solid #D9DBDE; border-radius:3px; font-family:arial">
            <tbody>
                <tr>
                    <td style="padding-bottom:12px;font-size:15px;">${questionText}</td>
                </tr>
                <tr>
                    <td>
                    <table border="0" cellpadding="0" cellspacing="5" style="text-align:center;" width="100%">
                        <tbody>
                            <tr>
                                <td style="background:#666;border-radius:3px;"><a href=${question1Response5Link} style="display:block;font-size:12px;text-decoration:none;color:#ffffff;border:12px solid #666;border-radius:3px;background:#666;">${question1Response5ChoiceDescription}</a></td>
                            </tr>
                            <tr>
                                <td style="background:#666;border-radius:3px;"><a href=${question1Response4Link} style="display:block;font-size:12px;text-decoration:none;color:#ffffff;border:12px solid #666;border-radius:3px;background:#666;">${question1Response4ChoiceDescription}</a></td>
                            </tr>
                            <tr>
                                <td style="background:#666;border-radius:3px;"><a href=${question1Response3Link} style="display:block;font-size:12px;text-decoration:none;color:#ffffff;border:12px solid #666;border-radius:3px;background:#666;">${question1Response3ChoiceDescription}</a></td>
                            </tr>
                            <tr>
                                <td style="background:#666;border-radius:3px;"><a href=${question1Response2Link} style="display:block;font-size:12px;text-decoration:none;color:#ffffff;border:12px solid #666;border-radius:3px;background:#666;">${question1Response2ChoiceDescription}</a></td>
                            </tr>
                            <tr>
                                <td style="background:#666;border-radius:3px;"><a href=${question1Response1Link} style="display:block;font-size:12px;text-decoration:none;color:#ffffff;border:12px solid #666;border-radius:3px;background:#666;">${question1Response1ChoiceDescription}</a></td>
                            </tr>
                        </tbody>
                    </table>
                    </td>
                </tr>
            </tbody>
        </table>
        <br />
    `;
}

/***
 * Generate Footer
 *
 * Generates a HTML string for the footer of the survey email
 *
 * @param surveyData        An valid HTTP response from Qualtrics which contains information about the survey to use as
 *                          the initial question in the survey email.
 * @returns {string}        A String representing the HTML table
 */
function generateFooter(surveyData) {
    // TODO get this from qualtrics API
    const mongodbQualtricsBaseUrl = surveyData.result.BrandBaseURL;

    // const fullSurveyLink = 'https://mongodb.co1.qualtrics.com/jfe/form/SV_0jh2UxgPYLeijUW?Q_CHL=email';
    const fullSurveyLink = `${mongodbQualtricsBaseUrl}/jfe/form/${surveyData.result.ProjectInfo.ProjectInfo}`;

    // const optOutSurveyLink = 'https://mongodb.co1.qualtrics.com/CP/Register.php?OptOut=true&amp;RID=CGC_7OIfm1i30ZSj0gf&amp;LID=UR_etIB7DmCzr9c0Hs&amp;DID=EMD_iurwKgaX6FOOXcw&amp;BT=bW9uZ29kYg&amp;_=1';
    const optOutSurveyLink = 'https://mongodb.co1.qualtrics.com/CP/Register.php?OptOut=true&amp;RID=CGC_7OIfm1i30ZSj0gf&amp;LID=UR_etIB7DmCzr9c0Hs&amp;DID=EMD_iurwKgaX6FOOXcw&amp;BT=bW9uZ29kYg&amp;_=1';

    // const imageSrc = 'https://mongodb.co1.qualtrics.com/WRQualtricsContacts/Watermark.php?UID=UR_etIB7DmCzr9c0Hs&amp;EMD=EMD_iurwKgaX6FOOXcw&amp;CGC=CGC_7OIfm1i30ZSj0gf&amp;SV=SV_0jh2UxgPYLeijUW';
    const imageSrc = 'https://mongodb.co1.qualtrics.com/WRQualtricsContacts/Watermark.php?UID=UR_etIB7DmCzr9c0Hs&amp;EMD=EMD_iurwKgaX6FOOXcw&amp;CGC=CGC_7OIfm1i30ZSj0gf&amp;SV=SV_0jh2UxgPYLeijUW';
    return `
        <br>
        <strong>Follow this link to the Survey</strong>:<br>
        <a href=${fullSurveyLink}>Take the Survey</a><br>
        <br>
        Follow the link to opt out of future emails:<br>
        <a href=${optOutSurveyLink}>Click here to unsubscribe</a>
        <img width="1" height="1" alt="" src=${imageSrc}>
    `;
}

/***
 * Customer Message HTML Body
 *
 *  Generates the HTML for the body of the customer survey email. Note that this assumes a particular question from the
 *  survey will be embedded in the email, whose details are fetched from qualtrics API. Currently, that question is hard
 *  -coded and the HTML is dependent on that question. This should be changed in the future
 *
 * @param custName              A String
 * @returns {Promise<string>}
 */
export async function custMessageHTMLBody(custName) {
    const surveyId = 'SV_0jh2UxgPYLeijUW';
    const uri = `https://iad1.qualtrics.com/API/v3/survey-definitions/${surveyId}`;
    const headers = {
        'Content-Type': 'application/json',
        'X-API-TOKEN': 'cpAQPJMGpF5RqGcGXtVFssZ2339nNJL4GA8wAcP1',
    };
    const response = await fetch(uri, { headers })
        // eslint-disable-next-line no-unused-vars,consistent-return
        .then( response => {
            if (response.ok) {
                return response.json();
            }
        })
        .then(response => generateHtmlBodyFromResponse(custName, response))
        .catch((error) => {
            console.error('Encountered an error: ', error);
        });
    return response;
}

/**
 * Generate HTML Body From Response
 *
 * Create an HTML string from the customer name and HTTP response data provided.
 *
 * @param custName          A String representing the name of the customer
 * @param responseData      An valid HTTP response from Qualtrics which contains information about the survey to use as
 *                          the initial question in the survey email.
 * @returns {string}        A String containing the HTML for the email body
 */
function generateHtmlBodyFromResponse(custName, responseData) {
    //console.log(`Got response ${JSON.stringify(responseData)}`);
    const html = `
      <div>
          Hi ${custName},
          <br/><br/>
          Thank you for using MongoDB Consulting.
          <br/>
          It's been our pleasure to work with you. We want to know what you think. Please take 2 minutes to complete our survey questions below:
          <br/> 
          ${generateQuestionTableHTML(responseData)}
          <br/>
          We look forward to your feedback!
          <br/>
          MongoDB Professional Service
          <br/>
          ${generateFooter(responseData)}
      </div>
    `;
    return html;
}


export function ceMessageHTMLBody(ceName, ceEmail, projectId) {
    return `
  	  <div>
		  Hi ${ceName},
		  <br/><br/>
		  Thank you for your efforts on the following PS Project: ${projectId}.
		  <br/>
		  We want to know what you think. Please take 2 minutes to complete <a href=${
            generateCeSurveyLink(ceName, ceEmail, projectId)}>this survey</a> and share your experience.
		  <br/> <br/>
		  MongoDB Professional Services
		  <br/>
	  </div>`;
}

export function CustMessageTemplate(props) {
    const { custName, custEmail, projectId } = props;
    return (
        <div>
            <h1>Customer email</h1>
            <b>
                To:
                {custEmail}
            </b>
            <br />
            <b>From: MongoDB Consulting</b>
            <br />
            <b>Subject: Thank you</b>
            <br />
            {ReactHtmlParser(custMessageHTMLBody(
                custName,
                custEmail,
                projectId,
            ))}
        </div>
    );
}

export function CeMessageTemplate(props) {
    const {
        ceName, ceEmail, projectId, projectDesc,
    } = props;
    return (
        <div>
            <h1>CE email</h1>
            <b>
                To:
                {ceEmail}
            </b>
            <br />
            <b>From: MongoDB Consulting</b>
            <br />
            <b>Subject: Complete post-engagement survey</b>
            <br />
            {ReactHtmlParser(ceMessageHTMLBody(
                ceName,
                ceEmail,
                projectId,
                projectDesc,
            ))}
        </div>
    );
}

CustMessageTemplate.propTypes = {
    custName: PropTypes.string.isRequired,
    custEmail: PropTypes.string.isRequired,
    projectId: PropTypes.number.isRequired,
};

CeMessageTemplate.propTypes = {
    ceName: PropTypes.string.isRequired,
    ceEmail: PropTypes.string.isRequired,
    projectId: PropTypes.number.isRequired,
    projectDesc: PropTypes.string,
};

CeMessageTemplate.defaultProps = {
    projectDesc: '',
};
