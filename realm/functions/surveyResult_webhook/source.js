// This function is the endpoint's request handler.
exports = function({ query, headers, body}, response) {
  
    function notifyHTMLBody(projectName, name, survey_response) {
      return `
          <div>
          Hi ${name},
          <br/><br/>
          We just received a survey response for the following PS Project: <b>${projectName}</b>! See below for the details.
          <br/><br/>
          Survey: ${survey_response.survey} <br/>
          Name: ${survey_response.name} (${survey_response.email}) <br/>
          Questions: <br/>
          <ul>
            ${survey_response.questions.map(r => `<li>${r.text}: <b>${r.score}</b></li>`).join(" ")}
          </ul>
          ${survey_response.additional_feedback ? "Additional feedback: " + survey_response.additional_feedback : ""}
          <br/> <br/>
          MongoDB Professional Services
          <br/>
        </div>`;
    }

    async function notifyPM(project_doc, survey_response) {
      const pm_email = project_doc.project_manager_email;
      const pm_name = project_doc.project_manager;
      const owner_email = project_doc.owner_email;
    
      if (!pm_email) {
        console.log("Ignoring because no pm email is listed for the project");
        return;
      }
    
      const emailParams = {
        origEmail: owner_email,
        toEmail: pm_email, 
        subject: "Survey response received for " + project_doc.name,
        html: notifyHTMLBody(project_doc.name, pm_name, survey_response)
      };
    
      await context.functions.execute(
                    'sendMail',
                    emailParams,
                );
    }
  
    function processQuestionsData(doc) {
      var isPlainObject = function (obj) {
        return Object.prototype.toString.call(obj) === '[object Object]';
      };
  
      function isNumeric(str) {
        if (typeof str != "string") return false // we only process strings!  
        return !isNaN(str) && // use type coercion to parse the _entirety_ of the string (`parseFloat` alone does not do this)...
               !isNaN(parseFloat(str)) // ...and ensure strings of whitespace fail
      }
  
      var questions = [];
  
      const iterate = (obj) => {
          Object.keys(obj).forEach(key => {
            if ((key.indexOf("question") >= 0) && isPlainObject(obj[key]) && isNumeric(obj[key].score_value)) {
                obj[key].score_value = parseFloat(obj[key].score_value);
                questions.push(obj[key]);
                delete obj[key];
            }
          }) 
      }
      iterate(doc);
      doc.questions = questions;
  
      if (doc.date)
        doc.date = new Date(doc.date);
      return doc
    }
    
    const reqBody = EJSON.parse(body.text());
    
    if (!reqBody.projectId) {
        console.log("No project Id is given in the object");
        response.setStatusCode(404)
        response.setBody(`No project Id is given in the object`);
    } else {
        //qualtrics sends scores as strings
        processQuestionsData(reqBody);
        
        var dbCollection = context.services.get("mongodb-atlas").db("shf").collection("psproject");
        dbCollection.updateOne({"name":reqBody.projectId},{"$push":{"survey_responses":reqBody}});
        dbCollection.findOne({"name":reqBody.projectId}).then((doc) => notifyPM(doc, reqBody))
        
        console.log("Survey object created")
        response.setStatusCode(200)
        response.setBody(`Successfully created survey object`);
    }

    // The return value of the function is sent as the response back to the client
    // when the "Respond with Result" setting is set.
    return  "Hello World!";
};
