import { convertForecastIntoRows } from 'helpers/forecast-util';

export default function generateForecastTableData(project) {
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
