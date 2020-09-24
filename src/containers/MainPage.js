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
        filter, sort
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

    let timerId = null;
    const {refetch} = useQuery(
        FIND_PROJECTS,
        {
            ...queryOptions,
            notifyOnNetworkStatusChange: true,
            onCompleted: data => {
                setProjects(data.psprojectsData);
                timerId = setTimeout(refetch, 5000);
            }
        }
    );

    const [fetchProjects] = useLazyQuery(
        FIND_PROJECTS,
        {
            ...queryOptions,
            onCompleted: data => {
                setProjects(data.psprojectsData);
                setLoadProcessing(false);
                timerId = setTimeout(refetch, 5000);
            },
            fetchPolicy: 'network-only'
        }
    );

    const fetchProjectsByTrigger = async ({needToClean}) => {
        timerId && clearTimeout(timerId);
        needToClean && await cleanLocalProjects();
        await fetchProjects();
    }

    return (<>
        <TopPanel fetchProjects={fetchProjectsByTrigger} />
        <ProjectsContainer fetchProjects={fetchProjectsByTrigger} />
    </>)
}