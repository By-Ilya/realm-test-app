export function extractFieldValue({ row, complexFieldName }) {
    if (!row || !complexFieldName) return undefined;
    const fieldNames = complexFieldName.split('.');
    if (!fieldNames.length) return undefined;

    let currentRowValue = row;
    // eslint-disable-next-line no-restricted-syntax
    for (const fName of fieldNames) {
        if (!currentRowValue[`${fName}`]) return undefined;
        currentRowValue = currentRowValue[`${fName}`];
    }

    return currentRowValue;
}
