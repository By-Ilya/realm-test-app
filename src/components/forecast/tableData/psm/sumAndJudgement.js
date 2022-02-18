import { makeSingleRowData, makeJudgementData } from 'components/forecast/tableData/makeCustomRowData';

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
        quarterlyCall: makeJudgementData({
            value: judgementData.quarterly_call ?? sumRow.quarterlyCall.data.value,
            thresholdValue: sumRow.quarterlyCall.data.value,
        }),
        deliveredCall: makeJudgementData({
            value: judgementData.delivered_call ?? sumRow.deliveredCall.data.value,
            thresholdValue: sumRow.deliveredCall.data.value,
        }),
        deliveredFromExpiring: makeJudgementData({
            value: judgementData.delivered_from_expiring ?? sumRow.deliveredFromExpiring.data.value,
            thresholdValue: sumRow.deliveredFromExpiring.data.value,
        }),
        deliveredConsulting: makeJudgementData({
            value: judgementData.delivered_consulting ?? sumRow.deliveredConsulting.data.value,
            thresholdValue: sumRow.deliveredConsulting.data.value,
        }),
        deliveredTraining: makeJudgementData({
            value: judgementData.delivered_training ?? sumRow.deliveredTraining.data.value,
            thresholdValue: sumRow.deliveredTraining.data.value,
        }),
        expiringCall: makeJudgementData({
            value: judgementData.expiring_call ?? sumRow.expiringCall.data.value,
            thresholdValue: sumRow.expiringCall.data.value,
        }),
        qtdDelivered: makeJudgementData({
            value: judgementData.qtd_delivered ?? sumRow.qtdDelivered.data.value,
            thresholdValue: sumRow.qtdDelivered.data.value,
        }),
        qtdExpired: makeJudgementData({
            value: judgementData.qtd_expired ?? sumRow.qtdExpired.data.value,
            thresholdValue: sumRow.qtdExpired.data.value,
        }),
        totalQtdRevenue: makeJudgementData({
            value: judgementData.total_qtd_revenue ?? sumRow.totalQtdRevenue.data.value,
            thresholdValue: sumRow.totalQtdRevenue.data.value,
        }),
        roqRisk: makeJudgementData({
            value: judgementData.roq_risk ?? sumRow.roqRisk.data.value,
            thresholdValue: sumRow.roqRisk.data.value,
        }),
        roqUpside: makeJudgementData({
            value: judgementData.roq_upside ?? sumRow.roqUpside.data.value,
            thresholdValue: sumRow.roqUpside.data.value,
        }),
        month0Likely: makeJudgementData({
            value: judgementData.month_0?.most_likely ?? sumRow.month0Likely.data.value,
            thresholdValue: sumRow.month0Likely.data.value,
        }),
        month0Best: makeJudgementData({
            value: judgementData.month_0?.best_case ?? sumRow.month0Best.data.value,
            thresholdValue: sumRow.month0Best.data.value,
        }),
        month1Likely: makeJudgementData({
            value: judgementData.month_1?.most_likely ?? sumRow.month1Likely.data.value,
            thresholdValue: sumRow.month1Likely.data.value,
        }),
        month1Best: makeJudgementData({
            value: judgementData.month_1?.best_case ?? sumRow.month1Best.data.value,
            thresholdValue: sumRow.month1Best.data.value,
        }),
        month2Likely: makeJudgementData({
            value: judgementData.month_2?.most_likely ?? sumRow.month2Likely.data.value,
            thresholdValue: sumRow.month2Likely.data.value,
        }),
        month2Best: makeJudgementData({
            value: judgementData.month_2?.best_case ?? sumRow.month2Best.data.value,
            thresholdValue: sumRow.month2Best.data.value,
        }),
    };

    return [sumRow, judgementRow];
}
