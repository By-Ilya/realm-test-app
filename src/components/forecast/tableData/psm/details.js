export default function generateDetailRows(forecastDetails) {
    return forecastDetails.map((row) => ({
        name: row.name,
        opportunityName: row.opportunity_name,
        quarterlyCall: row.quarterly_call,
        deliveredCall: row.delivered_call,
        deliveredFromExpiring: row.delivered_from_expiring,
        deliveredConsulting: row.delivered_consulting,
        deliveredTraining: row.delivered_training,
        expiringCall: row.expiring_call,
        qtdDelivered: row.qtd_delivered,
        qtdExpired: row.qtd_expired,
        totalQtdRevenue: row.total_qtd_revenue,
        roqRisk: row.roq_risk,
        roqUpside: row.roq_upside,
        month0Likely: row.month_0?.most_likely ?? 0,
        month0Best: row.month_0?.best_case ?? 0,
        month1Likely: row.month_1?.most_likely ?? 0,
        month1Best: row.month_1?.best_case ?? 0,
        month2Likely: row.month_2?.most_likely ?? 0,
        month2Best: row.month_2?.best_case ?? 0,
    }));
}
