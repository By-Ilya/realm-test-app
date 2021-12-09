import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core';
import TextField from '@material-ui/core/TextField';
import { PropTypes } from 'prop-types';
import { ForecastContext } from 'context/ForecastContext';
import { isArray } from 'components/helpers/isArray';

const useStyles = makeStyles(() => ({
    clickableButton: {
        background: 'none',
        border: 'none',
        cursor: 'pointer',
        textAlign: 'left',
        fontSize: '14px',
        fontWeight: 600,
        textDecoration: 'underline',
        color: '#3f51b5',
        padding: 0,
        margin: 0,
    },
}));

export default function MultiRowRenderer(props) {
    const classes = useStyles();
    const { multiRow } = props;

    const {
        setFilter,
        findPsmGeoByPsmName,
    } = useContext(ForecastContext);

    if (!isArray(multiRow)) return multiRow;

    const multiRowHtml = multiRow.map((rowElem) => {
        const {
            valueToRender,
            changeFilterArgs,
            isEditable,
            editableInputLabel,
        } = rowElem;

        if (valueToRender === undefined) {
            return (
                <DataWrapper
                    data={rowElem}
                    isEditable={isEditable}
                    label={editableInputLabel || ''}
                />
            );
        }

        if (!changeFilterArgs) {
            return (
                <DataWrapper
                    data={valueToRender}
                    isEditable={isEditable}
                    label={editableInputLabel || ''}
                />
            );
        }

        const { level, geo, psmName } = changeFilterArgs;

        let handleButtonOnClick = () => {};
        switch (level) {
            case 'DIR':
                handleButtonOnClick = () => setFilter({
                    level,
                    geo,
                });
                break;
            case 'PSM':
                handleButtonOnClick = () => setFilter({
                    level,
                    psmName,
                    geo: findPsmGeoByPsmName(psmName),
                });
                break;
            default:
                break;
        }

        return (
            <button
                type="button"
                className={classes.clickableButton}
                onClick={handleButtonOnClick}
            >
                {valueToRender}
            </button>
        );
    });

    return (<>{multiRowHtml}</>);
}

MultiRowRenderer.propTypes = {
    multiRow: PropTypes.object.isRequired,
};

function DataWrapper(props) {
    const { data, isEditable, label } = props;

    const renderDataWrapper = () => {
        if (isEditable) {
            return (
                <TextField
                    type="number"
                    size="small"
                    variant="outlined"
                    label={label}
                    value={data || 0}
                />
            );
        }

        return (<div>{data}</div>);
    };

    return (
        <>{renderDataWrapper()}</>
    );
}

DataWrapper.propTypes = {
    data: PropTypes.object.isRequired,
    isEditable: PropTypes.bool.isRequired,
    label: PropTypes.string.isRequired,
};
