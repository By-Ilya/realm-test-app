import { mapFilterNameToValue, mapValueToFilterName } from 'components/helpers/mapFilters';
import { DEFAULT_CHOOSE_VALUES } from 'components/constants/projects';

export default function getProjectFilters(props) {
    const {
        localFilter,
        setLocalFilter,
        filtersList,
        getActiveUserFilter,
    } = props;
    const {
        regionsList,
        ownersList,
        projectManagersList,
        stagesList,
    } = filtersList;

    return [
        {
            label: 'Region',
            currentValue: localFilter.region,
            values: regionsList,
            setValue: (event) => {
                setLocalFilter({
                    ...localFilter,
                    region: event.target.value,
                });
            },
            showEmptyValue: true,
        },
        {
            label: 'Owner',
            currentValue: localFilter.owner,
            values: ownersList,
            setValue: (event) => {
                setLocalFilter({
                    ...localFilter,
                    owner: event.target.value,
                });
            },
            showEmptyValue: true,
        },
        {
            label: 'PM',
            currentValue: localFilter.project_manager,
            values: projectManagersList,
            setValue: (event) => {
                setLocalFilter({
                    ...localFilter,
                    project_manager: event.target.value,
                });
            },
            showEmptyValue: true,
        },
        {
            label: 'Stage',
            currentValue: localFilter.pm_stage,
            values: stagesList,
            setValue: (event) => {
                setLocalFilter({
                    ...localFilter,
                    pm_stage: event.target.value,
                });
            },
            showEmptyValue: true,
        },
        {
            label: 'Only Active',
            currentValue: mapValueToFilterName(localFilter.active),
            values: DEFAULT_CHOOSE_VALUES,
            setValue: (event) => {
                setLocalFilter({
                    ...localFilter,
                    active: mapFilterNameToValue(event.target.value),
                });
            },
            showEmptyValue: false,
        },
        {
            label: 'Planning done',
            currentValue: mapValueToFilterName(
                localFilter.monthly_forecast_done,
                true,
            ),
            values: DEFAULT_CHOOSE_VALUES,
            setValue: (event) => {
                setLocalFilter({
                    ...localFilter,
                    monthly_forecast_done: mapFilterNameToValue(
                        event.target.value,
                        true,
                    ),
                });
            },
            showEmptyValue: false,
        },
        {
            label: 'Only my projects',
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
    ];
}
