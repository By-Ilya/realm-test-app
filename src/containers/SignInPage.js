import React from 'react';
import PropTypes from 'prop-types'
import { GoogleLogin } from 'react-google-login';

import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Button from "@material-ui/core/Button";
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    signInForm: {
        width: '100%',
        marginTop: theme.spacing(1),
        display: 'flex',
        justifyContent: 'center'
    },
    errorBox: {
        width: '100%',
        marginTop: theme.spacing(1),
        display: 'flex',
        justifyContent: 'center'
    }
}));

SignInPage.propTypes = {
    googleClientId: PropTypes.string.isRequired,
    appName: PropTypes.string.isRequired,
    copyrightLink: PropTypes.string.isRequired,
    onSuccess: PropTypes.func.isRequired,
    onFailure: PropTypes.func.isRequired,
    signInError: PropTypes.string
}

SignInPage.defaultProps = {
    signInError: null
}

export default function SignInPage(props) {
    const {
        googleClientId,
        appName,
        copyrightLink,
        onSuccess,
        onFailure,
        anonymousSignIn,
        signInError
    } = props;

    const classes = useStyles();

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    onClick={anonymousSignIn}
                >
                    Anonymous user
                </Button>
                <div className={classes.signInForm}>
                    <GoogleLogin
                        clientId={googleClientId}
                        buttonText="Sign in with Google"
                        onSuccess={onSuccess}
                        onFailure={onFailure}
                    />
                </div>
                <div className={classes.signInForm}>

                </div>
                {signInError && <div className={classes.errorBox}>
                    <Typography variant="body2" color="error" align="center">
                        {signInError}
                    </Typography>
                </div>}
            </div>
            <Box mt={8}>
                <Copyright
                    appName={appName}
                    copyrightLink={copyrightLink}
                />
            </Box>
        </Container>
    );
}

function Copyright(props) {
    const { appName, copyrightLink } = props;

    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href={copyrightLink}>
                {appName}
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}