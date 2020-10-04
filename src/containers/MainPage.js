import React, {useContext} from 'react';
import {useQuery, useLazyQuery} from "@apollo/client";

import {RealmContext} from "../context/RealmContext";
import TopPanel from "../components/TopPanel";
import ProjectsContainer from "../components/ProjectsContainer";
import {FIND_PROJECTS} from "../graphql/graphql-operations";

export default function MainPage() {
    const {
        setProjects,
        setLoadProcessing,
        cleanLocalProjects,
        filter, sort, watcher
    } = useContext(RealmContext);

    const getSortOrder = () => {
        const {field, order} = sort;
        return {field, order: order === 'DESC' ? -1 : 1};
    }

    const queryOptions = {
        variables: {
            filtersInput: {
                filter: {...filter, active: true},
                sort: getSortOrder()
            }
        }
    };

    const [fetchProjects] = useLazyQuery(
        FIND_PROJECTS,
        {
            ...queryOptions,
            onCompleted: data => {
                setProjects(data.psprojectsData);
                setLoadProcessing(false);
            },
            onError: error => {
                console.error(error);
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
        <ProjectsContainer />
    </>)
}