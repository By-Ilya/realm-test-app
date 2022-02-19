import { makeSingleRowData } from 'components/forecast/tableData/makeCustomRowData';
import { makeMultiRow } from 'components/forecast/tableData/vp/helpers';
import { calculateJudgementFromSum } from 'components/forecast/tableData/judgementCalculation';

export default function generateSumAndJudgementRows(sumData, judgementData) {
    const sumRow = {
        name: makeSingleRowData({ value: 'Sum', numberValue: undefined, changeFilterArgs: undefined }),
        quarterly_call: makeMultiRow({ row: sumData, complexFieldName: 'quarterly_call' }),
        delivered_call: makeMultiRow({ row: sumData, complexFieldName: 'delivered_call' }),
        delivered_from_expiring: makeMultiRow({ row: sumData, complexFieldName: 'delivered_from_expiring' }),
        delivered_consulting: makeMultiRow({ row: sumData, complexFieldName: 'delivered_consulting' }),
        delivered_training: makeMultiRow({ row: sumData, complexFieldName: 'delivered_training' }),
        expiring_call: makeMultiRow({ row: sumData, complexFieldName: 'expiring_call' }),
        qtd_delivered: makeMultiRow({ row: sumData, complexFieldName: 'qtd_delivered' }),
        qtd_expired: makeMultiRow({ row: sumData, complexFieldName: 'qtd_expired' }),
        total_qtd_revenue: makeMultiRow({ row: sumData, complexFieldName: 'total_qtd_revenue' }),
        roq_risk: makeMultiRow({ row: sumData, complexFieldName: 'roq_risk' }),
        roq_upside: makeMultiRow({ row: sumData, complexFieldName: 'roq_upside' }),
        month0Likely: makeMultiRow({ row: sumData, complexFieldName: 'month_0.most_likely' }),
        month0Best: makeMultiRow({ row: sumData, complexFieldName: 'month_0.best_case' }),
        month1Likely: makeMultiRow({ row: sumData, complexFieldName: 'month_1.most_likely' }),
        month1Best: makeMultiRow({ row: sumData, complexFieldName: 'month_1.best_case' }),
        month2Likely: makeMultiRow({ row: sumData, complexFieldName: 'month_2.most_likely' }),
        month2Best: makeMultiRow({ row: sumData, complexFieldName: 'month_2.best_case' }),
    };

    const levelWithThreshold = 'DIR';
    const judgementRow = {
        name: makeSingleRowData({ value: 'Judgement', numberValue: undefined, changeFilterArgs: undefined }),
        quarterly_call: calculateJudgementFromSum({
            judgementValue: judgementData.quarterly_call ?? 0,
            sumRow: sumRow.quarterly_call,
            levelWithThreshold,
        }),
        delivered_call: calculateJudgementFromSum({
            judgementValue: judgementData.delivered_call ?? 0,
            sumRow: sumRow.delivered_call,
            levelWithThreshold,
        }),
        delivered_from_expiring: calculateJudgementFromSum({
            judgementValue: judgementData.delivered_from_expiring ?? 0,
            sumRow: sumRow.delivered_from_expiring,
            levelWithThreshold,
        }),
        delivered_consulting: calculateJudgementFromSum({
            judgementValue: judgementData.delivered_consulting ?? 0,
            sumRow: sumRow.delivered_consulting,
            levelWithThreshold,
        }),
        delivered_training: calculateJudgementFromSum({
            judgementValue: judgementData.delivered_training ?? 0,
            sumRow: sumRow.delivered_training,
            levelWithThreshold,
        }),
        expiring_call: calculateJudgementFromSum({
            judgementValue: judgementData.expiring_call ?? 0,
            sumRow: sumRow.expiring_call,
            levelWithThreshold,
        }),
        qtd_delivered: calculateJudgementFromSum({
            judgementValue: judgementData.qtd_delivered ?? 0,
            sumRow: sumRow.qtd_delivered,
            levelWithThreshold,
        }),
        qtd_expired: calculateJudgementFromSum({
            judgementValue: judgementData.qtd_expired ?? 0,
            sumRow: sumRow.qtd_expired,
            levelWithThreshold,
        }),
        total_qtd_revenue: calculateJudgementFromSum({
            judgementValue: judgementData.total_qtd_revenue ?? 0,
            sumRow: sumRow.total_qtd_revenue,
            levelWithThreshold,
        }),
        roq_risk: calculateJudgementFromSum({
            judgementValue: judgementData.roq_risk ?? 0,
            sumRow: sumRow.roq_risk,
            levelWithThreshold,
        }),
        roq_upside: calculateJudgementFromSum({
            judgementValue: judgementData.roq_upside ?? 0,
            sumRow: sumRow.roq_upside,
            levelWithThreshold,
        }),
        month0Likely: calculateJudgementFromSum({
            judgementValue: judgementData.month_0?.most_likely ?? 0,
            sumRow: sumRow.month0Likely,
            levelWithThreshold,
        }),
        month0Best: calculateJudgementFromSum({
            judgementValue: judgementData.month_0?.best_case ?? 0,
            sumRow: sumRow.month0Best,
            levelWithThreshold,
        }),
        month1Likely: calculateJudgementFromSum({
            judgementValue: judgementData.month_1?.most_likely ?? 0,
            sumRow: sumRow.month1Likely,
            levelWithThreshold,
        }),
        month1Best: calculateJudgementFromSum({
            judgementValue: judgementData.month_1?.best_case ?? 0,
            sumRow: sumRow.month1Best,
            levelWithThreshold,
        }),
        month2Likely: calculateJudgementFromSum({
            judgementValue: judgementData.month_2?.most_likely ?? 0,
            sumRow: sumRow.month2Likely,
            levelWithThreshold,
        }),
        month2Best: calculateJudgementFromSum({
            judgementValue: judgementData.month_2?.best_case ?? 0,
            sumRow: sumRow.month2Best,
            levelWithThreshold,
        }),
    };

    return [sumRow, judgementRow];
}
