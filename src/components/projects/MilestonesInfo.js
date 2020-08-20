import React from 'react';
import PropTypes from 'prop-types';
import {useMutation} from "@apollo/client";

import SimpleTable from "../common/SimpleTable";
import {
    generateMilestoneTableData,
    generateScheduleTableData
} from "../common/helpers/generateTablesData";
import {UPDATE_PROJECT_DETAILS} from "../../graphql/graphql-operations";

MilestonesInfo.propTypes = {
    classes: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired
};

export default function MilestonesInfo(props) {
    const {classes, project} = props;

    const [updateProjectDetails] = useMutation(UPDATE_PROJECT_DETAILS);
    const handleUpdateProjectDetails = async (data) => {
        const {key, value} = data;
        const {
            pm_stage,
            pm_project_status,
            product_end_date
        } = project.details;

        return await updateProjectDetails(
            {
                variables:
                    {
                        query: {_id: project._id},
                        set: {
                            details: {
                                pm_stage,
                                pm_project_status,
                                product_end_date,
                                [key]: value
                            }
                        }
                    }
                }
            );
    }

    const handleRowUpdateResolver = async (funcType, data) => {
        if (funcType === 'details') {
            return await handleUpdateProjectDetails(data);
        }

        return null;
    }

    const {
        milestonesTableColumns,
        milestonesTableRows
    } = generateMilestoneTableData(project);

    const {
        scheduleTableColumns,
        scheduleTableRows
    } = generateScheduleTableData(project);

    return (<>
        {milestonesTableRows.length !== 0 && <div className={classes.tableContainer}>
            <SimpleTable
                projectId={project._id}
                tableName='Project milestone info'
                currentColumns={milestonesTableColumns}
                currentData={milestonesTableRows}
                onUpdate={handleRowUpdateResolver}
            />
        </div>}
        {scheduleTableRows.length !== 0 && <div className={classes.tableContainer}>
            <SimpleTable
                projectId={project._id}
                tableName='Schedule'
                currentColumns={scheduleTableColumns}
                currentData={scheduleTableRows}
            />
        </div>}
    </>)
}