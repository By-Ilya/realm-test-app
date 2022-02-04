import { makeJudgementData } from 'components/forecast/tableData/makeCustomRowData';
import { isArray } from 'components/helpers/isArray';

export function calculateJudgementFromSum({
    judgementValue = 0,
    sumRow = {},
    levelWithThreshold = undefined,
}) {
    const { data: multiSumData } = sumRow;

    const judgementData = makeJudgementData({
        value: 0,
        thresholdValue: 0,
    });

    if (!isArray(multiSumData)) {
        return judgementData;
    }

    judgementData.data.value = judgementValue;
    multiSumData.forEach((sumData) => {
        const { levelName, value } = sumData;
        if (levelName !== undefined && levelName === levelWithThreshold) {
            judgementData.data.thresholdValue = value;
            if (!judgementValue) {
                judgementData.data.valueToRender = value;
            }
        }
    });

    return judgementData;
}
