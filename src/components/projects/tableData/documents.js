/* eslint-disable react/jsx-filename-extension */
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
            render: (rowData) => {
                let aValue = '';
                switch (true) {
                    case rowData.url && (rowData.type !== 'note'):
                        if (rowData.url_name) {
                            aValue = rowData.url_name;
                        } else {
                            aValue = rowData.url.length < 50
                                ? rowData.url
                                : `${rowData.url.slice(0, 47)}...`;
                        }
                        return (
                            <a
                                href={rowData.url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                {aValue}
                            </a>
                        );
                    case rowData.url && (rowData.type === 'note'):
                        return rowData.url;
                    case rowData.body:
                        return rowData.body.split('\n').map(
                            // eslint-disable-next-line react/no-array-index-key
                            (item, i) => <p key={i}>{item}</p>,
                        );
                    default:
                        return '';
                }
            },
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

    //fake document for opportunity ps notes
    if (project.opportunity && project.opportunity.ps_notes)
        documentsTableRows.push({
            body: project.opportunity.ps_notes, name: "Opportunity PS Notes",
            editable: false,
        });

    return { documentsTableColumns, documentsTableRows };
}
