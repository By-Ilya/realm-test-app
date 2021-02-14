import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import List from '@material-ui/core/List';
import ListSubheader from '@material-ui/core/ListSubheader';
import ListItem from '@material-ui/core/ListItem';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

import { ProjectContext } from 'context/ProjectContext';
import ProjectCard from 'components/projects/ProjectCard';

export default function ProjectsList(props) {
    const { classes, fetchProjects } = props;

    const {
        loadProcessing, projects,
        projectsTotalCount,
        defaultPageLimit,
        pagination, setPagination,
        hasMoreProjects,
        moreProjectsLoadProcessing,
        setMoreProjectsLoadProcessing,
    } = useContext(ProjectContext);

    const fetchMoreProjects = async () => {
        const { increaseOn, limit } = pagination;
        setPagination({ limit: limit + increaseOn });
    };

    useEffect(() => {
        if (pagination.limit > defaultPageLimit) {
            setMoreProjectsLoadProcessing(true);
            fetchProjects({ needToClean: false });
        }
    }, [pagination]);

    const isShowingProjectsInfoVisible = () => !loadProcessing && projects && projects.length < projectsTotalCount;

    const getTotalProjectsHeader = () => {
        const totalProjectsHeader = `Total: ${projectsTotalCount || 0}`;
        return isShowingProjectsInfoVisible()
            ? `${totalProjectsHeader} (Showing ${projects.length})`
            : totalProjectsHeader;
    };

    return (
        <List component="nav" className={classes.listRoot} aria-label="contacts" subheader={<li />}>
            <li className={classes.listSection}>
                <ul className={classes.ul}>
                    <ListSubheader>
                        <Typography variant="h5" color="primary">
                            {getTotalProjectsHeader()}
                        </Typography>
                    </ListSubheader>

                    {loadProcessing && (
                        <ListItem>
                            <CircularProgress className={classes.progress} />
                        </ListItem>
                    )}

                    {!loadProcessing && projects && projects.map((project) => (
                        <ListItem key={project._id}>
                            <ProjectCard psproject={project} />
                        </ListItem>
                    ))}

                    {!loadProcessing && projects && (
                        <ListItem>
                            {projects && projects.length > 0 && (
                                <Button
                                    disabled={!hasMoreProjects || moreProjectsLoadProcessing}
                                    variant="contained"
                                    color="primary"
                                    onClick={fetchMoreProjects}
                                >
                                    Get more
                                </Button>
                            )}
                            {moreProjectsLoadProcessing && (
                                <CircularProgress
                                    size={24}
                                    className={classes.buttonProgress}
                                />
                            )}
                        </ListItem>
                    )}
                </ul>
            </li>
        </List>
    );
}

ProjectsList.propTypes = {
    classes: PropTypes.object.isRequired,
    fetchProjects: PropTypes.func.isRequired,
};
