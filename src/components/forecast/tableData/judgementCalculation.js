import { isArray } from 'components/helpers/isArray';

export function calculateJudgementFromSum(sumData) {
    const judgementRow = {
        valueToRender: 0,
        changeFilterArgs: undefined,
        isEditable: true,
        editableInputLabel: '',
    };

    if (!isArray(sumData)) return [judgementRow];

    sumData.forEach((dataRow) => {
        let numberValue = 0;
        if (typeof dataRow === 'object') {
            numberValue = dataRow.numberValue;
        } else {
            const numberPart = dataRow.replace(/\w+: /g, '');
            numberValue = numberPart === '–' ? 0 : parseInt(numberPart, 10);
        }

        if (judgementRow.valueToRender === 0 || numberValue !== 0) {
            judgementRow.valueToRender = numberValue;
        }
    });

    return [judgementRow];
}
