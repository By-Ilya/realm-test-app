import React, { useContext, useState, useEffect } from 'react';
import uuid from 'react-uuid';
import { makeStyles } from '@material-ui/core';
import { RowType } from 'components/forecast/tableData/RowType';
import Tooltip from '@material-ui/core/Tooltip';
import TextField from '@material-ui/core/TextField';
import { PropTypes } from 'prop-types';
import { ForecastContext } from 'context/ForecastContext';

const useStyles = makeStyles(() => ({
    cellStyle: {
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        fontSize: '14px',
    },
    clickableButton: {
        width: '112px',
        display: 'block',
        overflow: 'hidden',
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        textAlign: 'left',
        fontSize: '14px',
        fontWeight: 600,
        textDecoration: 'underline',
        textOverflow: 'ellipsis',
        color: '#3f51b5',
        padding: 0,
        margin: 0,
    },
    highlightedTextInput: {
        background: 'yellow',
    },
    inputStyles: {
        paddingTop: '8px',
        paddingBottom: '8px',
        fontSize: '14px',
        fontWeight: '550',
    },
}));

const formUpdateFilterFunc = ({
    setFilterFunc,
    findGeoByPsmNameFunc,
    level,
    geo,
    psmName,
}) => {
    switch (level) {
        case 'PSM':
            return () => setFilterFunc({
                level,
                psmName,
                geo: findGeoByPsmNameFunc(psmName),
            });
        case 'DIR':
            return () => setFilterFunc({ level, geo });
        default:
            return () => {};
    }
};

const CustomRowRenderer = React.forwardRef((props, ref) => {
    const { rowType, data } = props;

    let row = null;
    switch (rowType) {
        case RowType.SINGLE_ROW_DATA:
            row = (<SingleRow key={uuid()} singleRowData={data} />);
            break;
        case RowType.MULTI_ROW_DATA:
            row = (<MultiRow key={uuid()} multiRowData={data} />);
            break;
        case RowType.JUDGEMENT_DATA:
            row = (<JudgementRow ref={ref} judgementData={data} />);
            break;
        default:
            break;
    }

    return row;
});

CustomRowRenderer.propTypes = {
    rowType: PropTypes.number.isRequired,
    data: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array,
        PropTypes.object,
    ]).isRequired,
};

function SingleRow(props) {
    const classes = useStyles();

    const { singleRowData } = props;
    const { valueToRender, changeFilterArgs } = singleRowData;

    const { setFilter, findPsmGeoByPsmName } = useContext(ForecastContext);

    if (changeFilterArgs === undefined) {
        return (
            <DataWithTooltipWrapper
                key={uuid()}
                tooltipText={valueToRender}
                dataElem={valueToRender}
            />
        );
    }

    const { level, geo, psmName } = changeFilterArgs;
    const handleOnClickRow = formUpdateFilterFunc({
        setFilterFunc: setFilter,
        findGeoByPsmNameFunc: findPsmGeoByPsmName,
        level,
        geo,
        psmName,
    });

    const dataElem = (
        <button
            type="button"
            className={classes.clickableButton}
            onClick={handleOnClickRow}
        >
            {valueToRender}
        </button>
    );

    return (
        <DataWithTooltipWrapper
            key={uuid()}
            tooltipText={valueToRender}
            dataElem={dataElem}
        />
    );
}

SingleRow.propTypes = {
    singleRowData: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array,
        PropTypes.object,
    ]).isRequired,
};

function MultiRow(props) {
    const { multiRowData } = props;

    return multiRowData.map((rowData) => (
        <SingleRow key={uuid()} singleRowData={rowData} />
    ));
}

MultiRow.propTypes = {
    multiRowData: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array,
        PropTypes.object,
    ]).isRequired,
};

const JudgementRow = React.forwardRef((props, ref) => {
    const classes = useStyles();

    const { judgementData } = props;
    const { valueToRender, thresholdValue } = judgementData;

    const [textFieldValue, setTextFieldValue] = useState(valueToRender);

    const isHighlighted = () => (textFieldValue !== thresholdValue);

    const handleOnChangeTextField = (event) => {
        const newValue = parseFloat(event.target.value || thresholdValue);
        setTextFieldValue(newValue);
    };

    const textFieldClassNames = isHighlighted()
        ? classes.highlightedTextInput
        : undefined;

    return (
        <TextField
            type="number"
            size="small"
            variant="outlined"
            InputProps={{
                classes: {
                    input: classes.inputStyles,
                },
            }}
            label=""
            inputRef={ref}
            value={textFieldValue}
            onChange={handleOnChangeTextField}
            className={textFieldClassNames}
        />
    );
});

JudgementRow.propTypes = {
    judgementData: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.array,
        PropTypes.object,
    ]).isRequired,
};

function DataWithTooltipWrapper(props) {
    const classes = useStyles();

    const { tooltipText, dataElem } = props;

    const childElemRef = React.createRef();

    const [isTooltipHidden, setIsTooltipHidden] = useState(false);

    const isContentScrollable = () => {
        const {
            clientWidth,
            clientHeight,
            scrollWidth,
            scrollHeight,
        } = childElemRef.current;

        return (
            clientWidth < scrollWidth ||
            clientHeight < scrollHeight
        );
    };

    useEffect(() => {
        if (childElemRef?.current) {
            setIsTooltipHidden(!isContentScrollable());
        }
    }, [childElemRef]);

    const childElem = (
        <div key={uuid()} ref={childElemRef} className={classes.cellStyle}>
            {dataElem}
        </div>
    );

    if (isTooltipHidden) return childElem;

    return (
        <Tooltip key={uuid()} title={tooltipText} placement="bottom">
            {childElem}
        </Tooltip>
    );
}

DataWithTooltipWrapper.propTypes = {
    tooltipText: PropTypes.string.isRequired,
    dataElem: PropTypes.oneOfType([
        PropTypes.element,
        PropTypes.string,
    ]).isRequired,
};

export default CustomRowRenderer;
