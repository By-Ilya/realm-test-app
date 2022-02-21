import { RowType } from 'components/forecast/tableData/RowType';

const FORMAT_OPTIONS = { minimumFractionDigits: 2 };

function formatNumberValue(value) {
    return (
        value === undefined ||
        value === null ||
        typeof value !== 'number' ||
        Number.isNaN(value)
    )
        ? value
        : (value / 1000).toLocaleString('en-US', FORMAT_OPTIONS);
}

function makeValueToRender(levelName, value) {
    return (levelName !== undefined)
        ? `${levelName}: ${formatNumberValue(value) || '–'}`
        : `${(value && formatNumberValue(value)) || 0}`;
}

export function makeSingleRowData({
    value,
    levelName = undefined,
    changeFilterArgs = undefined,
}) {
    return {
        rowType: RowType.SINGLE_ROW_DATA,
        data: {
            levelName,
            value,
            valueToRender: makeValueToRender(levelName, value),
            changeFilterArgs,
        },
    };
}

export function makeMultiRowData(arrOfSingleRows = []) {
    return {
        rowType: RowType.MULTI_ROW_DATA,
        data: arrOfSingleRows.map((singleRowData) => {
            const { levelName, value, changeFilterArgs } = singleRowData;
            return {
                levelName,
                value,
                valueToRender: makeValueToRender(levelName, value),
                changeFilterArgs,
            };
        }),
    };
}

export function makeJudgementData({ value, thresholdValue }) {
    return {
        rowType: RowType.JUDGEMENT_DATA,
        data: {
            valueToRender: value,
            thresholdValue,
        },
    };
}
