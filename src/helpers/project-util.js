function projectHasSurvey(project, email, survey) {
    if (!project.survey_responses || !email) return false;

    for (let i = project.survey_responses.length - 1; i >= 0; i--) {
        const r = project.survey_responses[i];
        if ((r.survey === survey) && (r.email === email)) return true;
    }

    return false;
}

function projectHasCESurvey(project, email) {
    return projectHasSurvey(project, email, 'Mongo CE Satisfaction Survey');
}

function projectHasCustSurvey(project, email) {
    return projectHasSurvey(project, email, 'Mongo Satisfaction Survey');
}

function projectHasEngBrief(project) {
    if (!project.documents) return false;

    for (let i = project.documents.length - 1; i >= 0; i--) {
        const d = project.documents[i];
        if (d.name === "Engagement Brief") return true;
    }

    return false;
}

module.exports = {
    projectHasCESurvey,
    projectHasCustSurvey,
    projectHasEngBrief,
};
