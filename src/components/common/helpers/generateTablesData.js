import {toDateOnly} from "../../../helpers/dateFormatter";
import {convertForecastIntoRows} from "../../../helpers/forecast-util";
import React, { Component } from 'react';

function generateSFLink(id) {
    return "https://mongodb.my.salesforce.com/" + id;
}

export function generateMilestoneTableData(project, onClickPMStageButton) {
    if (!project) return {
        milestonesTableColumns: [],
        milestonesTableRows: []
    };

    const {
        _id,
        owner, region,
        project_manager,
        account, 
        name, custom_name,
        account_id,
        opportunity, details,
        survey_sent,
        currentMilestone
    } = project;

    const milestonesTableColumns = [
        {title: 'Project / Milestone Fields', field: 'name', editable: 'never'},
        {title: 'Value', field: 'value', editable: 'onUpdate',
        render: rowData => {
                if (rowData.name === "PM Stage" && rowData.value === "Closed" && !rowData.survey_sent)
                    return [rowData.value,"   ",<button onClick={() => onClickPMStageButton(project)}>Send surveys</button>];

                if (rowData.link)
                    return <a href={rowData.link} target = "_blank" rel = "noopener noreferrer">{rowData.value}</a>;
                
                return rowData.value;
             }
        }
    ];
    const milestonesTableRows = [
        {name: 'Project Owner', value: owner, editable: false},
        {name: 'Region', value: region, editable: false},
        {name: 'Project Manager', value: project_manager, editable: false},
        {
            name: 'PM Stage',
            value: details.pm_stage,
            editable: true,
            survey_sent: survey_sent,
            tableKey: 'value',
            updateKey: 'details.pm_stage'
        },
        {name: 'Account', value: account, link: generateSFLink(account_id), editable: false},
        {name: 'Opportunity', value: opportunity.name, link: generateSFLink(opportunity._id), editable: false},
        {name: 'PS Project Name', 
            value: custom_name ? custom_name : name, 
            link: generateSFLink(_id), 
            editable: true,
            tableKey: 'value',
            updateKey: 'custom_name'
        },
        {name: 'Milestone Name', 
            value: currentMilestone.custom_name ? currentMilestone.custom_name : currentMilestone.name, 
            link: generateSFLink(currentMilestone._id), 
            editable: true,
            tableKey: 'value',
            updateKey: 'milestones.$.custom_name'
        },
        {name: 'Country', value: currentMilestone.country, editable: false},
        {name: 'Milestone amount', value: currentMilestone.details.milestone_amount, editable: false},
        {name: 'Bill rate', value: currentMilestone.details.bill_rate, editable: false},
        {name: 'Planned Hours', value: currentMilestone.summary.planned_hours, editable: false},
        {name: 'Gap Hours', value: currentMilestone.summary.gap_hours, editable: false},
        {name: 'Unscheduled Hours', value: currentMilestone.summary.unscheduled_hours, editable: false},
    ]

    return {milestonesTableColumns, milestonesTableRows}
}

export function generateDocumentsTableData(project) {
    if (!project) return {
        documentsTableColumns: [],
        documentsTableRows: []
    };

    const {
        documents
    } = project;

    const documentsTableColumns = [
        {title: 'Name', field: 'name', editable: 'always'},
        {title: 'Link', field: 'url', editable: 'always',
        render: rowData => {
                if (rowData.url)
                    return <a href={rowData.url} target = "_blank" rel = "noopener noreferrer">{rowData.url_name ? rowData.url_name : rowData.url}</a>;
                
                return rowData.url;
             }
        }
    ];

    const documentsTableRows = [];

    if (documents && documents.length > 0) {
        for(let i in documents) {
            documentsTableRows.push({...documents[i], editable: true})
        }
    } else
        documentsTableRows.push({
                    name:"Report",
                    editable:true
                });

    return {documentsTableColumns, documentsTableRows}
}

export function generateContactsTableData(project) {
    if (!project) return {
        contactsTableColumns: [],
        contactsTableRows: []
    };

    const {
        _id,
        contacts
    } = project;

    const contactsTableColumns = [
        {title: 'Type', field: 'type', editable: 'never'},
        {title: 'Name', field: 'name', editable: 'onUpdate'},
        {title: 'Email', field: 'email', editable: 'onUpdate'}
    ];
    const contactsTableRows = [
        {
            type: 'Customer',
            name: (contacts && contacts.customer) ? contacts.customer.name : "",
            email: (contacts && contacts.customer) ? contacts.customer.email : "",
            editable: true,
            updateKey: 'contacts.customer'
        },
        {
            type: 'Consulting Engineer',
            name: (contacts && contacts.ce) ? contacts.ce.name : "",
            email: (contacts && contacts.ce) ? contacts.ce.email : "",
            editable: true,
            updateKey: 'contacts.ce'
        },
    ]

    return {contactsTableColumns, contactsTableRows}
}

export function generateScheduleTableData(project) {
    if (!project) return {
        scheduleTableColumns: [],
        scheduleTableRows: []
    };

    const {currentMilestone} = project;

    const scheduleTableColumns = [
        {title: 'Date', field: 'date', editable: 'never'},
        {title: 'Scheduled', field: 'scheduled', editable: 'never'},
        {title: 'Hours', field: 'hours', editable: 'never',
            render: rowData => (rowData.hours_nonbillable == 0) 
                                ? rowData.hours 
                                : `${rowData.hours} (${rowData.hours_nonbillable} NB)`
        },
        {title: 'Resource(s)', field: 'resources', editable: 'never'}
    ];
    const scheduleTableRows = currentMilestone.schedule.map(s => {
        return {
            date: toDateOnly(s.week),
            scheduled: s.revenue ? `$ ${s.revenue.toFixed(0)}` : '-',
            hours: s.hours ? s.hours : '-',
            resources: s.resources.join(','),
            hours_nonbillable: s.hours_nonbillable ? s.hours_nonbillable : 0,
            editable: false
        };
    });

    return {scheduleTableColumns, scheduleTableRows}
}

export function generateForecastTableData(project) {
    if (!project) return {
        forecastTableColumns: [],
        forecastTableRows: []
    };

    const {forecast} = project;

    const forecastTableColumns = [
        {title: 'N3M', field: 'name'},
        {title: 'Month + 0', field: '0'},
        {title: 'Month + 1', field: '1'},
        {title: 'Month + 2', field: '2'},
        {title: 'Current Quarter', field: 'cq_field'},
        {title: 'Quarter Call', field: 'cq_call'},
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

    return {forecastTableColumns, forecastTableRows}
}