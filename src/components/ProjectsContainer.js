import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import ProjectsList from "./projects/ProjectsList";
import MilestonesInfoPaper from "./projects/MilestonesInfoPaper";

const useStyles = makeStyles((theme) => ({
    container: {
        marginTop: 70,
        display: 'flex',
        flexDirection: 'row'
    },
    root: {
        width: '90vh',
        backgroundColor: theme.palette.background.paper,
        position: 'relative',
        overflow: 'auto',
        minHeight: '90vh',
        height: '90vh'
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
        overflow: 'auto'
    },
}));

export default function ProjectsContainer() {
    const classes = useStyles();

    return (
        <div className={classes.container}>
            <ProjectsList classes={{listRoot: classes.root}} />
            <MilestonesInfoPaper classes={{paper: classes.paper}}/>
        </div>
    )
}