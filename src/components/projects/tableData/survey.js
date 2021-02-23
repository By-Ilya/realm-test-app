import React from 'react';

export default function generateSurveyTableData(project) {
    if (!project || !project.survey_responses) {
        return {
            surveyTableColumns: [],
            surveyTableRows: [],
        };
    }

    const surveyTableColumns = [
        { title: 'Name', field: 'name', editable: 'never' },
        {
            title: 'Questions',
            field: 'questions',
            editable: 'never',
            render: (rowData) => (
                <table>
                    { rowData.questions.map((q) => (
                        <tr>
                            <td>{q.text}</td>
                            <td>{q.score}</td>
                        </tr>
                    )) }
                </table>
            ),
        },
    ];
    const surveyTableRows = project.survey_responses.map((r) => ({
        name: r.survey,
        questions: r.questions,
        editable: false,
    }));
    // let qs = "";

    // r.questions.map(q => {
    //     if (qs !== "")
    //         qs += "\n";

    //     qs += q.text + "\n" + q.score;
    // });

    return { surveyTableColumns, surveyTableRows };
}
