import React from 'react';
import {
    projectHasCESurvey,
    projectHasCustSurvey,
    projectHasEngBrief
} from 'helpers/project-util';

import {
    generateSFLink
} from 'helpers/misc';

const TAB_INDENT = '   ';

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

function getUnscheduledHoursString(ms_summary) {
    const {
        billable_hours_scheduled_undelivered,
        billable_hours_in_financials,
        planned_hours,
        unscheduled_hours,
    } = ms_summary;
    return (billable_hours_scheduled_undelivered != null && billable_hours_in_financials != null)
        ? `${planned_hours - billable_hours_in_financials - billable_hours_scheduled_undelivered} (${unscheduled_hours} in FF)`
        : unscheduled_hours;
}

function getGapHoursString(ms_summary) {
    const {
        billable_hours_in_financials,
        planned_hours,
        gap_hours,
    } = ms_summary;
    return (billable_hours_in_financials != null)
        ? `${planned_hours - billable_hours_in_financials} (${gap_hours} in FF)`
        : gap_hours;
}

export default function generateMilestoneTableData(project, onClickPMStageButton, onClickEngBriefButton) {
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
                if (rowData.name === 'PM Stage') {
                  if (!(rowData.value === 'Not Started' || rowData.value === 'Planning') &&
                    !rowData.survey_sent) {
                    return [
                        rowData.value,
                        TAB_INDENT,
                        <button onClick={() => onClickPMStageButton(project)}>Send surveys</button>,
                    ];
                  } else if (!rowData.eng_brief_generated)
                    return [
                        rowData.value,
                        TAB_INDENT,
                        <button onClick={() => onClickEngBriefButton(project)}>Engagement Brief</button>,
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
            eng_brief_generated: projectHasEngBrief(project),
            tableKey: 'value',
            updateKey: 'details.pm_stage',
        },
        { name: 'Status Notes', value: details.project_status_notes, editable: false},
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

    if (details.pm_stage === 'On Hold') {
        const on_hold_reason_row = {
            name: 'On Hold Reason',
            value: details.on_hold_reason,
            editable: true,
            tableKey: 'value',
            updateKey: 'details.on_hold_reason',
        };
        milestonesTableRows.splice(4, 0, on_hold_reason_row);
    }

    return { milestonesTableColumns, milestonesTableRows };
}
