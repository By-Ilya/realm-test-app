/* eslint-disable react/jsx-filename-extension */
import { toDateOnly_local } from 'helpers/dateFormatter';
import { generateSFLink } from 'helpers/misc';

import React from 'react';

export default function generateCasesTableData(project) {
    if (!project || !project.cases) {
        return {
            casesTableColumns: [],
            casesTableRows: [],
        };
    }

    const { cases } = project;

    const casesTableColumns = [
        {
            title: 'Priority',
            field: 'severity',
            editable: 'never',
            width: '10%',
            render: (rowData) => (
                rowData.fts ? `${rowData.severity} (FTS)` : rowData.severity
            ),
        },
        {
            title: 'Case #',
            field: 'case_number',
            editable: 'never',
            width: '15%',
            render: (rowData) => (
                <a
                    href={generateSFLink(rowData._id)}
                    rel="noopener noreferrer"
                    target="_blank"
                >
                    {rowData.case_number}
                </a>
            ),
        },
        {
            title: 'Status',
            field: 'status',
            editable: 'never',
            width: '15%',
        },
        {
            title: 'Created',
            field: 'date',
            editable: 'never',
            width: '15%',
        },
        {
            title: 'Details',
            field: 'subject',
            editable: 'never',
            width: '55%',
            render: (rowData) => (
                <>
                    <p>
                        <i>Project:</i>
                        {rowData.cloud_project_name || rowData.project_name}
                    </p>
                    <p>
                        <i>Reporter:</i>
                        {rowData.reporter}
                    </p>
                    <p>
                        <i>Owner:</i>
                        {rowData.owner}
                    </p>
                    <p>
                        <i>Last Modified:</i>
                        {rowData.last_modified ? rowData.last_modified.toString('YYYY-MM-dd') : 'Unknown'} 
                    </p>
                    <p>
                        <i>Summary:</i>
                        {rowData.subject}
                    </p>
                </>
            ),
        },
        //{ title: 'Reporter', field: 'reporter', editable: 'never' },
        //{ title: 'Owner', field: 'owner', editable: 'never' },
    ];
    const casesTableRows = cases.map((s) => ({
        ...s,
        date: toDateOnly_local(s.date_created),
        editable: false,
    }));

    return { casesTableColumns, casesTableRows };
}
