import React, {useContext} from 'react';
import PropTypes from 'prop-types';

import SimpleTable from "../common/SimpleTable";
import SimpleETable from "../common/SimpleETable";
import DocumentsTable from "../common/DocumentsTable";
import EditableCellTable from "../common/EditableCellTable";
import ContactsTable from "../common/ContactsTable";
import {
    generateMilestoneTableData,
    generateScheduleTableData,
    generateForecastTableData,
    generateContactsTableData,
    generateDocumentsTableData
} from "../common/helpers/generateTablesData";
import {
    custMailParams,
    ceMailParams
} from "../../helpers/survey/survey";
import {RealmContext} from "../../context/RealmContext";

MilestonesInfo.propTypes = {
    classes: PropTypes.object.isRequired,
    project: PropTypes.object.isRequired,
};

export default function MilestonesInfo(props) {
    const {classes, project} = props;
    const {dbCollection, fcstCollection, setProjectWithCurrentMilestone, user} = useContext(RealmContext);

    const onClickPMStageButton = async (project) => {
        var origEmail = user.profile.email,
            contacts = project.contacts,
            custName = (contacts && contacts.customer) ? contacts.customer.name : null,
            custEmail = (contacts && contacts.customer) ? contacts.customer.email : null,
            projectId = project.name,
            ceName = (contacts && contacts.ce) ? contacts.ce.name : null,
            ceEmail = (contacts && contacts.ce) ? contacts.ce.email : null;

        if (!custName || !custEmail || !ceName || !ceEmail) {
            alert(`Contact information isn't complete!`);
            return;
        }
        //console.log(custMailParams(origEmail,custName,custEmail,projectId))
        //console.log(ceMailParams(origEmail,ceName,ceEmail,projectId))
        await user.callFunction("sendMail",custMailParams(origEmail,custName,custEmail,projectId));
        await user.callFunction("sendMail",ceMailParams(origEmail,ceName,ceEmail,projectId));

        await dbCollection.updateOne({_id: project._id},{$set:{survey_sent:true, survey_sent_ts: new Date()}});

        alert(`Surveys sent!`);
    }

    const {
        milestonesTableColumns,
        milestonesTableRows
    } = generateMilestoneTableData(project, onClickPMStageButton);

    const {
        scheduleTableColumns,
        scheduleTableRows
    } = generateScheduleTableData(project);

    const {
        forecastTableColumns,
        forecastTableRows
    } = generateForecastTableData(project);

    const {
        contactsTableColumns,
        contactsTableRows
    } = generateContactsTableData(project);

    const {
        documentsTableColumns,
        documentsTableRows
    } = generateDocumentsTableData(project);

    const handleUpdateRow = async ({updateKey, value}) => {
        const query = {_id: project._id, 'milestones._id':project.currentMilestone._id};
        const update = {'$set': {[updateKey]: value}};
        const options = {'upsert': false};
        await dbCollection.updateOne(query, update, options);
    }

    const handleUpdateDocumentsRow = async ({doc}) => {
        if (!doc._id) { //we updated a virtual row
            await handleAddDocumentsRow({doc})
            return;
        }

        const query = {_id: project._id, 'documents._id':doc._id};
        const update = {'$set': {'documents.$.name':doc.name, 'documents.$.url':doc.url},'$unset': {'documents.$.url_name':1}};
        const options = {'upsert': false};
        await dbCollection.updateOne(query, update, options);
    }

   const handleAddDocumentsRow = async ({doc}) => {
        const query = {_id: project._id};
        const update = {'$push': {'documents':{name:doc.name, url: doc.url, _id: doc._id}}};
        const options = {'upsert': false};
        await dbCollection.updateOne(query, update, options);
    }

   const handleDeleteDocumentsRow = async ({doc}) => {
        const query = {_id: project._id};
        const update = {'$pull': {'documents':{_id:doc._id}}};
        const options = {'upsert': false};
        await dbCollection.updateOne(query, update, options);
    }

    const handleUpdateForecast = async ({month, updateKey, value}) => {
        const query = {milestoneId: project.currentMilestone._id, "month": month};
        const update = {'$set': {[updateKey]: value}};
        const options = {'upsert': true};
        await fcstCollection.updateOne(query, update, options);

        //refresh the forecast data
        var forecast = await user.functions.getMilestoneForecast(project.currentMilestone._id);
        setProjectWithCurrentMilestone({
            project: project,
            milestone: project.currentMilestone,
            forecast: forecast
        });
    }

    const handleUpdateForecastCheckbox = async (event) => {
        const query = {_id: project._id};
        const update = {'$set': {monthly_forecast_done: event.target.checked}};
        dbCollection.updateOne(query, update);
    }

    return (<>
        {milestonesTableRows.length !== 0 && <div className={classes.tableContainer}>
            <SimpleETable
                projectId={project._id}
                tableName='Project milestone info'
                currentColumns={milestonesTableColumns}
                currentData={milestonesTableRows}
                onUpdate={handleUpdateRow}
            />
        </div>}
        {documentsTableRows.length !== 0 && <div className={classes.tableContainer}>
            <DocumentsTable
                projectId={project._id}
                tableName='Documents'
                currentColumns={documentsTableColumns}
                currentData={documentsTableRows}
                onUpdate={handleUpdateDocumentsRow}
                onAdd={handleAddDocumentsRow}
                onDelete={handleDeleteDocumentsRow}
            />
        </div>}
        {<div className={classes.tableContainer}>
            <ContactsTable
                projectId={project._id}
                tableName='Contact Information'
                currentColumns={contactsTableColumns}
                currentData={contactsTableRows}
                onUpdate={handleUpdateRow}
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
        {forecastTableRows.length !== 0 && <div className={classes.tableContainer}>
            <EditableCellTable
                projectId={project._id}
                milestoneId={project.currentMilestone._id}
                tableName='Forecast'
                currentColumns={forecastTableColumns}
                currentData={forecastTableRows}
                onUpdate={handleUpdateForecast}
                onCheckboxUpdate={handleUpdateForecastCheckbox}
                checkboxValue={project.monthly_forecast_done ? true : false}
            />
        </div>}
    </>)
}