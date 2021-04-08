import React from 'react';

export default function generateDocumentsTableData(project) {
    if (!project) {
        return {
            documentsTableColumns: [],
            documentsTableRows: [],
        };
    }

    const { documents } = project;

    const documentsTableColumns = [
        { title: 'Name', field: 'name', editable: 'always' },
        {
            title: 'Link',
            field: 'url',
            editable: 'always',
            render: (rowData) => (rowData.url ? (
                <a
                    href={rowData.url}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {rowData.url_name ? rowData.url_name : rowData.url}
                </a>
            ) : rowData.url),
        },
    ];

    const documentsTableRows = [];

    if (documents && documents.length > 0) {
        documents.forEach((document) => {
            documentsTableRows.push({
                ...document,
                editable: true,
            });
        });
    } else {
        documentsTableRows.push({
            name: 'Report',
            editable: true,
        });
    }

    return { documentsTableColumns, documentsTableRows };
}
