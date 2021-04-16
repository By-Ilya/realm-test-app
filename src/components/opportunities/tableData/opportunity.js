import { mapValueToFilterName } from 'components/helpers/mapFilters';
import { toDateOnly } from 'helpers/dateFormatter';

export default function generateOpportunityTableData(data) {
    const { opportunityColumns, hiddenColumns, opportunities } = data;

    const opportunitiesTableColumns = opportunityColumns.map((column) => {
        if (hiddenColumns.includes(column.title)) {
            return { ...column, hidden: true };
        }
        return column;
    });

    const opportunitiesTableRows = opportunities.map((opportunity) => {
        const {
            _id,
            name,
            owner_region,
            owner,
            account,
            stage,
            forecast_category,
            close_date,
            amount,
            em,
            ps_region,
            services_post_carve,
        } = opportunity;
        const {
            engagement_manager,
            ps_status,
            esd_created,
            call,
            call_amount,
        } = em;

        return {
            id: _id,
            psRegion: ps_region,
            ownerRegion: owner_region,
            owner,
            name,
            account: account.name,
            closeDate: toDateOnly(close_date),
            stage,
            forecastCategory: forecast_category,
            amount,
            services: services_post_carve,
            engagementManager: engagement_manager,
            psStatus: ps_status,
            esdCreated: mapValueToFilterName(esd_created),
            emCall: call,
            emCallAmount: call_amount,
        };
    });

    return { opportunitiesTableColumns, opportunitiesTableRows };
}
