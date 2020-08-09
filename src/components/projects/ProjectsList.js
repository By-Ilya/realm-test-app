import React, {useContext} from 'react';
import PropTypes from 'prop-types';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import CircularProgress from "@material-ui/core/CircularProgress";

import {RealmContext} from "../../context/RealmContext";
import ProjectCard from "./ProjectCard";

ProjectsList.propTypes = {
    classes: PropTypes.object.isRequired,
}

export default function ProjectsList(props) {
    const {classes} = props;

    const {loadProcessing, projects} = useContext(RealmContext);

    return (
        <List component="nav" className={classes.listRoot} aria-label="contacts">
            {loadProcessing && <ListItem>
                <CircularProgress />
            </ListItem>}
            {!loadProcessing && projects && projects.map(project => {
                return (
                    <ListItem>
                        <ProjectCard psproject={project} />
                    </ListItem>
                )
            })}
        </List>
    )
}