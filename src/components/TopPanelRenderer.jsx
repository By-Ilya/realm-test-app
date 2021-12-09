import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { ProjectContext } from 'context/ProjectContext';
import { OpportunityContext } from 'context/OpportunityContext';
import { ForecastContext } from 'context/ForecastContext';
import TopPanel from 'components/TopPanel';

import { PAGES } from 'helpers/constants/common';
import {
    getProjectFilters,
    getProjectSortValues,
} from 'components/projects/filters';
import {
    getOpportunityFilters,
    getOpportunitySortValues,
} from 'components/opportunities/filters';

export default function TopPanelRenderer(props) {
    const {
        activePage,
        setActivePage,
        fetchProjects,
        fetchOpportunities,
        fetchForecast,
    } = props;

    const {
        filter: projectFilter,
        setFilter: setProjectFilter,
        sortFields: projectSortFields,
        sort: projectSort,
        setSorting: setProjectSorting,
        regionsList: projectRegionsList,
        ownersList: projectOwnersList,
        projectManagersList,
        stagesList: projectStagesList,
        fetchFiltersDefaultValues: fetchProjectDefaultFilters,
        setLoadProcessing: setProjectLoadProcessing,
        setDefaultPagination: setProjectDefaultPagination,
    } = useContext(ProjectContext);

    const {
        filter: opportunityFilter,
        setFilter: setOpportunityFilter,
        sortFields: opportunitySortFields,
        sort: opportunitySort,
        setSorting: setOpportunitySorting,
        ownerRegionsList: opportunityOwnerRegionsList,
        psRegionsList: opportunityPsRegionsList,
        emManagersList: opportunityEmManagersList,
        fetchFiltersDefaultValues: fetchOpportunityDefaultFilters,
        setLoadProcessing: setOpportunityLoadProcessing,
        setDefaultPagination: setOpportunityDefaultPagination,
    } = useContext(OpportunityContext);

    const {
        filter: forecastFilter,
        setFilter: setForecastFilter,
        levelsList: forecastLevelsList,
        psmNamesList: forecastPsmNamesList,
        geoNamesList: forecastGeoNamesList,
        fetchFiltersDefaultValues: fetchForecastDefaultFilters,
    } = useContext(ForecastContext);

    switch (activePage) {
        case PAGES.projects:
            return (
                <TopPanel
                    activePage={activePage}
                    setActivePage={setActivePage}
                    fetchItems={fetchProjects}
                    filter={projectFilter}
                    sort={projectSort}
                    filtersList={{
                        regionsList: projectRegionsList,
                        ownerList: projectOwnersList,
                        projectManagersList,
                        stagesList: projectStagesList,
                    }}
                    sortFieldsList={projectSortFields}
                    getFilters={getProjectFilters}
                    getSortValues={getProjectSortValues}
                    fetchDefaultFilters={fetchProjectDefaultFilters}
                    setFilter={setProjectFilter}
                    setSorting={setProjectSorting}
                    setLoadProcessing={setProjectLoadProcessing}
                    setDefaultPagination={setProjectDefaultPagination}
                />
            );
        case PAGES.opportunities:
            return (
                <TopPanel
                    activePage={activePage}
                    setActivePage={setActivePage}
                    fetchItems={fetchOpportunities}
                    filter={opportunityFilter}
                    sort={opportunitySort}
                    filtersList={{
                        ownerRegionsList: opportunityOwnerRegionsList,
                        psRegionsList: opportunityPsRegionsList,
                        emManagersList: opportunityEmManagersList,
                    }}
                    sortFieldsList={opportunitySortFields}
                    getFilters={getOpportunityFilters}
                    getSortValues={getOpportunitySortValues}
                    fetchDefaultFilters={fetchOpportunityDefaultFilters}
                    setFilter={setOpportunityFilter}
                    setSorting={setOpportunitySorting}
                    setLoadProcessing={setOpportunityLoadProcessing}
                    setDefaultPagination={setOpportunityDefaultPagination}
                />
            );
        case PAGES.forecast:
            return (
                <TopPanel
                    filter={forecastFilter}
                    activePage={activePage}
                    setActivePage={setActivePage}
                    fetchItems={fetchForecast}
                    filtersList={{
                        levelsList: forecastLevelsList,
                        psmNamesList: forecastPsmNamesList,
                        geoNamesList: forecastGeoNamesList,
                    }}
                    fetchDefaultFilters={fetchForecastDefaultFilters}
                    setFilter={setForecastFilter}
                />
            );
        default:
            return (
                <TopPanel
                    activePage={activePage}
                    setActivePage={setActivePage}
                />
            );
    }
}

TopPanelRenderer.propTypes = {
    fetchProjects: PropTypes.func.isRequired,
    fetchOpportunities: PropTypes.func.isRequired,
    fetchForecast: PropTypes.func.isRequired,
    activePage: PropTypes.string.isRequired,
    setActivePage: PropTypes.func.isRequired,
};
