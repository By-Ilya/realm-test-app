import {toEnUsDate} from "../../../helpers/dateFormatter";

export function generateMilestoneTableData(project) {
    if (!project) return {
        milestonesTableColumns: [],
        milestonesTableRows: []
    };

    const {
        owner, region,
        project_manager,
        account, name,
        opportunity, details,
        currentMilestone
    } = project;

    const milestonesTableColumns = [
        {title: 'Project / Milestone Fields', field: 'name', editable: 'never'},
        {title: 'Value', field: 'value', editable: 'onUpdate'}
    ];
    const milestonesTableRows = [
        {name: 'Project Owner', value: owner, editable: false},
        {name: 'Region', value: region, editable: false},
        {name: 'Project Manager', value: project_manager, editable: false},
        {
            name: 'PM Stage',
            value: details.pm_stage,
            editable: true,
            tableKey: 'value',
            updateKey: 'details.pm_stage'
        },
        {name: 'Account', value: account, editable: false},
        {name: 'Opportunity', value: opportunity.name, editable: false},
        {name: 'PS Project Name', value: name, editable: false},
        {name: 'Milestone Name', value: currentMilestone.name, editable: false},
        {name: 'Country', value: currentMilestone.country, editable: false},
        {name: 'Milestone amount', value: currentMilestone.base.milestone_amount, editable: false},
        {name: 'Gap Hours', value: currentMilestone.base.gap_hours, editable: false}
    ]

    return {milestonesTableColumns, milestonesTableRows}
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
        {title: 'Hours', field: 'hours', editable: 'never'}
    ];
    const scheduleTableRows = currentMilestone.schedule.map(s => {
        return {
            date: toEnUsDate(s.week),
            scheduled: s.revenue ? `$ ${s.revenue}` : '-',
            hours: s.hours ? s.hours : '-',
            editable: false
        };
    });

    return {scheduleTableColumns, scheduleTableRows}
}