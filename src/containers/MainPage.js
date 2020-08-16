import React, {useContext} from 'react';
import {useLazyQuery} from "@apollo/client";

import {RealmContext} from "../context/RealmContext";
import TopPanel from "../components/TopPanel";
import ProjectsContainer from "../components/ProjectsContainer";
import {FIND_PROJECTS} from "../graphql/graphql-operations";

export default function MainPage() {
    const {setProjects, setLoadProcessing, filter} = useContext(RealmContext);

    const getQueryFilters = () => {
        const regionFilter = filter.region ? {region: filter.region} : {};
        const ownerFilter = filter.owner ? {owner: filter.owner} : {};
        const projectManagerFilter = filter.project_manager ? {project_manager: filter.project_manager} : {};
        return {...regionFilter, ...ownerFilter, ...projectManagerFilter, active: true};
    }

    const [fetchProjects] = useLazyQuery(
        FIND_PROJECTS,
        {
            variables: {query: getQueryFilters()},
            onCompleted: data => {
                setProjects(data.psprojects);
                setLoadProcessing(false);
            }
        }
    );

    return (<>
        <TopPanel fetchProjects={fetchProjects} />
        <ProjectsContainer fetchProjects={fetchProjects} />
    </>)
}