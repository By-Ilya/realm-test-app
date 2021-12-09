import { extractFieldValue } from 'components/helpers/extractFieldValue';

export function makeMultiRow({ row, complexFieldName }) {
    const pmo = extractFieldValue({ row: row.pmo ?? undefined, complexFieldName });
    const psm = extractFieldValue({ row: row.psm_overrides ?? undefined, complexFieldName });

    return [
        {
            valueToRender: `PMO: ${pmo === undefined ? '–' : pmo}`,
            numberValue: pmo ?? 0,
            changeFilterArgs: undefined,
            isEditable: false,
        },
        {
            valueToRender: `PSM: ${psm === undefined ? '–' : psm}`,
            numberValue: psm ?? 0,
            changeFilterArgs: undefined,
            isEditable: false,
        },
    ];
}
