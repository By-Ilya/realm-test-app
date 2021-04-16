export function mapValueToFilterName(value, isAllowEmptyName = false) {

    if ((value == null) && isAllowEmptyName) return '';
    
    switch (Boolean(value)) {
        case true: return 'Yes';
        case false: return 'No';
        default: return isAllowEmptyName ? '' : 'No';
    }
}

export function mapFilterNameToValue(filterName, isAllowNullValue = false) {
    switch (filterName) {
        case 'Yes': return true;
        case 'No': return false;
        default: return isAllowNullValue ? null : false;
    }
}
