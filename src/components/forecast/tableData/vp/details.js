import { makeSingleRowData } from 'components/forecast/tableData/makeCustomRowData';
import { makeMultiRow } from 'components/forecast/tableData/vp/helpers';

export default function generateDetailRows(forecastDetails) {
    return forecastDetails.map((row) => ({
        geo: makeSingleRowData({
            value: row.geo,
            levelName: undefined,
            changeFilterArgs: undefined,
        }),
        director: makeSingleRowData({
            value: row.dir_name,
            levelName: undefined,
            changeFilterArgs: { level: 'DIR', geo: row.geo },
        }),
        quarterlyCall: makeMultiRow({ row, complexFieldName: 'quarterly_call' }),
        deliveredCall: makeMultiRow({ row, complexFieldName: 'delivered_call' }),
        deliveredFromExpiring: makeMultiRow({ row, complexFieldName: 'delivered_from_expiring' }),
        deliveredConsulting: makeMultiRow({ row, complexFieldName: 'delivered_consulting' }),
        deliveredTraining: makeMultiRow({ row, complexFieldName: 'delivered_training' }),
        expiringCall: makeMultiRow({ row, complexFieldName: 'expiring_call' }),
        qtdDelivered: makeMultiRow({ row, complexFieldName: 'qtd_delivered' }),
        qtdExpired: makeMultiRow({ row, complexFieldName: 'qtd_expired' }),
        totalQtdRevenue: makeMultiRow({ row, complexFieldName: 'total_qtd_revenue' }),
        roqRisk: makeMultiRow({ row, complexFieldName: 'roq_risk' }),
        roqUpside: makeMultiRow({ row, complexFieldName: 'roq_upside' }),
        month0Likely: makeMultiRow({ row, complexFieldName: 'month_0.most_likely' }),
        month0Best: makeMultiRow({ row, complexFieldName: 'month_0.best_case' }),
        month1Likely: makeMultiRow({ row, complexFieldName: 'month_1.most_likely' }),
        month1Best: makeMultiRow({ row, complexFieldName: 'month_0.best_case' }),
        month2Likely: makeMultiRow({ row, complexFieldName: 'month_2.most_likely' }),
        month2Best: makeMultiRow({ row, complexFieldName: 'month_2.best_case' }),
    }));
}
