import { makeSingleRowData } from 'components/forecast/tableData/makeCustomRowData';

export default function generateSumAndJudgementRows(sumData, judgementData) {
    const singleRowDataArgs = { levelName: undefined, changeFilterArgs: undefined };

    const sumRow = {
        name: makeSingleRowData({ value: 'Sum', ...singleRowDataArgs }),
        quarterlyCall: makeSingleRowData({ value: sumData.quarterly_call ?? 0, ...singleRowDataArgs }),
        deliveredCall: makeSingleRowData({ value: sumData.delivered_call ?? 0, ...singleRowDataArgs }),
        deliveredFromExpiring: makeSingleRowData({ value: sumData.delivered_from_expiring ?? 0, ...singleRowDataArgs }),
        deliveredConsulting: makeSingleRowData({ value: sumData.delivered_consulting ?? 0, ...singleRowDataArgs }),
        deliveredTraining: makeSingleRowData({ value: sumData.delivered_training ?? 0, ...singleRowDataArgs }),
        expiringCall: makeSingleRowData({ value: sumData.expiring_call ?? 0, ...singleRowDataArgs }),
        qtdDelivered: makeSingleRowData({ value: sumData.qtd_delivered ?? 0, ...singleRowDataArgs }),
        qtdExpired: makeSingleRowData({ value: sumData.qtd_expired ?? 0, ...singleRowDataArgs }),
        totalQtdRevenue: makeSingleRowData({ value: sumData.total_qtd_revenue ?? 0, ...singleRowDataArgs }),
        roqRisk: makeSingleRowData({ value: sumData.roq_risk ?? 0, ...singleRowDataArgs }),
        roqUpside: makeSingleRowData({ value: sumData.roq_upside ?? 0, ...singleRowDataArgs }),
        month0Likely: makeSingleRowData({ value: sumData.month_0?.most_likely ?? 0, ...singleRowDataArgs }),
        month0Best: makeSingleRowData({ value: sumData.month_0?.best_case ?? 0, ...singleRowDataArgs }),
        month1Likely: makeSingleRowData({ value: sumData.month_1?.most_likely ?? 0, ...singleRowDataArgs }),
        month1Best: makeSingleRowData({ value: sumData.month_1?.best_case ?? 0, ...singleRowDataArgs }),
        month2Likely: makeSingleRowData({ value: sumData.month_2?.most_likely ?? 0, ...singleRowDataArgs }),
        month2Best: makeSingleRowData({ value: sumData.month_2?.best_case ?? 0, ...singleRowDataArgs }),
    };

    const judgementRow = {
        name: makeSingleRowData({ value: 'Judgement', ...singleRowDataArgs }),
        quarterlyCall: makeSingleRowData({ value: judgementData.quarterly_call ?? sumRow.quarterlyCall.data.value, ...singleRowDataArgs }),
        deliveredCall: makeSingleRowData({ value: judgementData.delivered_call ?? sumRow.deliveredCall.data.value, ...singleRowDataArgs }),
        deliveredFromExpiring: makeSingleRowData({ value: judgementData.delivered_from_expiring ?? sumRow.deliveredFromExpiring.data.value, ...singleRowDataArgs }),
        deliveredConsulting: makeSingleRowData({ value: judgementData.delivered_consulting ?? sumRow.deliveredConsulting.data.value, ...singleRowDataArgs }),
        deliveredTraining: makeSingleRowData({ value: judgementData.delivered_training ?? sumRow.deliveredTraining.data.value, ...singleRowDataArgs }),
        expiringCall: makeSingleRowData({ value: judgementData.expiring_call ?? sumRow.expiringCall.data.value, ...singleRowDataArgs }),
        qtdDelivered: makeSingleRowData({ value: judgementData.qtd_delivered ?? sumRow.qtdDelivered.data.value, ...singleRowDataArgs }),
        qtdExpired: makeSingleRowData({ value: judgementData.qtd_expired ?? sumRow.qtdExpired.data.value, ...singleRowDataArgs }),
        totalQtdRevenue: makeSingleRowData({ value: judgementData.total_qtd_revenue ?? sumRow.totalQtdRevenue.data.value, ...singleRowDataArgs }),
        roqRisk: makeSingleRowData({ value: judgementData.roq_risk ?? sumRow.roqRisk.data.value, ...singleRowDataArgs }),
        roqUpside: makeSingleRowData({ value: judgementData.roq_upside ?? sumRow.roqUpside.data.value, ...singleRowDataArgs }),
        month0Likely: makeSingleRowData({ value: judgementData.month_0?.most_likely ?? sumRow.month0Likely.data.value, ...singleRowDataArgs }),
        month0Best: makeSingleRowData({ value: judgementData.month_0?.best_case ?? sumRow.month0Best.data.value, ...singleRowDataArgs }),
        month1Likely: makeSingleRowData({ value: judgementData.month_1?.most_likely ?? sumRow.month1Likely.data.value, ...singleRowDataArgs }),
        month1Best: makeSingleRowData({ value: judgementData.month_1?.best_case ?? sumRow.month1Best.data.value, ...singleRowDataArgs }),
        month2Likely: makeSingleRowData({ value: judgementData.month_2?.most_likely ?? sumRow.month2Likely.data.value, ...singleRowDataArgs }),
        month2Best: makeSingleRowData({ value: judgementData.month_2?.best_case ?? sumRow.month2Best.data.value, ...singleRowDataArgs }),
    };

    return [sumRow, judgementRow];
}
