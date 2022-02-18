import { extractFieldValue } from 'components/helpers/extractFieldValue';
import { makeMultiRowData } from 'components/forecast/tableData/makeCustomRowData';

export function makeMultiRow({ row, complexFieldName }) {
    const pmo = extractFieldValue({ row: row.pmo ?? undefined, complexFieldName });
    const psm = extractFieldValue({ row: row.psm_overrides ?? undefined, complexFieldName });

    return makeMultiRowData([
        {
            value: pmo ?? 0,
            levelName: 'PMO',
            changeFilterArgs: undefined,
        },
        {
            value: psm ?? 0,
            levelName: 'PSM',
            changeFilterArgs: undefined,
        },
    ]);
}
