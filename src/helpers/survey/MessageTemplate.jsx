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

/* export function custMessageHTMLBody(custName,custEmail,projectId) {
  return (
  	  <div>
		  Hi {custName},
		  <br/>
		  Thank you for using MongoDB Consulting.
		  <br/>
		  Take a quick <a href={generateCustSurveyLink(custName, custEmail, projectId)}>survey</a> and tell us about your experience below.
		  <br/> <br/>
		  MongoDB Professional Services
		  <br/>
	  </div>
  );
} */

export function custMessageHTMLBody(custName, custEmail, projectId) {
    return `
  	  <div>
		  Hi ${custName},
		  <br/><br/>
		  Thank you for using MongoDB Consulting.
		  <br/>
		  It's been our pleasure to work with you. We want to know what you think. Please take 2 minutes to complete <a href=${
            generateCustSurveyLink(custName, custEmail, projectId)}>our survey</a> and tell us about your experience.
		  <br/> <br/>
		  MongoDB Professional Services
		  <br/>
	  </div>
	`;
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
