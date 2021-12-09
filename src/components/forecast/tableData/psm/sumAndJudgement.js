export default function generateSumAndJudgementRows(sumData, judgementData) {
    const sumRow = {
        name: 'Sum',
        quarterlyCall: sumData.quarterly_call ?? 0,
        deliveredCall: sumData.delivered_call ?? 0,
        deliveredFromExpiring: sumData.delivered_from_expiring ?? 0,
        deliveredConsulting: sumData.delivered_consulting ?? 0,
        deliveredTraining: sumData.delivered_training ?? 0,
        expiringCall: sumData.expiring_call ?? 0,
        qtdDelivered: sumData.qtd_delivered ?? 0,
        qtdExpired: sumData.qtd_expired ?? 0,
        totalQtdRevenue: sumData.total_qtd_revenue ?? 0,
        roqRisk: sumData.roq_risk ?? 0,
        roqUpside: sumData.roq_upside ?? 0,
        month0Likely: sumData.month_0?.most_likely ?? 0,
        month0Best: sumData.month_0?.best_case ?? 0,
        month1Likely: sumData.month_1?.most_likely ?? 0,
        month1Best: sumData.month_1?.best_case ?? 0,
        month2Likely: sumData.month_2?.most_likely ?? 0,
        month2Best: sumData.month_2?.best_case ?? 0,
    };

    const judgementRow = {
        name: 'Judgement',
        quarterlyCall: judgementData.quarterly_call ?? sumRow.quarterlyCall,
        deliveredCall: judgementData.delivered_call ?? sumRow.deliveredCall,
        deliveredFromExpiring: judgementData.delivered_from_expiring ?? sumRow.deliveredFromExpiring,
        deliveredConsulting: judgementData.delivered_consulting ?? sumRow.deliveredConsulting,
        deliveredTraining: judgementData.delivered_training ?? sumRow.deliveredTraining,
        expiringCall: judgementData.expiring_call ?? sumRow.expiringCall,
        qtdDelivered: judgementData.qtd_delivered ?? sumRow.qtdDelivered,
        qtdExpired: judgementData.qtd_expired ?? sumRow.qtdExpired,
        totalQtdRevenue: judgementData.total_qtd_revenue ?? sumRow.totalQtdRevenue,
        roqRisk: judgementData.roq_risk ?? sumRow.roqRisk,
        roqUpside: judgementData.roq_upside ?? sumRow.roqUpside,
        month0Likely: judgementData.month_0?.most_likely ?? sumRow.month0Likely,
        month0Best: judgementData.month_0?.best_case ?? sumRow.month0Best,
        month1Likely: judgementData.month_1?.most_likely ?? sumRow.month1Likely,
        month1Best: judgementData.month_1?.best_case ?? sumRow.month1Best,
        month2Likely: judgementData.month_2?.most_likely ?? sumRow.month2Likely,
        month2Best: judgementData.month_2?.best_case ?? sumRow.month2Best,
    };

    return [sumRow, judgementRow];
}
