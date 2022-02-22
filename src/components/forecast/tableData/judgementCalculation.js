import { makeJudgementData } from 'components/forecast/tableData/makeCustomRowData';
import { isArray } from 'components/helpers/isArray';
import { numberK } from 'helpers/misc'

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
    judgementData.data.valueToRender = judgementValue;
    multiSumData.forEach((sumData) => {
        const { levelName, value } = sumData;
        if (levelName !== undefined && levelName === levelWithThreshold) {
            judgementData.data.thresholdValue = value;
            if (!judgementValue) {
                judgementData.data.valueToRender = value;
            }
        }
    });

    judgementData.data.valueToRender = numberK(judgementData.data.valueToRender);

    return judgementData;
}
