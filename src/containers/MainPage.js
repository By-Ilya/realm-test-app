import React from 'react';

import TopPanel from "../components/TopPanel";
import ProjectsContainer from "../components/ProjectsContainer";

export default function MainPage() {
    // const { loading, data } = useQuery(
    //     FIND_PROJECTS,
    //     {variables: {query: {active: true}}}
    // );
    //
    // useEffect(() => {
    //     if (!loading) {
    //         console.log(data);
    //     }
    // }, [loading]);

    return (<>
        <TopPanel />
        <ProjectsContainer />
    </>)
}