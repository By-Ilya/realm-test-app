import {toEnUsDate,toDateOnly} from "../../../helpers/dateFormatter";

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

function convertForecastIntoRows(forecast) {
    // In
    // {
    //     delivered_qtd : 15000,
    //     expired_qtd : 500,
    //     scheduled : {
    //         "0": 600,
    //         "1": 1500,
    //         "2":400
    //     },
    //     expiring : {
    //         "0": 0,
    //         "1": 0,
    //         "2": 0
    //     },
    //     most_likely : {
    //         "0": 600,
    //         "1": 1500,
    //         "2":400
    //     },
    //     risk : {
    //         "0": 600,
    //         "1":1500,
    //         "2":400
    //     },
    //     upside : {
    //         "0": 600,
    //         "1":1500,
    //         "2":400
    //     }
    // };
    // Out
    // [
    //     {name: "Delivered", "0": 15000, cq_field:"Delivered QTD", cq_call: 15000},
    //     {name: "Expired", "0": 500, cq_field:"Expired QTD", cq_call: 500},
    //     {name: "Scheduled", "0": 600, "1": 1500, "2": 400, cq_field:"Delivered Call", cq_call: 18000},
    // ];
    var delivered_call = forecast.most_likely["0"] + forecast.most_likely["1"] + forecast.most_likely["2"] + forecast.delivered_qtd,
    expiring_call = forecast.expiring["0"] + forecast.expiring["1"] + forecast.expiring["2"] + forecast.expired_qtd,
    all_in = delivered_call + expiring_call,
    roq_risk = forecast.risk["0"] + forecast.risk["1"] + forecast.risk["2"],
    roq_upside = forecast.upside["0"] + forecast.upside["1"] + forecast.upside["2"];


    var row = [];
    row.push(
        {name: "Delivered", "0": forecast.delivered_qtd, cq_field:"Delivered QTD", cq_call: forecast.delivered_qtd}
        );
    row.push(
        {name: "Expired", "0": forecast.expired_qtd, cq_field:"Expired QTD", cq_call: forecast.expired_qtd}
        );
    row.push(
        {name: "Scheduled", "0": forecast.scheduled["0"], "1" : forecast.scheduled["1"], "2" : forecast.scheduled["2"], cq_field:"Delivered Call", cq_call: delivered_call}
        );
    row.push(
        {name: "Expiring", "0": forecast.expiring["0"], "1" : forecast.expiring["1"], "2" : forecast.expiring["2"], cq_field:"Expired Call", cq_call: expiring_call},
        );
    row.push(
        {name: "Most Likely $", "0": forecast.most_likely["0"], "1" : forecast.most_likely["1"], "2" : forecast.most_likely["2"], cq_field:"All-in Call", cq_call: all_in},
        );
    row.push(
        {name: "Risk $", "0": forecast.risk["0"], "1" : forecast.risk["1"], "2" : forecast.risk["2"], cq_field:"ROQ Risk", cq_call: roq_risk},
        );
    row.push(
        {name: "Upside $", "0": forecast.upside["0"], "1" : forecast.upside["1"], "2" : forecast.upside["2"], cq_field:"ROQ Upside", cq_call: roq_upside},
        );

    return row;
}