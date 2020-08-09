import React from 'react';
import PropTypes from 'prop-types';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

SimpleTable.propTypes = {
    classes: PropTypes.object.isRequired,
    header: PropTypes.array.isRequired,
    rows: PropTypes.array.isRequired
}

export default function SimpleTable(props) {
    const {
        classes,
        header, rows
    } = props;

    return (
        <TableContainer component={Paper}>
            <Table className={classes.table} size="small" aria-label="a dense table">
                <TableHead>
                    <TableRow>
                        {header.map((name, index) => {
                            if (index === 0) {
                                return <TableCell><b>{name}</b></TableCell>;
                            }
                            return <TableCell align="right"><b>{name}</b></TableCell>;
                        })}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map(row => {
                        return (
                            <TableRow>
                                {row.map((value, index) => {
                                    if (index === 0) {
                                        return <TableCell component="th" scope="row">{value}</TableCell>
                                    }
                                    return <TableCell align="right">{value}</TableCell>
                                })}
                            </TableRow>
                        )
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
}