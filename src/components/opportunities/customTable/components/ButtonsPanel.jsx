import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import TableCell from '@material-ui/core/TableCell';
import IconButton from '@material-ui/core/IconButton';
import EditIcon from '@material-ui/icons/EditOutlined';
import DoneIcon from '@material-ui/icons/DoneAllTwoTone';
import RevertIcon from '@material-ui/icons/NotInterestedOutlined';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme) => ({
    selectTableCell: {
        width: 30,
    },
}));

export default function ButtonsPanel(props) {
    const classes = useStyles();
    const {
        rowId,
        isRowEditable,
        isEditMode,
        updateProcess,
        onEdit,
        onDone,
        onRevert,
    } = props;

    return (
        <TableCell className={classes.selectTableCell}>
            {isRowEditable && isEditMode && (
                <>
                    {updateProcess && <UpdateProcessIcon />}
                    {!updateProcess && (
                        <EditTools
                            rowId={rowId}
                            onDone={onDone}
                            onRevert={onRevert}
                        />
                    )}
                </>
            )}
            {isRowEditable && !isEditMode && (
                <EditButton rowId={rowId} onEdit={onEdit} />
            )}
        </TableCell>
    );
}

ButtonsPanel.propTypes = {
    rowId: PropTypes.string,
    isRowEditable: PropTypes.bool,
    isEditMode: PropTypes.bool.isRequired,
    updateProcess: PropTypes.bool.isRequired,
    onEdit: PropTypes.func.isRequired,
    onDone: PropTypes.func.isRequired,
    onRevert: PropTypes.func.isRequired,
};

ButtonsPanel.defaultProps = {
    rowId: undefined,
    isRowEditable: false,
};

function UpdateProcessIcon() {
    return (
        <IconButton
            aria-label="sync"
            variant="contained"
        >
            <CircularProgress size={24} />
        </IconButton>
    );
}

function EditButton(props) {
    const { rowId, onEdit } = props;
    return (
        <IconButton
            aria-label="delete"
            size="small"
            onClick={() => onEdit(rowId)}
        >
            <EditIcon />
        </IconButton>
    );
}

EditButton.propTypes = {
    rowId: PropTypes.string.isRequired,
    onEdit: PropTypes.func.isRequired,
};

function EditTools(props) {
    const { rowId, onDone, onRevert } = props;
    return (
        <>
            <IconButton
                aria-label="done"
                onClick={() => onDone(rowId)}
            >
                <DoneIcon />
            </IconButton>

            <IconButton
                aria-label="revert"
                onClick={() => onRevert(rowId)}
            >
                <RevertIcon />
            </IconButton>
        </>
    );
}

EditTools.propTypes = {
    rowId: PropTypes.string.isRequired,
    onDone: PropTypes.func.isRequired,
    onRevert: PropTypes.func.isRequired,
};
