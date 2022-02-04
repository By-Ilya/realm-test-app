import { makeSingleRowData } from 'components/forecast/tableData/makeCustomRowData';

export default function generateDetailRows(forecastDetails) {
    const singleRowDataArgs = { levelName: undefined, changeFilterArgs: undefined };
    return forecastDetails.map((row) => ({
        name: makeSingleRowData({ value: row.name, ...singleRowDataArgs }),
        opportunityName: makeSingleRowData({ value: row.opportunity_name, ...singleRowDataArgs }),
        quarterlyCall: makeSingleRowData({ value: row.quarterly_call, ...singleRowDataArgs }),
        deliveredCall: makeSingleRowData({ value: row.delivered_call, ...singleRowDataArgs }),
        deliveredFromExpiring: makeSingleRowData({ value: row.delivered_from_expiring, ...singleRowDataArgs }),
        deliveredConsulting: makeSingleRowData({ value: row.delivered_consulting, ...singleRowDataArgs }),
        deliveredTraining: makeSingleRowData({ value: row.delivered_training, ...singleRowDataArgs }),
        expiringCall: makeSingleRowData({ value: row.expiring_call, ...singleRowDataArgs }),
        qtdDelivered: makeSingleRowData({ value: row.qtd_delivered, ...singleRowDataArgs }),
        qtdExpired: makeSingleRowData({ value: row.qtd_expired, ...singleRowDataArgs }),
        totalQtdRevenue: makeSingleRowData({ value: row.total_qtd_revenue, ...singleRowDataArgs }),
        roqRisk: makeSingleRowData({ value: row.roq_risk, ...singleRowDataArgs }),
        roqUpside: makeSingleRowData({ value: row.roq_upside, ...singleRowDataArgs }),
        month0Likely: makeSingleRowData({ value: row.month_0?.most_likely ?? 0, ...singleRowDataArgs }),
        month0Best: makeSingleRowData({ value: row.month_0?.best_case ?? 0, ...singleRowDataArgs }),
        month1Likely: makeSingleRowData({ value: row.month_1?.most_likely ?? 0, ...singleRowDataArgs }),
        month1Best: makeSingleRowData({ value: row.month_1?.best_case ?? 0, ...singleRowDataArgs }),
        month2Likely: makeSingleRowData({ value: row.month_2?.most_likely ?? 0, ...singleRowDataArgs }),
        month2Best: makeSingleRowData({ value: row.month_2?.best_case ?? 0, ...singleRowDataArgs }),
    }));
}
