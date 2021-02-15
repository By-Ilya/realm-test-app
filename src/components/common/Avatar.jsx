import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AccountCircle from '@material-ui/icons/AccountCircle';

const useStyles = makeStyles(() => ({
    img: {
        width: '35px',
        height: '35px',
        borderRadius: '50%',
        objectFit: 'cover',
    },
    textBlock: {
        display: 'block',
        marginLeft: '0.5rem',
        textAlign: 'left',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
    },
    name: {
        fontSize: '14px',
        fontWeight: '600',
    },
    email: {
        fontSize: '11px',
        fontWeight: '500',
    },
}));

export default function Avatar(props) {
    const classes = useStyles();

    const {
        avatarImage,
        accountName,
        accountEmail,
    } = props;

    return (
        <>
            {avatarImage
                ? <img src={avatarImage} className={classes.img} alt="avatar" />
                : <AccountCircle />}
            <div className={classes.textBlock}>
                <div className={classes.name}>{accountName}</div>
                <div className={classes.email}>{accountEmail}</div>
            </div>
        </>
    );
}

Avatar.propTypes = {
    avatarImage: PropTypes.string,
    accountName: PropTypes.string,
    accountEmail: PropTypes.string,
};

Avatar.defaultProps = {
    avatarImage: '',
    accountName: 'Anonymous',
    accountEmail: 'anonymous',
};
