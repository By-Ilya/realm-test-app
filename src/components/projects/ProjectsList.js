import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import CircularProgress from "@material-ui/core/CircularProgress";
import {useQuery} from "@apollo/client";

import {FIND_PROJECTS} from "../../graphql/graphql-operations";
import ProjectCard from "./ProjectCard";

ProjectsList.propTypes = {
    classes: PropTypes.object.isRequired
}

export default function ProjectsList(props) {
    const {classes} = props;

    const { loading, data } = useQuery(
        FIND_PROJECTS,
        {variables: {query: {active: true}}}
    );

    useEffect(() => {
        if (!loading) {
            console.log(data);
        }
    }, [loading]);

    return (
        <List component="nav" className={classes.listRoot} aria-label="contacts">
            {loading && <ListItem>
                <CircularProgress />
            </ListItem>}
            {!loading && data.psprojects && data.psprojects.map(project => {
                return (
                    <ListItem>
                        <ProjectCard psproject={project} />
                    </ListItem>
                )
            })}
        </List>
    )
}