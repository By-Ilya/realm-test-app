import React, {useContext} from 'react';
import {useLazyQuery} from "@apollo/client";

import {RealmContext} from "../context/RealmContext";
import TopPanel from "../components/TopPanel";
import ProjectsContainer from "../components/ProjectsContainer";
import {FIND_PROJECTS} from "../graphql/graphql-operations";

export default function MainPage() {
    const {user, setProjects, setLoadProcessing, filter, sort} = useContext(RealmContext);

    const getQueryFilters = () => {
        const regionFilter = filter.region ? {region: filter.region} : {};
        const ownerFilter = filter.owner ? {owner: filter.owner} : {};
        const projectManagerFilter = filter.project_manager ? {project_manager: filter.project_manager} : {};
        return {...regionFilter, ...ownerFilter, ...projectManagerFilter, active: true};
    }
    const getSortOrder = () => {
        return `${sort.field.toUpperCase()}_${sort.order}`;
    }

    const [fetchProjects] = useLazyQuery(
        FIND_PROJECTS,
        {
            variables: {query: getQueryFilters(), sortBy: getSortOrder()},
            onCompleted: data => {
                if (!filter.name) {
                    setProjects(data.psprojects);
                    setLoadProcessing(false);
                }
            },
            fetchPolicy: 'network-only'
        }
    );

    const fetchProjectsByName = async () => {
        const data = await user.functions.searchProjects({
            ...filter,
            sortData: {[sort.field]: sort.order === 'DESC' ? -1 : 1}
        });
        setProjects(data.psprojects);
        setLoadProcessing(false);
    }

    const fetchProjectsResolver = async () => {
        filter.name
            ? await fetchProjectsByName()
            : fetchProjects()
    }

    return (<>
        <TopPanel fetchProjectsResolver={fetchProjectsResolver} />
        <ProjectsContainer fetchProjectsResolver={fetchProjectsResolver} />
    </>)
}