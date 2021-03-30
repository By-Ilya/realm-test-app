import React from 'react';
import {
    projectHasCESurvey,
    projectHasCustSurvey,
} from 'helpers/project-util';

const TAB_INDENT = '   ';

function generateSFLink(id) {
    return `https://mongodb.my.salesforce.com/${id}`;
}

function projectNeedsSurveys(project) {
    const { contacts } = project;
    const custEmail = (contacts && contacts.customer)
        ? contacts.customer.email
        : null;
    const ceEmail = (contacts && contacts.ce)
        ? contacts.ce.email
        : null;

    if (!project.survey_sent) return true;

    return !projectHasCustSurvey(project, custEmail) || !projectHasCESurvey(project, ceEmail);
}

export default function generateMilestoneTableData(project, onClickPMStageButton) {
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
                if (rowData.name === 'PM Stage' && rowData.value === 'Closed' && !rowData.survey_sent) {
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
        },
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
            name: 'Account',
            value: account,
            link: generateSFLink(account_id),
            editable: false,
        },
        {
            name: 'Opportunity',
            value: opportunity.name,
            link: generateSFLink(opportunity._id),
            editable: false,
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
        { name: 'Gap Hours', value: currentMilestone.summary.gap_hours, editable: false },
        { name: 'Unscheduled Hours', value: currentMilestone.summary.unscheduled_hours, editable: false },
    ];

    return { milestonesTableColumns, milestonesTableRows };
}
