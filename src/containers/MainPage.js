import React, {useContext} from 'react';
import {useLazyQuery} from "@apollo/client";

import {RealmContext} from "../context/RealmContext";
import TopPanel from "../components/TopPanel";
import ProjectsContainer from "../components/ProjectsContainer";
import {FIND_PROJECTS} from "../graphql/graphql-operations";

export default function MainPage() {
    const {
        setProjects, setHasMoreProjects,
        setLoadProcessing, cleanLocalProjects,
        filter, getSortOrder, pagination,
        setMoreProjectsLoadProcessing,
        fetchProjectsTotalCount
    } = useContext(RealmContext);

    const {limit} = pagination;
    const queryOptions = {
        variables: {
            filtersInput: {
                filter: {...filter, limit },
                sort: getSortOrder(),
                count_only: false
            }
        }
    }

    const isMoreProjects = projects => projects && projects.length >= limit + 1;

    const [fetchProjects] = useLazyQuery(
        FIND_PROJECTS,
        {
            ...queryOptions,
            onCompleted: data => {
                const {psprojectsData} = data;
                const psprojects = [...psprojectsData];
                if (isMoreProjects(psprojects)) {
                    psprojects.pop();
                    setHasMoreProjects(true);
                } else {
                    setHasMoreProjects(false);
                }
                setProjects(psprojects);
                setLoadProcessing(false);
                setMoreProjectsLoadProcessing(false);
                fetchProjectsTotalCount();
            },
            onError: error => {
                console.error(error);
                setHasMoreProjects(false);
                setLoadProcessing(false);
                setMoreProjectsLoadProcessing(false);
            },
            fetchPolicy: 'network-only'
        }
    );

    const fetchProjectsByTrigger = async ({needToClean}) => {
        needToClean && await cleanLocalProjects();
        fetchProjects();
    };

    return (<>
        <TopPanel fetchProjects={fetchProjectsByTrigger} />
        <ProjectsContainer fetchProjects={fetchProjectsByTrigger} />
    </>)
}