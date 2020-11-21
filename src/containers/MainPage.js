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
        setMoreProjectsLoadProcessing,
        setProjectsTotalCount
    } = useContext(RealmContext);

    const getSortOrder = () => {
        const {field, order} = sort;
        return {field, order: order === 'DESC' ? -1 : 1};
    }

    const {limit} = pagination;
    const queryOptions = {
        variables: {
            filtersInput: {
                filter: {...filter, limit },
                sort: getSortOrder()
            }
        }
    };

    const isMoreProjects = projects => projects && projects.length >= limit + 1;

    const [fetchProjects] = useLazyQuery(
        FIND_PROJECTS,
        {
            ...queryOptions,
            onCompleted: data => {
                setProjectsTotalCount(filter);
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