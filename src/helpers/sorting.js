export function ascSorting(aValue, bValue) {
    if (aValue > bValue) {
        return 1;
    }
    if (aValue < bValue) {
        return -1;
    }
    return 0;
}

export function descSorting(aValue, bValue) {
    if (aValue > bValue) {
        return -1;
    }
    if (aValue < bValue) {
        return 1;
    }
    return 0;
}
