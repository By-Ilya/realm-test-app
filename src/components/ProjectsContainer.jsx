import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';

import ProjectsList from 'components/projects/ProjectsList';
import MilestonesInfoPaper from 'components/projects/MilestonesInfoPaper';

const useStyles = makeStyles((theme) => ({
    container: {
        marginTop: 70,
        display: 'flex',
        flexDirection: 'row',
    },
    root: {
        width: '90vh',
        backgroundColor: theme.palette.background.paper,
        position: 'relative',
        overflow: 'auto',
        minHeight: '90vh',
        height: '90vh',
    },
    section: {
        backgroundColor: 'inherit',
    },
    ul: {
        backgroundColor: 'inherit',
        padding: 0,
        overflowAnchor: 'none',
    },
    progress: {
        position: 'absolute',
        top: '50%',
        left: '50%',
    },
    buttonProgress: {
        position: 'absolute',
    },
    paper: {
        padding: theme.spacing(1),
        textAlign: 'center',
        color: theme.palette.text.primary,
        whiteSpace: 'normal',
        marginBottom: theme.spacing(1),
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(1),
        maxHeight: '90vh',
        overflow: 'auto',
    },
}));

export default function ProjectsContainer(props) {
    const classes = useStyles();

    const { fetchProjects } = props;

    return (
        <div className={classes.container}>
            <ProjectsList
                classes={{
                    listRoot: classes.root,
                    listSection: classes.section,
                    ul: classes.ul,
                    progress: classes.progress,
                    buttonProgress: classes.buttonProgress,
                }}
                fetchProjects={fetchProjects}
            />
            <MilestonesInfoPaper classes={{ paper: classes.paper }} />
        </div>
    );
}

ProjectsContainer.propTypes = {
    fetchProjects: PropTypes.func.isRequired,
};
