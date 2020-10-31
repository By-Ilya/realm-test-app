import {toEnUsDate,toDateOnly} from "../../../helpers/dateFormatter";
import {convertForecastIntoRows} from "../../../helpers/forecast-util";

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
        {name: 'Milestone amount', value: currentMilestone.details.milestone_amount, editable: false},
        {name: 'Gap Hours', value: currentMilestone.summary.gap_hours, editable: false}
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
            date: toDateOnly(s.week),
            scheduled: s.revenue ? `$ ${s.revenue.toFixed(0)}` : '-',
            hours: s.hours ? s.hours : '-',
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

    const {currentMilestone, forecast} = project;

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