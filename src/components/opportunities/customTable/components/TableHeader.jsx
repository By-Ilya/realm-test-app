import React from 'react';
import uuid from 'react-uuid';
import PropTypes from 'prop-types';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';

export default function TableHeader(props) {
    const { columns } = props;

    return (
        <TableHead>
            <TableRow>
                <TableCell align="left" />
                {columns.map((column) => (
                    <TableCell key={uuid()} align="left">
                        <b>{column.title}</b>
                    </TableCell>
                ))}
            </TableRow>
        </TableHead>
    );
}

TableHeader.propTypes = {
    columns: PropTypes.array.isRequired,
};
