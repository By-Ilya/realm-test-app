import { mapFilterNameToValue, mapValueToFilterName } from 'components/helpers/mapFilters';
import { DEFAULT_CHOOSE_VALUES } from 'components/constants/projects';

export default function getOpportunityFilters(props) {
    const {
        localFilter,
        setLocalFilter,
        filtersList,
        getActiveUserFilter,
    } = props;
    const {
        ownerRegionsList,
        psRegionsList,
        emManagersList,
    } = filtersList;

    return [
        {
            label: 'Owner Region',
            currentValue: localFilter.owner_region,
            values: ownerRegionsList,
            setValue: (event) => {
                setLocalFilter({
                    ...localFilter,
                    owner_region: event.target.value,
                });
            },
            showEmptyValue: true,
        },
        {
            label: 'PS Region',
            currentValue: localFilter.ps_region,
            values: psRegionsList,
            setValue: (event) => {
                setLocalFilter({
                    ...localFilter,
                    ps_region: event.target.value,
                });
            },
            showEmptyValue: true,
        },
        {
            label: 'Close date',
            currentValue: localFilter.close_date,
            values: ['All', 'This Q', 'Next Q'],
            setValue: (event) => {
                setLocalFilter({
                    ...localFilter,
                    close_date: event.target.value,
                });
            },
            showEmptyValue: false,
        },
        {
            label: 'EM',
            currentValue: localFilter.engagement_manager,
            values: emManagersList,
            setValue: (event) => {
                setLocalFilter({
                    ...localFilter,
                    engagement_manager: event.target.value,
                });
            },
            showEmptyValue: true,
        },
        {
            label: 'Only my opportunities',
            currentValue: mapValueToFilterName(
                localFilter.active_user_filter,
            ),
            values: DEFAULT_CHOOSE_VALUES,
            setValue: (event) => {
                const isActive = mapFilterNameToValue(
                    event.target.value,
                );
                setLocalFilter({
                    ...localFilter,
                    active_user_filter: isActive
                        ? getActiveUserFilter()
                        : null,
                });
            },
            showEmptyValue: false,
        },
        {
            label: 'Only Forecasted',
            currentValue: mapValueToFilterName(localFilter.inForecast),
            values: DEFAULT_CHOOSE_VALUES,
            setValue: (event) => {
                setLocalFilter({
                    ...localFilter,
                    inForecast: mapFilterNameToValue(event.target.value),
                });
            },
            showEmptyValue: false,
        },
    ];
}
