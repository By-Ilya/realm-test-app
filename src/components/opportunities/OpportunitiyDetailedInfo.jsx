import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import CloseButton from 'components/common/CloseButton';
import {
    OpportunityCard,
    EMTable,
    PSNotes,
    OppInfoTable,
} from 'components/opportunities/detailedInfo';
import { AuthContext } from 'context/AuthContext';
import { OpportunityContext } from 'context/OpportunityContext';

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
        alignItems: 'center',
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
    const { opportunityCollection } = useContext(AuthContext);
    const { updateLocalPsNotes } = useContext(OpportunityContext);

    const { _id, em, ps_notes } = opportunity;

    const handleOnClickSavePsNotes = async (newPsNotes) => {
        const query = { _id };
        const update = {
            $set: { ps_notes: newPsNotes },
        };
        const options = { upsert: false };
        await opportunityCollection.updateOne(query, update, options);
        await updateLocalPsNotes(_id, newPsNotes);
    };

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

                    <ListItem key="oppinfo_table">
                        <OppInfoTable
                            opportunity={opportunity}
                        />
                    </ListItem>

                    <ListItem key="em_table">
                        <EMTable
                            opportunityId={_id}
                            em={em}
                        />
                    </ListItem>

                    <PSNotes
                        countRows={10}
                        textValue={ps_notes}
                        onSave={handleOnClickSavePsNotes}
                    />
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
