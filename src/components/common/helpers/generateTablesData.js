import React from 'react';

import { toDateOnly } from 'helpers/dateFormatter';
import { convertForecastIntoRows } from 'helpers/forecast-util';
import { projectHasCESurvey, projectHasCustSurvey } from 'helpers/project-util';

const TAB_INDENT = '   ';

function generateSFLink(id) {
    return `https://mongodb.my.salesforce.com/${id}`;
}

function projectNeedsSurveys(project) {
    const { contacts } = project;
    const custEmail = (contacts && contacts.customer) ? contacts.customer.email : null;
    const ceEmail = (contacts && contacts.ce) ? contacts.ce.email : null;

    if (!project.survey_sent) return true;

    return (!projectHasCustSurvey(project, custEmail) || !projectHasCESurvey(project, ceEmail));
}

function getUnscheduledHoursString(ms_summary) {
    return (ms_summary.billable_hours_scheduled_undelivered != null && ms_summary.billable_hours_in_financials != null)
        ? `${ms_summary.planned_hours - ms_summary.billable_hours_in_financials - ms_summary.billable_hours_scheduled_undelivered} (${ms_summary.unscheduled_hours} in FF)`
        : ms_summary.unscheduled_hours
}

function getGapHoursString(ms_summary) {
    return (ms_summary.billable_hours_in_financials != null)
        ? `${ms_summary.planned_hours - ms_summary.billable_hours_in_financials} (${ms_summary.gap_hours} in FF)`
        : ms_summary.gap_hours
}

export function generateMilestoneTableData(project, onClickPMStageButton) {
    if (!project) {
        return {
            milestonesTableColumns: [],
            milestonesTableRows: [],
        };
    }

    const {
        _id,
        owner, region,
        project_manager,
        account,
        name, custom_name,
        account_id,
        opportunity, details,
        currentMilestone,
    } = project;

    const milestonesTableColumns = [
        { title: 'Project / Milestone Fields', field: 'name', editable: 'never' },
        {
            title: 'Value',
            field: 'value',
            editable: 'onUpdate',
            render: (rowData) => {
                if (rowData.name === 'PM Stage' && !(rowData.value === "Not Started" || rowData.value === "Planning")
                 && !rowData.survey_sent) {
                    return [
                        rowData.value,
                        TAB_INDENT,
                        <button onClick={() => onClickPMStageButton(project)}>Send surveys</button>,
                    ];
                }

                return rowData.link ? (
                    <a
                        href={rowData.link}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        {rowData.value}
                    </a>
                ) : rowData.value;
            },
        }
    ];

    const milestonesTableRows = [
        { name: 'Project Owner', value: owner, editable: false },
        { name: 'Region', value: region, editable: false },
        { name: 'Project Manager', value: project_manager, editable: false },
        {
            name: 'PM Stage',
            value: details.pm_stage,
            editable: true,
            survey_sent: !projectNeedsSurveys(project),
            tableKey: 'value',
            updateKey: 'details.pm_stage',
        },
        {
            name: 'Account', value: account, link: generateSFLink(account_id), editable: false,
        },
        {
            name: 'Opportunity', value: opportunity.name, link: generateSFLink(opportunity._id), editable: false,
        },
        {
            name: 'PS Project Name',
            value: custom_name || name,
            link: generateSFLink(_id),
            editable: true,
            tableKey: 'value',
            updateKey: 'custom_name',
        },
        {
            name: 'Milestone Name',
            value: currentMilestone.custom_name ? currentMilestone.custom_name : currentMilestone.name,
            link: generateSFLink(currentMilestone._id),
            editable: true,
            tableKey: 'value',
            updateKey: 'milestones.$.custom_name',
        },
        { name: 'Country', value: currentMilestone.country, editable: false },
        { name: 'Milestone amount', value: currentMilestone.details.milestone_amount, editable: false },
        { name: 'Bill rate', value: currentMilestone.details.bill_rate, editable: false },
        { name: 'Planned Hours', value: currentMilestone.summary.planned_hours, editable: false },
        { name: 'Gap Hours', value: getGapHoursString(currentMilestone.summary), editable: false },
        { name: 'Unscheduled Hours', value: getUnscheduledHoursString(currentMilestone.summary), editable: false },
        { name: 'Non-billable hours submitted', value: currentMilestone.summary.non_billable_hours_submitted, editable: false },
    ];

    return { milestonesTableColumns, milestonesTableRows };
}

