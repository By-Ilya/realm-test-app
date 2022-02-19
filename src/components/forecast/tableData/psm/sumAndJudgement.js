import { makeSingleRowData, makeJudgementData } from 'components/forecast/tableData/makeCustomRowData';

export default function generateSumAndJudgementRows(sumData, judgementData) {
    const singleRowDataArgs = { levelName: undefined, changeFilterArgs: undefined };

    const sumRow = {
        name: makeSingleRowData({ value: 'Sum', ...singleRowDataArgs }),
        quarterly_call: makeSingleRowData({ value: sumData.quarterly_call ?? 0, ...singleRowDataArgs }),
        delivered_call: makeSingleRowData({ value: sumData.delivered_call ?? 0, ...singleRowDataArgs }),
        delivered_from_expiring: makeSingleRowData({ value: sumData.delivered_from_expiring ?? 0, ...singleRowDataArgs }),
        delivered_consulting: makeSingleRowData({ value: sumData.delivered_consulting ?? 0, ...singleRowDataArgs }),
        delivered_training: makeSingleRowData({ value: sumData.delivered_training ?? 0, ...singleRowDataArgs }),
        expiring_call: makeSingleRowData({ value: sumData.expiring_call ?? 0, ...singleRowDataArgs }),
        qtd_delivered: makeSingleRowData({ value: sumData.qtd_delivered ?? 0, ...singleRowDataArgs }),
        qtd_expired: makeSingleRowData({ value: sumData.qtd_expired ?? 0, ...singleRowDataArgs }),
        total_qtd_revenue: makeSingleRowData({ value: sumData.total_qtd_revenue ?? 0, ...singleRowDataArgs }),
        roq_risk: makeSingleRowData({ value: sumData.roq_risk ?? 0, ...singleRowDataArgs }),
        roq_upside: makeSingleRowData({ value: sumData.roq_upside ?? 0, ...singleRowDataArgs }),
        month0Likely: makeSingleRowData({ value: sumData.month_0?.most_likely ?? 0, ...singleRowDataArgs }),
        month0Best: makeSingleRowData({ value: sumData.month_0?.best_case ?? 0, ...singleRowDataArgs }),
        month1Likely: makeSingleRowData({ value: sumData.month_1?.most_likely ?? 0, ...singleRowDataArgs }),
        month1Best: makeSingleRowData({ value: sumData.month_1?.best_case ?? 0, ...singleRowDataArgs }),
        month2Likely: makeSingleRowData({ value: sumData.month_2?.most_likely ?? 0, ...singleRowDataArgs }),
        month2Best: makeSingleRowData({ value: sumData.month_2?.best_case ?? 0, ...singleRowDataArgs }),
    };

    const judgementRow = {
        name: makeSingleRowData({ value: 'Judgement', ...singleRowDataArgs }),
        quarterly_call: makeJudgementData({
            value: judgementData.quarterly_call ?? sumRow.quarterly_call.data.value,
            thresholdValue: sumRow.quarterly_call.data.value,
        }),
        delivered_call: makeJudgementData({
            value: judgementData.delivered_call ?? sumRow.delivered_call.data.value,
            thresholdValue: sumRow.delivered_call.data.value,
        }),
        delivered_from_expiring: makeJudgementData({
            value: judgementData.delivered_from_expiring ?? sumRow.delivered_from_expiring.data.value,
            thresholdValue: sumRow.delivered_from_expiring.data.value,
        }),
        delivered_consulting: makeJudgementData({
            value: judgementData.delivered_consulting ?? sumRow.delivered_consulting.data.value,
            thresholdValue: sumRow.delivered_consulting.data.value,
        }),
        delivered_training: makeJudgementData({
            value: judgementData.delivered_training ?? sumRow.delivered_training.data.value,
            thresholdValue: sumRow.delivered_training.data.value,
        }),
        expiring_call: makeJudgementData({
            value: judgementData.expiring_call ?? sumRow.expiring_call.data.value,
            thresholdValue: sumRow.expiring_call.data.value,
        }),
        qtd_delivered: makeJudgementData({
            value: judgementData.qtd_delivered ?? sumRow.qtd_delivered.data.value,
            thresholdValue: sumRow.qtd_delivered.data.value,
        }),
        qtd_expired: makeJudgementData({
            value: judgementData.qtd_expired ?? sumRow.qtd_expired.data.value,
            thresholdValue: sumRow.qtd_expired.data.value,
        }),
        total_qtd_revenue: makeJudgementData({
            value: judgementData.total_qtd_revenue ?? sumRow.total_qtd_revenue.data.value,
            thresholdValue: sumRow.total_qtd_revenue.data.value,
        }),
        roq_risk: makeJudgementData({
            value: judgementData.roq_risk ?? sumRow.roq_risk.data.value,
            thresholdValue: sumRow.roq_risk.data.value,
        }),
        roq_upside: makeJudgementData({
            value: judgementData.roq_upside ?? sumRow.roq_upside.data.value,
            thresholdValue: sumRow.roq_upside.data.value,
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
