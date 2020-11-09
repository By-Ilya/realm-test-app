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
        filter, sort, pagination, watcher,
        setMoreProjectsLoadProcessing
    } = useContext(RealmContext);

    const getSortOrder = () => {
        const {field, order} = sort;
        return {field, order: order === 'DESC' ? -1 : 1};
    }

    const queryOptions = {
        variables: {
            filtersInput: {
                filter: {...filter, limit: pagination.limit },
                sort: getSortOrder()
            }
        }
    };

    const isMoreProjects = projectsData => projectsData && projectsData.length >= pagination.limit;

    const [fetchProjects] = useLazyQuery(
        FIND_PROJECTS,
        {
            ...queryOptions,
            onCompleted: data => {
                const {psprojectsData} = data;
                setHasMoreProjects(isMoreProjects(psprojectsData));
                setProjects(psprojectsData);
                setLoadProcessing(false);
                setMoreProjectsLoadProcessing(false);
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
        await fetchProjects();
    }

    let timerId = setTimeout(async function watchForUpdates() {
        timerId && clearTimeout(timerId);
        await watcher();
        timerId = setTimeout(watchForUpdates, 5000);
    }, 5000);

    return (<>
        <TopPanel fetchProjects={fetchProjectsByTrigger} />
        <ProjectsContainer fetchProjects={fetchProjectsByTrigger} />
    </>)
}