export function generateDocumentsTableData(project) {
    if (!project) {
        return {
            documentsTableColumns: [],
            documentsTableRows: [],
        };
    }

    const { documents } = project;

    const documentsTableColumns = [
        { title: 'Name', field: 'name', editable: 'always' },
        {
            title: 'Link',
            field: 'url',
            editable: 'always',
            render: (rowData) => (rowData.url ? (
                <a
                    href={rowData.url}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {rowData.url_name ? rowData.url_name : rowData.url}
                </a>
            ) : rowData.url),
        },
    ];

    const documentsTableRows = [];

    if (documents && documents.length > 0) {
        for (const i in documents) {
            documentsTableRows.push({ ...documents[i], editable: true });
        }
    } else {
        documentsTableRows.push({
            name: 'Report',
            editable: true,
        });
    }

    return { documentsTableColumns, documentsTableRows };
}

export function generateSurveyTableData(project) {
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

export function generateContactsTableData(project) {
    if (!project) {
        return {
            contactsTableColumns: [],
            contactsTableRows: [],
        };
    }

    const { contacts } = project;

    const contactsTableColumns = [
        { title: 'Type', field: 'type', editable: 'never' },
        { title: 'Name', field: 'name', editable: 'onUpdate' },
        { title: 'Email', field: 'email', editable: 'onUpdate' },
    ];
    const contactsTableRows = [
        {
            type: 'Customer',
            name: (contacts && contacts.customer) ? contacts.customer.name : '',
            email: (contacts && contacts.customer) ? contacts.customer.email : '',
            editable: true,
            updateKey: 'contacts.customer',
        },
        {
            type: 'Consulting Engineer',
            name: (contacts && contacts.ce) ? contacts.ce.name : '',
            email: (contacts && contacts.ce) ? contacts.ce.email : '',
            editable: true,
            updateKey: 'contacts.ce',
        },
    ];

    return { contactsTableColumns, contactsTableRows };
}

export function generateScheduleTableData(project) {
    if (!project) {
        return {
            scheduleTableColumns: [],
            scheduleTableRows: [],
        };
    }

    const { currentMilestone } = project;

    const scheduleTableColumns = [
        { title: 'Date', field: 'date', editable: 'never' },
        { title: 'Scheduled', field: 'scheduled', editable: 'never' },
        {
            title: 'Hours',
            field: 'hours',
            editable: 'never',
            render: (rowData) => ((rowData.hours_nonbillable == 0)
                ? rowData.hours
                : `${rowData.hours} (${rowData.hours_nonbillable} NB)`),
        },
        { title: 'Resource(s)', field: 'resources', editable: 'never' },
    ];
    const scheduleTableRows = currentMilestone.schedule.map((s) => ({
        date: toDateOnly(s.week),
        scheduled: s.revenue ? `$ ${s.revenue.toFixed(0)}` : '-',
        hours: s.hours ? s.hours : '-',
        resources: s.resources.join(','),
        hours_nonbillable: s.hours_nonbillable ? s.hours_nonbillable : 0,
        editable: false,
    }));

    return { scheduleTableColumns, scheduleTableRows };
}

export function generateForecastTableData(project) {
    if (!project) {
        return {
            forecastTableColumns: [],
            forecastTableRows: [],
        };
    }

    const { forecast } = project;

    const forecastTableColumns = [
        { title: 'N3M', field: 'name' },
        { title: 'Month + 0', field: '0' },
        { title: 'Month + 1', field: '1' },
        { title: 'Month + 2', field: '2' },
        { title: 'Current Quarter', field: 'cq_field' },
        { title: 'Quarter Call', field: 'cq_call' },
    ];

    const forecastTableRows = convertForecastIntoRows(forecast);

    // const scheduleTableRows = currentMilestone.schedule.map(s => {
    //     return {
    //         date: toDateOnly(s.week),
    //         scheduled: s.revenue ? `$ ${s.revenue.toFixed(0)}` : '-',
    //         hours: s.hours ? s.hours : '-',
    //         editable: false
    //     };
    // });

    return { forecastTableColumns, forecastTableRows };
}
