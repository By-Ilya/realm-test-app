import { toDateOnly } from 'helpers/dateFormatter';

export default function generateScheduleTableData(project) {
    if (!project) {
        return {
            scheduleTableColumns: [],
            scheduleTableRows: [],
        };
    }

    const { currentMilestone } = project;

    const scheduleTableColumns = [
        { title: 'Week', field: 'date', editable: 'never' },
        { title: 'Revenue', field: 'scheduled', editable: 'never' },
        {
            title: 'Hours',
            field: 'hours',
            editable: 'never',
            render: (rowData) => ((rowData.hours_nonbillable === 0)
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
