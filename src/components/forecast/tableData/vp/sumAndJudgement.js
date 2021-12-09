import { makeMultiRow } from 'components/forecast/tableData/vp/helpers';
import { calculateJudgementFromSum } from 'components/forecast/tableData/judgementCalculation';

export default function generateSumAndJudgementRows(sumData, judgementData) {
    const sumRow = {
        name: 'Sum',
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

    const judgementRow = {
        name: 'Judgement',
        quarterlyCall: judgementData.quarterly_call ?? calculateJudgementFromSum(sumRow.quarterlyCall),
        deliveredCall: judgementData.delivered_call ?? calculateJudgementFromSum(sumRow.deliveredCall),
        deliveredFromExpiring: judgementData.delivered_from_expiring ?? calculateJudgementFromSum(sumRow.deliveredFromExpiring),
        deliveredConsulting: judgementData.delivered_consulting ?? calculateJudgementFromSum(sumRow.deliveredConsulting),
        deliveredTraining: judgementData.delivered_training ?? calculateJudgementFromSum(sumRow.deliveredTraining),
        expiringCall: judgementData.expiring_call ?? calculateJudgementFromSum(sumRow.expiringCall),
        qtdDelivered: judgementData.qtd_delivered ?? calculateJudgementFromSum(sumRow.qtdDelivered),
        qtdExpired: judgementData.qtd_expired ?? calculateJudgementFromSum(sumRow.qtdExpired),
        totalQtdRevenue: judgementData.total_qtd_revenue ?? calculateJudgementFromSum(sumRow.totalQtdRevenue),
        roqRisk: judgementData.roq_risk ?? calculateJudgementFromSum(sumRow.roqRisk),
        roqUpside: judgementData.roq_upside ?? calculateJudgementFromSum(sumRow.roqUpside),
        month0Likely: judgementData.month_0?.most_likely ?? calculateJudgementFromSum(sumRow.month0Likely),
        month0Best: judgementData.month_0?.best_case ?? calculateJudgementFromSum(sumRow.month0Best),
        month1Likely: judgementData.month_1?.most_likely ?? calculateJudgementFromSum(sumRow.month1Likely),
        month1Best: judgementData.month_1?.best_case ?? calculateJudgementFromSum(sumRow.month1Best),
        month2Likely: judgementData.month_2?.most_likely ?? calculateJudgementFromSum(sumRow.month2Likely),
        month2Best: judgementData.month_2?.best_case ?? calculateJudgementFromSum(sumRow.month2Best),
    };

    return [sumRow, judgementRow];
}
