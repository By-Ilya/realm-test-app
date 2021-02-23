import { DEFAULT_SORT_VALUES } from 'components/constants/projects';

export default function getProjectSortValues(props) {
    const {
        localSort,
        setLocalSorting,
        fieldsList,
    } = props;

    return [
        {
            label: 'Field',
            currentValue: localSort.field,
            values: fieldsList,
            setValue: (event) => {
                setLocalSorting({ ...localSort, field: event.target.value });
            },
        },
        {
            label: 'Order',
            currentValue: localSort.order,
            values: DEFAULT_SORT_VALUES,
            setValue: (event) => {
                setLocalSorting({ ...localSort, order: event.target.value });
            },
        },
    ];
}
