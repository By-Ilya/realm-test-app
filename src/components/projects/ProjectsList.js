import React, {useContext, useEffect} from 'react';
import PropTypes from 'prop-types';
import List from "@material-ui/core/List";
import ListSubheader from "@material-ui/core/ListSubheader";
import ListItem from "@material-ui/core/ListItem";
import CircularProgress from "@material-ui/core/CircularProgress";
import Typography from "@material-ui/core/Typography";
import Button from "@material-ui/core/Button";

import {RealmContext} from "../../context/RealmContext";
import ProjectCard from "./ProjectCard";

ProjectsList.propTypes = {
    classes: PropTypes.object.isRequired,
    fetchProjects: PropTypes.func
}

export default function ProjectsList(props) {
    const {classes, fetchProjects} = props;

    const {
        loadProcessing, projects,
        projectsTotalCount,
        defaultPageLimit,
        pagination, setPagination,
        hasMoreProjects,
        moreProjectsLoadProcessing,
        setMoreProjectsLoadProcessing
    } = useContext(RealmContext);

    const fetchMoreProjects = async () => {
        const {increaseOn, limit} = pagination;
        setPagination({limit: limit + increaseOn});
    }

    useEffect(() => {
        if (pagination.limit > defaultPageLimit) {
            setMoreProjectsLoadProcessing(true);
            fetchProjects({needToClean: false});
        }
    }, [pagination]);

    return (
        <List component="nav" className={classes.listRoot} aria-label="contacts" subheader={<li />}>
            <li className={classes.listSection}>
                <ul className={classes.ul}>
                    <ListSubheader>
                        <Typography variant="h5" color="primary">
                            Total: {projectsTotalCount || 0} {(projects && (projects.length < projectsTotalCount)) ? ("(Showing " + projects.length + ")") : "" }
                        </Typography>
                    </ListSubheader>

                    {loadProcessing && <ListItem>
                        <CircularProgress className={classes.progress} />
                    </ListItem>}

                    {!loadProcessing && projects && projects.map(project => {
                        return (
                            <ListItem key={project._id}>
                                <ProjectCard psproject={project}/>
                            </ListItem>
                        )
                    })}

                    {!loadProcessing && projects && <ListItem>
                        {projects && projects.length > 0 && <Button
                            disabled={!hasMoreProjects || moreProjectsLoadProcessing}
                            variant="contained"
                            color="primary"
                            onClick={fetchMoreProjects}
                        >
                            Get more
                        </Button>}
                        {moreProjectsLoadProcessing && <CircularProgress size={24} className={classes.buttonProgress} />}
                    </ListItem>}
                </ul>
            </li>
        </List>
    )
}