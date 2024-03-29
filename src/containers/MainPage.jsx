import React, { useContext, useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';

import { AuthContext } from 'context/AuthContext';
import { ProjectContext } from 'context/ProjectContext';
import { OpportunityContext } from 'context/OpportunityContext';
import { ForecastContext } from 'context/ForecastContext';
import TopPanelRenderer from 'components/TopPanelRenderer';
import ProjectsContainer from 'components/ProjectsContainer';
import OpportunitiesContainer from 'components/OpportunitiesContainer';
import ForecastContainer from 'components/ForecastContainer';
import {
    FIND_PROJECTS,
    FIND_OPPORTUNITIES,
} from 'graphql/graphql-operations';
import { PAGES } from 'helpers/constants/common';

export default function MainPage() {
    const { user, activePage, setActivePage } = useContext(AuthContext);
    const {
        setProjects, setHasMoreProjects,
        setLoadProcessing: setProjectsLoadProcessing,
        cleanLocalProjects,
        filter: projectFilter,
        getSortOrder: getProjectSortOrder,
        pagination: projectPagination,
        fetchProjectsTotalCount,
    } = useContext(ProjectContext);
    const {
        setOpportunities, setHasMoreOpportunities,
        setLoadProcessing: setOpportunitiesLoadProcessing,
        cleanLocalOpportunities,
        filter: opportunityFilter,
        getSortOrder: getOpportunitySortOrder,
        pagination: opportunityPagination,
        fetchOpportunitiesTotalInfo,
    } = useContext(OpportunityContext);
    const { fetchForecast, cleanLocalForecast } = useContext(ForecastContext);

    const isApplyActiveUserFilter = (localKey, filterObj) => {
        if (localStorage.getItem(localKey)) {
            return false;
        }
        return !filterObj.active_user_filter;
    };

    useEffect(() => {
        if (user) {
            if (isApplyActiveUserFilter('projectFilter', projectFilter)) {
                const { name, email } = user.profile;
                projectFilter.active_user_filter = { name, email };
            }
            if (isApplyActiveUserFilter('opportunityFilter', opportunityFilter)) {
                const { name, email } = user.profile;
                opportunityFilter.active_user_filter = { name, email };
            }
        }
    }, [user]);

    const getFiltersInput = (filter, getSortOrder) => ({
        variables: {
            filtersInput: {
                filter,
                sort: getSortOrder(),
            },
        },
    });

    const { limit: projectsLimit } = projectPagination;
    const { limit: opportunitiesLimit } = opportunityPagination;

    const projectQueryOptions = getFiltersInput(
        { ...projectFilter, limit: projectsLimit },
        getProjectSortOrder,
    );
    const opportunityQueryOptions = getFiltersInput(
        { ...opportunityFilter, limit: opportunitiesLimit },
        getOpportunitySortOrder,
    );

    const isMoreProjects = (projects) => projects && projects.length >= projectsLimit + 1;
    const isMoreOpportunities = (opportunities) => opportunities && opportunities.length >= opportunitiesLimit + 1;

    const [fetchProjects] = useLazyQuery(
        FIND_PROJECTS,
        {
            ...projectQueryOptions,
            onCompleted: (data) => {
                const { psprojectsData } = data;
                const psprojects = [...psprojectsData];
                if (isMoreProjects(psprojects)) {
                    psprojects.pop();
                    setHasMoreProjects(true);
                } else {
                    setHasMoreProjects(false);
                }
                setProjects(psprojects);
                setProjectsLoadProcessing(false);
                setProjectsLoadProcessing(false, true);
                fetchProjectsTotalCount();
            },
            onError: (error) => {
                console.error(error);
                setHasMoreProjects(false);
                setProjectsLoadProcessing(false);
                setProjectsLoadProcessing(false, true);
            },
            fetchPolicy: 'network-only',
        },
    );

    const [fetchOpportunities] = useLazyQuery(
        FIND_OPPORTUNITIES,
        {
            ...opportunityQueryOptions,
            onCompleted: (data) => {
                const { opportunitiesData } = data;
                const opportunities = [...opportunitiesData];
                if (isMoreOpportunities(opportunities)) {
                    opportunities.pop();
                    setHasMoreOpportunities(true);
                } else {
                    setHasMoreOpportunities(false);
                }
                setOpportunities(opportunities);
                setOpportunitiesLoadProcessing(false);
                setOpportunitiesLoadProcessing(false, true);
                fetchOpportunitiesTotalInfo();
            },
            onError: (error) => {
                console.error(error);
                setHasMoreOpportunities(false);
                setOpportunitiesLoadProcessing(false);
                setOpportunitiesLoadProcessing(false, true);
            },
            fetchPolicy: 'network-only',
        },
    );

    const fetchProjectsByTrigger = async ({ needToClean }) => {
        if (needToClean) await cleanLocalProjects();
        fetchProjects();
    };

    const fetchOpportunitiesByTrigger = async ({ needToClean }) => {
        if (needToClean) await cleanLocalOpportunities();
        fetchOpportunities();
    };

    const fetchForecastByTrigger = async ({ needToClean }) => {
        if (needToClean) await cleanLocalForecast();
        await fetchForecast(!needToClean);
    };

    useEffect(() => {
        switch (activePage) {
            case PAGES.projects:
                setProjectsLoadProcessing(true);
                fetchProjectsByTrigger({ needToClean: true });
                break;
            case PAGES.opportunities:
                setOpportunitiesLoadProcessing(true);
                fetchOpportunitiesByTrigger({ needToClean: true });
                break;
            case PAGES.forecast:
                fetchForecastByTrigger({ needToClean: true });
                break;
            default: console.error('Unknown page');
        }
    }, [activePage]);

    return (
        <>
            <TopPanelRenderer
                activePage={activePage}
                setActivePage={setActivePage}
                fetchProjects={fetchProjectsByTrigger}
                fetchOpportunities={fetchOpportunitiesByTrigger}
                fetchForecast={fetchForecastByTrigger}
            />
            {activePage === PAGES.projects && (
                <ProjectsContainer
                    fetchProjects={fetchProjectsByTrigger}
                />
            )}
            {activePage === PAGES.opportunities && (
                <OpportunitiesContainer
                    fetchOpportunities={fetchOpportunitiesByTrigger}
                />
            )}
            {activePage === PAGES.forecast && (
                <ForecastContainer
                    fetchForecast={fetchForecastByTrigger}
                />
            )}
        </>
    );
}
