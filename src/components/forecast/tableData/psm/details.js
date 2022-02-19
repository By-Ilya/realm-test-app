import { makeSingleRowData } from 'components/forecast/tableData/makeCustomRowData';

export default function generateDetailRows(forecastDetails) {
    const singleRowDataArgs = { levelName: undefined, changeFilterArgs: undefined };
    return forecastDetails.map((row) => ({
        name: makeSingleRowData({ value: row.name, ...singleRowDataArgs }),
        opportunityName: makeSingleRowData({ value: row.opportunity_name, ...singleRowDataArgs }),
        quarterly_call: makeSingleRowData({ value: row.quarterly_call, ...singleRowDataArgs }),
        delivered_call: makeSingleRowData({ value: row.delivered_call, ...singleRowDataArgs }),
        delivered_from_expiring: makeSingleRowData({ value: row.delivered_from_expiring, ...singleRowDataArgs }),
        delivered_consulting: makeSingleRowData({ value: row.delivered_consulting, ...singleRowDataArgs }),
        delivered_training: makeSingleRowData({ value: row.delivered_training, ...singleRowDataArgs }),
        expiring_call: makeSingleRowData({ value: row.expiring_call, ...singleRowDataArgs }),
        qtd_delivered: makeSingleRowData({ value: row.qtd_delivered, ...singleRowDataArgs }),
        qtd_expired: makeSingleRowData({ value: row.qtd_expired, ...singleRowDataArgs }),
        total_qtd_revenue: makeSingleRowData({ value: row.total_qtd_revenue, ...singleRowDataArgs }),
        roq_risk: makeSingleRowData({ value: row.roq_risk, ...singleRowDataArgs }),
        roq_upside: makeSingleRowData({ value: row.roq_upside, ...singleRowDataArgs }),
        month0Likely: makeSingleRowData({ value: row.month_0?.most_likely ?? 0, ...singleRowDataArgs }),
        month0Best: makeSingleRowData({ value: row.month_0?.best_case ?? 0, ...singleRowDataArgs }),
        month1Likely: makeSingleRowData({ value: row.month_1?.most_likely ?? 0, ...singleRowDataArgs }),
        month1Best: makeSingleRowData({ value: row.month_1?.best_case ?? 0, ...singleRowDataArgs }),
        month2Likely: makeSingleRowData({ value: row.month_2?.most_likely ?? 0, ...singleRowDataArgs }),
        month2Best: makeSingleRowData({ value: row.month_2?.best_case ?? 0, ...singleRowDataArgs }),
    }));
}
