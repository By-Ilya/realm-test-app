module.exports = {
  projectHasCESurvey,
  projectHasCustSurvey
};

function projectHasSurvey(project, email, survey) {
  if (!project.survey_responses || !email)
    return false;

  for (var i = project.survey_responses.length - 1; i >= 0; i--) {
    let r = project.survey_responses[i];
    if ((r.survey === survey) && (r.email === email))
      return true;

  }
    
  return false;
}

function projectHasCESurvey(project, email) {
  return projectHasSurvey(project, email, "Mongo CE Satisfaction Survey");
}

function projectHasCustSurvey(project, email) {
  return projectHasSurvey(project, email, "Mongo Satisfaction Survey");
}