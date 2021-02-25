import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import CloseButton from 'components/common/CloseButton';
import {
    OpportunityCard,
    EMTable,
    PSNotes,
} from 'components/opportunities/detailedInfo';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
    listRoot: {
        backgroundColor: theme.palette.background.paper,
        position: 'relative',
        overflow: 'auto',
        minHeight: '90vh',
        height: '90vh',
    },
    listSection: {
        backgroundColor: 'inherit',
    },
    listUl: {
        backgroundColor: 'inherit',
        padding: 0,
        overflowAnchor: 'none',
    },
    rightButton: {
        display: 'flex',
        justifyContent: 'flex-end',
        paddingRight: theme.spacing(2),
        paddingTop: 0,
    },
}));

export default function OpportunityDetailedInfo(props) {
    const classes = useStyles();
    const {
        opportunity,
        onClose,
    } = props;

    const { em, ps_notes } = opportunity;

    return (
        <List
            component="nav"
            className={classes.listRoot}
            aria-label="contacts"
            subheader={<li />}
        >
            <li className={classes.listSection}>
                <ul className={classes.listUl}>
                    <ListItem
                        key="close_button"
                        className={classes.rightButton}
                    >
                        <CloseButton onClick={onClose} />
                    </ListItem>

                    <ListItem key="common_info">
                        <OpportunityCard
                            opportunity={opportunity}
                        />
                    </ListItem>

                    <ListItem key="em_table">
                        <EMTable em={em} />
                    </ListItem>

                    <ListItem key="ps_notes">
                        <PSNotes
                            countRows={10}
                            textValue={ps_notes}
                        />
                    </ListItem>
                    <ListItem key="save_ps_notes">
                        <div className={classes.rightButton}>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={() => {}}
                            >
                                Save notes
                            </Button>
                        </div>
                    </ListItem>
                </ul>
            </li>
        </List>
    );
}

OpportunityDetailedInfo.propTypes = {
    opportunity: PropTypes.object.isRequired,
    onClose: PropTypes.func,
};

OpportunityDetailedInfo.defaultProps = {
    onClose: () => {},
};
