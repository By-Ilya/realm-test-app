import React from "react";
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';


function generateCustSurveyLink(custName,custEmail,projectId) {
	return "https://mongodb.co1.qualtrics.com/jfe/form/SV_2oCghQbYfJdV5Mp?" 
	  + "Name=" + encodeURIComponent(custName)
	  + "&Email=" + encodeURIComponent(custEmail)
	  + "&ProjectID=" + encodeURIComponent(projectId);
}

function generateCeSurveyLink(ceName,ceEmail,projectId) {
	return "https://mongodb.co1.qualtrics.com/jfe/form/SV_aUX8tfdgGcbd4j3?" 
	  + "Name=" + encodeURIComponent(ceName)
	  + "&Email=" + encodeURIComponent(ceEmail)
	  + "&ProjectID=" + encodeURIComponent(projectId);
}

// export function custMessageHTMLBody(custName,custEmail,projectId) {
//   return (
//   	  <div>
// 		  Hi {custName},
// 		  <br/>
// 		  Thank you for using MongoDB Consulting.
// 		  <br/>
// 		  Take a quick <a href={generateCustSurveyLink(custName, custEmail, projectId)}>survey</a> and tell us about your experience below.
// 		  <br/> <br/>
// 		  MongoDB Professional Services
// 		  <br/>
// 	  </div>
//   );
// }

export function custMessageHTMLBody(custName,custEmail,projectId) {
  return `
  	  <div>
		  Hi ${custName},
		  <br/><br/>
		  Thank you for using MongoDB Consulting.
		  <br/>
		  It's been our pleasure to work with you. We want to know what you think. Please take 2 minutes to complete <a href=${generateCustSurveyLink(custName, custEmail, projectId)}>our survey</a> and tell us about your experience.
		  <br/> <br/>
		  MongoDB Professional Services
		  <br/>
	  </div>`;
}

export function ceMessageHTMLBody(ceName,ceEmail,projectId) {
  return `
  	  <div>
		  Hi ${ceName},
		  <br/><br/>
		  Thank you for your efforts on the following PS Project: ${projectId}.
		  <br/>
		  We want to know what you think. Please take 2 minutes to complete <a href=${generateCeSurveyLink(ceName,ceEmail, projectId)}>this survey</a> and share your experience.
		  <br/> <br/>
		  MongoDB Professional Services
		  <br/>
	  </div>`;
}

export function CustMessageTemplate(props) {
  return (
  <div>
  <h1>Customer email</h1>
  <b>To: {props.custEmail}</b><br/>
  <b>From: MongoDB Consulting</b><br/>
  <b>Subject: Thank you</b><br/>
  {ReactHtmlParser(custMessageHTMLBody(props.custName, props.custEmail, props.projectId))}
  </div>
  );
}

export function CeMessageTemplate(props) {
  return (
  <div>
  <h1>CE email</h1>
  <b>To: {props.ceEmail}</b><br/>
  <b>From: MongoDB Consulting</b><br/>
  <b>Subject: Complete post-engagement survey</b><br/>
	{ReactHtmlParser(ceMessageHTMLBody(props.ceName, props.ceEmail, props.projectId, props.projectDesc))}
  </div>
  );
}