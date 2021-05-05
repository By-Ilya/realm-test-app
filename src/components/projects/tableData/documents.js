import React from 'react';

export default function generateDocumentsTableData(project) {
    if (!project) {
        return {
            documentsTableColumns: [],
            documentsTableRows: [],
        };
    }

    const { documents, attachments } = project;

    const documentsTableColumns = [
        { title: 'Name', field: 'name', editable: 'always' },
        {
            title: 'Link/Text',
            field: 'url',
            editable: 'always',
            render: (rowData) => (rowData.url ? (
                <a
                    href={rowData.url}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {rowData.url_name ? rowData.url_name : 
                        (rowData.url.length < 50 ? rowData.url.length : rowData.url.slice(0,47) + "...")
                    }
                </a>
            ) : rowData.body ? rowData.body.split('\n').map((item, i) => <p key={i}>{item}</p>) : ""
            ),
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

    if (attachments && attachments.length > 0) {
        attachments.forEach((att) => {
            documentsTableRows.push({
                ...att,
                editable: false,
            });
        });
    }

    return { documentsTableColumns, documentsTableRows };
}
