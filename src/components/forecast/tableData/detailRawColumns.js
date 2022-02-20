/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import uuid from 'react-uuid';
import CustomRowRenderer from './CustomRowRenderer';

const CELL_STYLE = {
    width: 150,
    maxWidth: 150,
};

export default function generateRawColumns(forecastColumns, refs = undefined) {
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
                                key={uuid()}
                                rowType={rowType}
                                data={data}
                                ref={refs ? refs.get(fullField) : undefined}
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
                        ref={refs ? refs.get(field) : undefined}
                    />
                );
            },
        });
    });

    return rawColumns;
}
