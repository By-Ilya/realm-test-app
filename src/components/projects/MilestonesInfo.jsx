import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import SimpleTable from 'components/common/SimpleTable';
import SimpleETable from 'components/common/SimpleETable';
import DocumentsTable from 'components/common/DocumentsTable';
import EditableCellTable from 'components/common/EditableCellTable';
import ContactsTable from 'components/common/ContactsTable';
import {
    generateMilestoneTableData,
    generateScheduleTableData,
    generateForecastTableData,
    generateContactsTableData,
    generateDocumentsTableData,
    generateSurveyTableData,
    generateCasesTableData,
} from 'components/projects/tableData';
import {
    custMailParams,
    ceMailParams,
} from 'helpers/survey/survey';
import {
    projectHasCESurvey,
    projectHasCustSurvey,
} from 'helpers/project-util';
import { AuthContext } from 'context/AuthContext';
import { ProjectContext } from 'context/ProjectContext';

export default function MilestonesInfo(props) {
    const { classes, project } = props;
    const {
        user,
        dbCollection,
        fcstCollection,
        ceMode
    } = useContext(AuthContext);
    const {
        setProjectWithCurrentMilestone,
    } = useContext(ProjectContext);

    const onClickPMStageButton = async (chosenProject) => {
        const origEmail = user.profile.email;
        const { contacts } = chosenProject;
        const custName = (contacts && contacts.customer) ? contacts.customer.name : null;
        const custEmail = (contacts && contacts.customer) ? contacts.customer.email : null;
        const projectId = chosenProject.name;
        const ceName = (contacts && contacts.ce) ? contacts.ce.name : null;
        const ceEmail = (contacts && contacts.ce) ? contacts.ce.email : null;

        if (!custName || !custEmail || !ceName || !ceEmail) {
            alert('Contact information isn\'t complete!');
            return;
        }
        // console.log(custMailParams(origEmail,custName,custEmail,projectId))
        // console.log(ceMailParams(origEmail,ceName,ceEmail,projectId))
        if (!projectHasCustSurvey(project, custEmail)) {
            await user.callFunction(
                'sendMail',
                custMailParams(origEmail, custName, custEmail, projectId),
            );
        }
        if (!projectHasCESurvey(project, ceEmail)) {
            await user.callFunction(
                'sendMail',
                ceMailParams(origEmail, ceName, ceEmail, projectId),
            );
        }

        await dbCollection.updateOne(
            { _id: project._id },
            { $set: { survey_sent: true, survey_sent_ts: new Date() } },
        );

        alert('Surveys sent!');
    };

    const onClickEngBriefButton = async (chosenProject) => {
        await user.callFunction(
                'requestEngBrief',
                chosenProject._id,
            );

        alert('Engagement Brief generated!');
    };

    const {
        milestonesTableColumns,
        milestonesTableRows,
    } = generateMilestoneTableData(project, onClickPMStageButton, onClickEngBriefButton);

    const {
        scheduleTableColumns,
        scheduleTableRows,
    } = generateScheduleTableData(project);

    const {
        surveyTableColumns,
        surveyTableRows,
    } = generateSurveyTableData(project);

    const {
        forecastTableColumns,
        forecastTableRows,
    } = generateForecastTableData(project);

    const {
        contactsTableColumns,
        contactsTableRows,
    } = generateContactsTableData(project);

    const {
        documentsTableColumns,
        documentsTableRows,
    } = generateDocumentsTableData(project);

    const {
        casesTableColumns,
        casesTableRows,
    } = generateCasesTableData(project);

    const handleUpdateRow = async ({ updateKey, value }) => {
        const query = { _id: project._id, 'milestones._id': project.currentMilestone._id };
        const update = { $set: { [updateKey]: value } };
        const options = { upsert: false };
        await dbCollection.updateOne(query, update, options);
    };

    const handleAddDocumentsRow = async ({ doc }) => {
        const query = { _id: project._id };
        const update = { $push: { documents: { name: doc.name, url: doc.url, _id: doc._id, type: doc.type } } };
        const options = { upsert: false };
        await dbCollection.updateOne(query, update, options);
    };

    const handleUpdateDocumentsRow = async ({ doc, isVirtual }) => {
        if (isVirtual) { // we updated a virtual row
            await handleAddDocumentsRow({ doc });
            return;
        }

        const query = { _id: project._id, 'documents._id': doc._id };

        const update =
            {
                $set: { 'documents.$.name': doc.name, 'documents.$.url': doc.url, 'documents.$.type': doc.type },
                $unset: { 'documents.$.url_name': 1 },
            };
        const options = { upsert: false };
        await dbCollection.updateOne(query, update, options);
    };

    const handleDeleteDocumentsRow = async ({ doc }) => {
        const query = { _id: project._id };
        const update = { $pull: { documents: { _id: doc._id } } };
        const options = { upsert: false };
        await dbCollection.updateOne(query, update, options);
    };

    const handleUpdateForecast = async ({ month, updateKey, value }) => {
        const query = { milestoneId: project.currentMilestone._id, month };
        const update = { $set: { [updateKey]: value } };
        const options = { upsert: true };
        await fcstCollection.updateOne(query, update, options);

        // refresh the forecast data
        const forecast = await user.functions.getMilestoneForecast(project.currentMilestone._id);
        setProjectWithCurrentMilestone({
            project,
            milestone: project.currentMilestone,
            forecast,
        });
    };

    const handleUpdateForecastCheckbox = async (event) => {
        const query = { _id: project._id };
        const update = { $set: { monthly_forecast_done: event.target.checked } };
        dbCollection.updateOne(query, update);
    };

    return (
        <>
            {milestonesTableRows.length !== 0 && (
                <div className={classes.tableContainer}>
                    <SimpleETable
                        projectId={project._id}
                        tableName="Project milestone info"
                        currentColumns={milestonesTableColumns}
                        currentData={milestonesTableRows}
                        onUpdate={handleUpdateRow}
                    />
                </div>
            )}
            {documentsTableRows.length !== 0 && (
                <div className={classes.tableContainer}>
                    <DocumentsTable
                        projectId={project._id}
                        tableName="Documents"
                        currentColumns={documentsTableColumns}
                        currentData={documentsTableRows}
                        onUpdate={handleUpdateDocumentsRow}
                        onAdd={handleAddDocumentsRow}
                        onDelete={handleDeleteDocumentsRow}
                    />
                </div>
            )}
            <div className={classes.tableContainer}>
                <ContactsTable
                    projectId={project._id}
                    tableName="Contact Information"
                    currentColumns={contactsTableColumns}
                    currentData={contactsTableRows}
                    onUpdate={handleUpdateRow}
                />
            </div>
            {surveyTableRows.length !== 0 && (
                <div className={classes.tableContainer}>
                    <SimpleTable
                        projectId={project._id}
                        tableName="Survey Responses"
                        currentColumns={surveyTableColumns}
                        currentData={surveyTableRows}
                    />
                </div>
            )}
            {scheduleTableRows.length !== 0 && (
                <div className={classes.tableContainer}>
                    <SimpleTable
                        projectId={project._id}
                        tableName="Schedule"
                        currentColumns={scheduleTableColumns}
                        currentData={scheduleTableRows}
                    />
                </div>
            )}
            {!ceMode && forecastTableRows.length !== 0 && (
                <div className={classes.tableContainer}>
                    <EditableCellTable
                        projectId={project._id}
                        milestoneId={project.currentMilestone._id}
                        tableName="Forecast"
                        currentColumns={forecastTableColumns}
                        currentData={forecastTableRows}
                        onUpdate={handleUpdateForecast}
                        onCheckboxUpdate={handleUpdateForecastCheckbox}
                        checkboxValue={!!project.monthly_forecast_done}
                    />
                </div>
            )}
            {ceMode && casesTableRows.length !== 0 && (
                <div className={classes.tableContainer}>
                    <SimpleTable
                        projectId={project._id}
                        tableName="Support Cases"
                        currentColumns={casesTableColumns}
                        currentData={casesTableRows}
                        tableLayout="fixed"
                    />
                </div>
            )}
        </>
    );
}

MilestonesInfo.propTypes = {
    classes: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
};
