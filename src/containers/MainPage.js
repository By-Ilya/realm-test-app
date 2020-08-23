import React, {useContext, useEffect} from 'react';
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
                // TODO: Due to onCompleted is called on each rerender
                if (!filter.name) {
                    setProjects(data.psprojects);
                    setLoadProcessing(false);
                }
            }
        }
    );

    useEffect(() => {
        setLoadProcessing(true);
        filter.name !== ''
            ? fetchProjectsByName()
            : fetchProjects();
    }, []);

    const fetchProjectsByName = async () => {
        const data = await user.functions.searchProjects({
            ...filter,
            sortData: {[sort.field]: sort.order === 'DESC' ? -1 : 1}
        });
        setProjects(data.psprojects);
        setLoadProcessing(false);
    }

    return (<>
        <TopPanel
            fetchProjects={fetchProjects}
            fetchProjectsByName={fetchProjectsByName}
        />
        <ProjectsContainer />
    </>)
}