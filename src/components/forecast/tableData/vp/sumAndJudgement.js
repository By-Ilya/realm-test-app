import { makeSingleRowData } from 'components/forecast/tableData/makeCustomRowData';
import { makeMultiRow } from 'components/forecast/tableData/vp/helpers';
import { calculateJudgementFromSum } from 'components/forecast/tableData/judgementCalculation';

export default function generateSumAndJudgementRows(sumData, judgementData) {
    const sumRow = {
        name: makeSingleRowData({ value: 'Sum', numberValue: undefined, changeFilterArgs: undefined }),
        quarterlyCall: makeMultiRow({ row: sumData, complexFieldName: 'quarterly_call' }),
        deliveredCall: makeMultiRow({ row: sumData, complexFieldName: 'delivered_call' }),
        deliveredFromExpiring: makeMultiRow({ row: sumData, complexFieldName: 'delivered_from_expiring' }),
        deliveredConsulting: makeMultiRow({ row: sumData, complexFieldName: 'delivered_consulting' }),
        deliveredTraining: makeMultiRow({ row: sumData, complexFieldName: 'delivered_training' }),
        expiringCall: makeMultiRow({ row: sumData, complexFieldName: 'expiring_call' }),
        qtdDelivered: makeMultiRow({ row: sumData, complexFieldName: 'qtd_delivered' }),
        qtdExpired: makeMultiRow({ row: sumData, complexFieldName: 'qtd_expired' }),
        totalQtdRevenue: makeMultiRow({ row: sumData, complexFieldName: 'total_qtd_revenue' }),
        roqRisk: makeMultiRow({ row: sumData, complexFieldName: 'roq_risk' }),
        roqUpside: makeMultiRow({ row: sumData, complexFieldName: 'roq_upside' }),
        month0Likely: makeMultiRow({ row: sumData, complexFieldName: 'month_0.most_likely' }),
        month0Best: makeMultiRow({ row: sumData, complexFieldName: 'month_0.best_case' }),
        month1Likely: makeMultiRow({ row: sumData, complexFieldName: 'month_1.most_likely' }),
        month1Best: makeMultiRow({ row: sumData, complexFieldName: 'month_0.best_case' }),
        month2Likely: makeMultiRow({ row: sumData, complexFieldName: 'month_2.most_likely' }),
        month2Best: makeMultiRow({ row: sumData, complexFieldName: 'month_2.best_case' }),
    };

    const levelWithThreshold = 'DIR';
    const judgementRow = {
        name: makeSingleRowData({ value: 'Judgement', numberValue: undefined, changeFilterArgs: undefined }),
        quarterlyCall: calculateJudgementFromSum({
            judgementValue: judgementData.quarterlyCall ?? 0,
            sumRow: sumRow.quarterlyCall,
            levelWithThreshold,
        }),
        deliveredCall: calculateJudgementFromSum({
            judgementValue: judgementData.deliveredCall ?? 0,
            sumRow: sumRow.deliveredCall,
            levelWithThreshold,
        }),
        deliveredFromExpiring: calculateJudgementFromSum({
            judgementValue: judgementData.deliveredFromExpiring ?? 0,
            sumRow: sumRow.deliveredFromExpiring,
            levelWithThreshold,
        }),
        deliveredConsulting: calculateJudgementFromSum({
            judgementValue: judgementData.deliveredConsulting ?? 0,
            sumRow: sumRow.deliveredConsulting,
            levelWithThreshold,
        }),
        deliveredTraining: calculateJudgementFromSum({
            judgementValue: judgementData.deliveredTraining ?? 0,
            sumRow: sumRow.deliveredTraining,
            levelWithThreshold,
        }),
        expiringCall: calculateJudgementFromSum({
            judgementValue: judgementData.expiringCall ?? 0,
            sumRow: sumRow.expiringCall,
            levelWithThreshold,
        }),
        qtdDelivered: calculateJudgementFromSum({
            judgementValue: judgementData.qtdDelivered ?? 0,
            sumRow: sumRow.qtdDelivered,
            levelWithThreshold,
        }),
        qtdExpired: calculateJudgementFromSum({
            judgementValue: judgementData.qtdExpired ?? 0,
            sumRow: sumRow.qtdExpired,
            levelWithThreshold,
        }),
        totalQtdRevenue: calculateJudgementFromSum({
            judgementValue: judgementData.totalQtdRevenue ?? 0,
            sumRow: sumRow.totalQtdRevenue,
            levelWithThreshold,
        }),
        roqRisk: calculateJudgementFromSum({
            judgementValue: judgementData.roqRisk ?? 0,
            sumRow: sumRow.roqRisk,
            levelWithThreshold,
        }),
        roqUpside: calculateJudgementFromSum({
            judgementValue: judgementData.roqUpside ?? 0,
            sumRow: sumRow.roqUpside,
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
