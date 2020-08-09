import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import CircularProgress from "@material-ui/core/CircularProgress";

import ProjectCard from "./ProjectCard";

ProjectsList.propTypes = {
    classes: PropTypes.object.isRequired,
    loading: PropTypes.bool.isRequired,
    data: PropTypes.object.isRequired
}

export default function ProjectsList(props) {
    const {classes, loading, data} = props;

    return (
        <List component="nav" className={classes.listRoot} aria-label="contacts">
            {loading && <ListItem>
                <CircularProgress />
            </ListItem>}
            {!loading && data && data.psprojects && data.psprojects.map(project => {
                return (
                    <ListItem>
                        <ProjectCard psproject={project} />
                    </ListItem>
                )
            })}
        </List>
    )
}