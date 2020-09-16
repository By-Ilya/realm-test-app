import React, {useContext} from 'react';
import {useLazyQuery} from "@apollo/client";

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

    const [fetchProjects] = useLazyQuery(
        FIND_PROJECTS,
        {
            variables: {
                filtersInput: {
                    filter: {...filter, active: true},
                    sort: getSortOrder()
                }
            },
            onCompleted: data => {
                setProjects(data.psprojectsData);
                setLoadProcessing(false);
            },
            fetchPolicy: 'network-only'
        }
    );

    const fetchProjectsByTime = ({needToClean}) => {
        if (needToClean) cleanLocalProjects();
        setInterval(fetchProjects, 5000);
    }

    return (<>
        <TopPanel fetchProjects={fetchProjectsByTime} />
        <ProjectsContainer fetchProjects={fetchProjectsByTime} />
    </>)
}