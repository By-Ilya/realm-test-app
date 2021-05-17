import { toDateOnly } from 'helpers/dateFormatter';
import {
    generateSFLink
} from 'helpers/misc';

import React from 'react';

export default function generateCasesTableData(project) {
    if (!project) {
        return {
            casesTableColumns: [],
            casesTableRows: [],
        };
    }

    //const { cases } = project;
    const cases = [
    {"_id":"5002K00000sdfF9QAI","account_id":"001A000001UtqK4IAJ","case_number":"00749221","cloud_project_id":"aFy2K000000mbKLSAY","cloud_project_name":"Staging","customer_escalated":false,"date_created": new Date(1613547112000),"fts":false,"owner":"Martins Abolins","reporter":"Jaime Viloria","severity":"S4","status":"Closed","subject":"migrate multiple databases in active usage from a single cluster to multiple clusters"},
    ]

    const casesTableColumns = [
        { title: 'FTS', field: 'fts', editable: 'never' },
        { title: 'Priority', field: 'severity', editable: 'never',
            render: (rowData) => (
                   rowData.fts ? rowData.severity + " (FTS)" : rowData.severity
            ),
        },
        { title: 'Case #', field: 'case_number', editable: 'never',
          render: (rowData) => (
                <a
                    href={generateSFLink(rowData._id)}
                    target="_blank"
                >
                   {rowData.case_number}
                </a>
            ),
        },
        { title: 'Status', field: 'status', editable: 'never' },
        { title: 'Project', field: 'cloud_project_name', editable: 'never' },
        { title: 'Created', field: 'date', editable: 'never' },
        { title: 'Subject', field: 'subject', editable: 'never' },
        { title: 'Reporter', field: 'reporter', editable: 'never' },
        { title: 'Owner', field: 'owner', editable: 'never' },
    ];
    const casesTableRows = cases.map((s) => ({
        ...s,
        date: toDateOnly(s.date_created),
        editable: false,
    }));

    return { casesTableColumns, casesTableRows };
}
