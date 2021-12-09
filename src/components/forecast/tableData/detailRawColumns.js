/* eslint-disable react/jsx-filename-extension */
import React from 'react';
import MultiRowRenderer from './MultiRowRenderer';

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
                    render: (rowData) => (
                        <MultiRowRenderer
                            multiRow={rowData[`${fullField}`]}
                        />
                    ),
                });
            });

            return;
        }

        rawColumns.push({
            title,
            field,
            editable: 'never',
            render: (rowData) => (
                <MultiRowRenderer
                    multiRow={rowData[`${field}`]}
                />
            ),
        });
    });

    return rawColumns;
}
