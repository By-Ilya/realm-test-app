import {
    makeSingleRowData,
    makeMultiRowData,
} from 'components/forecast/tableData/makeCustomRowData';
import { makeMultiRow } from 'components/forecast/tableData/dir/helpers';

export default function generateDetailRows(forecastDetails) {
    return forecastDetails.map((row) => ({
        psm: makeSingleRowData({
            value: row.psm_name,
            levelName: undefined,
            changeFilterArgs: { level: 'PSM', psmName: row.psm_name },
        }),
        regions: (row.regions && row.regions.length)
            ? makeMultiRowData(row.regions.map((region) => ({
                value: region,
                levelName: undefined,
                changeFilterArgs: undefined,
            })))
            : makeSingleRowData({
                value: row.regions ?? '',
                levelName: undefined,
                changeFilterArgs: undefined,
            }),
        quarterly_call: makeMultiRow({ row, complexFieldName: 'quarterly_call' }),
        delivered_call: makeMultiRow({ row, complexFieldName: 'delivered_call' }),
        delivered_from_expiring: makeMultiRow({ row, complexFieldName: 'delivered_from_expiring' }),
        delivered_consulting: makeMultiRow({ row, complexFieldName: 'delivered_consulting' }),
        delivered_training: makeMultiRow({ row, complexFieldName: 'delivered_training' }),
        expiring_call: makeMultiRow({ row, complexFieldName: 'expiring_call' }),
        qtd_delivered: makeMultiRow({ row, complexFieldName: 'qtd_delivered' }),
        qtd_expired: makeMultiRow({ row, complexFieldName: 'qtd_expired' }),
        total_qtd_revenue: makeMultiRow({ row, complexFieldName: 'total_qtd_revenue' }),
        roq_risk: makeMultiRow({ row, complexFieldName: 'roq_risk' }),
        roq_upside: makeMultiRow({ row, complexFieldName: 'roq_upside' }),
        month0Likely: makeMultiRow({ row, complexFieldName: 'month_0.most_likely' }),
        month0Best: makeMultiRow({ row, complexFieldName: 'month_0.best_case' }),
        month1Likely: makeMultiRow({ row, complexFieldName: 'month_1.most_likely' }),
        month1Best: makeMultiRow({ row, complexFieldName: 'month_0.best_case' }),
        month2Likely: makeMultiRow({ row, complexFieldName: 'month_2.most_likely' }),
        month2Best: makeMultiRow({ row, complexFieldName: 'month_2.best_case' }),
    }));
}
