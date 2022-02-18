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
            render: (rowData) => (rowData.url && (rowData.type !== "note") ? (
                <a
                    href={rowData.url}
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    {rowData.url_name ? rowData.url_name : 
                        (rowData.url.length < 50 ? rowData.url : rowData.url.slice(0,47) + "...")
                    }
                </a>
            ) : (rowData.url && (rowData.type === "note") ? rowData.url
             : rowData.body ? rowData.body.split('\n').map((item, i) => <p key={i}>{item}</p>) : "")
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

    //fake document for opportunity ps notes
    if (project.opportunity && project.opportunity.ps_notes)
        documentsTableRows.push({
            body: project.opportunity.ps_notes, name: "Opportunity PS Notes",
            editable: false,
        });

    return { documentsTableColumns, documentsTableRows };
}
