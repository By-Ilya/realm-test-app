import { mapValueToFilterName } from 'components/helpers/mapFilters';

export default function generateEmTableData(em) {
    const {
        engagement_manager,
        ps_status,
        esd_created,
        call,
        call_amount,
    } = em;

    const emTableColumns = [
        {
            title: 'Name',
            field: 'name',
        },
        {
            title: 'Value',
            field: 'value',
        },
    ];

    const emTableRows = [
        {
            name: 'Engagement manager',
            value: engagement_manager,
            editable: true,
            tableKey: 'em',
            updateKey: 'engagement_manager',
        },
        { name: 'PS Status', value: ps_status },
        {
            name: 'ESD Created',
            value: mapValueToFilterName(esd_created),
            editable: true,
            tableKey: 'esd',
            updateKey: 'esd_created',
        },
        {
            name: 'EM Call',
            value: call,
            editable: true,
            tableKey: 'emCall',
            updateKey: 'call',
        },
        { name: 'Call amount', value: call_amount, editable: false },
    ];

    return { emTableColumns, emTableRows };
}
