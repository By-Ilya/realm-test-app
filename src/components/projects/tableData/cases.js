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
        { title: 'Priority', field: 'severity', editable: 'never', width: "10%",
            render: (rowData) => (
                   rowData.fts ? rowData.severity + " (FTS)" : rowData.severity
            ),
        },
        { title: 'Case #', field: 'case_number', editable: 'never', width: "15%",
          render: (rowData) => (
                <a
                    href={generateSFLink(rowData._id)}
                    target="_blank"
                >
                   {rowData.case_number}
                </a>
            ),
        },
        { title: 'Status', field: 'status', editable: 'never', width: "15%", },
        { title: 'Created', field: 'date', editable: 'never', width: "15%", },
        { title: 'Details', field: 'subject', editable: 'never', width: "55%",
          render: (rowData) => (
                <>
                <p> <i>Project:</i> {rowData.cloud_project_name || rowData.project_name} </p>
                <p> <i>Reporter:</i> {rowData.reporter} </p>
                <p> <i>Owner:</i> {rowData.owner} </p>
                <p> <i>Summary:</i> {rowData.subject} </p>
                </>
            ),
        },
        //{ title: 'Reporter', field: 'reporter', editable: 'never' },
        //{ title: 'Owner', field: 'owner', editable: 'never' },
    ];
    const casesTableRows = cases.map((s) => ({
        ...s,
        date: toDateOnly(s.date_created),
        editable: false,
    }));

    return { casesTableColumns, casesTableRows };
}
