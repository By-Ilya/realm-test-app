import React, {useContext, useEffect} from 'react';
import { makeStyles } from '@material-ui/core/styles';

import ProjectsList from "./projects/ProjectsList";
import MilestonesInfo from "./projects/MilestonesInfo";

import {RealmContext} from "../context/RealmContext";

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

export default function ProjectsContainer(props) {
    const classes = useStyles();

    const {fetchProjects} = props;
    const {setLoadProcessing, wasFirstFetchHappened, setWasFirstFetchHappened} = useContext(RealmContext);

    useEffect(() => {
        if (!wasFirstFetchHappened) {
            setLoadProcessing(true);
            fetchProjects();
            setWasFirstFetchHappened(true);
        }
    }, [wasFirstFetchHappened]);

    return (
        <div className={classes.container}>
            <ProjectsList classes={{listRoot: classes.root}} />
            <MilestonesInfo classes={{paper: classes.paper}} />
        </div>
    )
}