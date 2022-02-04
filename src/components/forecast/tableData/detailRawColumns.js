/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import CustomRowRenderer from './CustomRowRenderer';

const CELL_STYLE = {
    width: 150,
    maxWidth: 150,
};

export default function generateRawColumns(forecastColumns) {
    const rawColumns = [];
    forecastColumns.forEach((column) => {
        const {
            title,
            subTitle,
            field,
            subColumns,
        } = column;

        if (subColumns && subColumns.length) {
            subColumns.forEach((subColumn) => {
                const {
                    title: subColumnTitle,
                    field: subColumnField,
                } = subColumn;

                const fullTitle = `${subTitle} ${subColumnTitle}`;
                const fullField = `${field}${subColumnField}`;

                rawColumns.push({
                    title: fullTitle,
                    field: fullField,
                    editable: 'never',
                    cellStyle: CELL_STYLE,
                    render: (rowData) => {
                        const { rowType, data } = rowData[`${fullField}`];
                        return (
                            <CustomRowRenderer
                                rowType={rowType}
                                data={data}
                            />
                        );
                    },
                });
            });

            return;
        }

        rawColumns.push({
            title,
            field,
            editable: 'never',
            cellStyle: CELL_STYLE,
            render: (rowData) => {
                const { rowType, data } = rowData[`${field}`];
                return (
                    <CustomRowRenderer
                        rowType={rowType}
                        data={data}
                    />
                );
            },
        });
    });

    return rawColumns;
}
