import { mapValueToFilterName } from 'components/helpers/mapFilters';
import { valueAsUSD } from 'helpers/misc';

export default function generateOppInfoTableData(opp) {
    const {
        sales_forecast
    } = opp;

    const oppInfoTableColumns = [
        {
            title: 'Name',
            field: 'name',
        },
        {
            title: 'Value',
            field: 'value',
        },
    ];

    const oppInfoTableRows = [
        {
            name: 'AE forecast',
            value: mapValueToFilterName(sales_forecast.AE)
        },
        {
            name: 'RD forecast',
            value: mapValueToFilterName(sales_forecast.RD)
        },
        {
            name: 'RD forecast services',
            value: valueAsUSD(sales_forecast.amount_services_RD)
        },
    ];

    return { oppInfoTableColumns, oppInfoTableRows };
}
