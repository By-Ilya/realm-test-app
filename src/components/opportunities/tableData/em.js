import { mapValueToFilterName } from 'components/helpers/mapFilters';
import { toDateOnly } from 'helpers/dateFormatter';

const HEADER_STYLE = {
    headerStyle: { fontWeight: 'bold' },
    cellStyle: { width: 162, minWidth: 163 },
};

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
            ...HEADER_STYLE,
        },
        {
            title: 'Value',
            field: 'value',
            ...HEADER_STYLE,
        },
    ];

    const emTableRows = [
        {
            name: 'Engagement manager',
            value: engagement_manager,
        },
        {
            name: 'PS Status',
            value: ps_status,
        },
        {
            name: 'ESD Created',
            value: mapValueToFilterName(esd_created),
        },
        {
            name: 'EM Call',
            value: call,
        },
        {
            name: 'Call amount',
            value: call_amount,
        },
    ];

    return { emTableColumns, emTableRows };
}
