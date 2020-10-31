import React from 'react';
import PropTypes from 'prop-types'

import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import GoogleButton from 'react-google-button'

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
        marginTop: theme.spacing(3),
        marginBottom: theme.spacing(1),
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
        appName,
        copyrightLink,
        googleSignIn,
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

                <div className={classes.signInForm}>
                    <GoogleButton
                        type="light"
                        onClick={googleSignIn}
                    />

                    {/* TODO: disabled, not actual */}
                    {/*<Button*/}
                    {/*    type="submit"*/}
                    {/*    variant="contained"*/}
                    {/*    color="primary"*/}
                    {/*    className={classes.submit}*/}
                    {/*    onClick={anonymousSignIn}*/}
                    {/*    disabled={true}*/}
                    {/*>*/}
                    {/*    Anonymous user*/}
                    {/*</Button>*/}

                    {/* TODO: disabled due to not working */}
                    {/*<div className={classes.signInForm}>*/}
                    {/*    <GoogleLogin*/}
                    {/*        clientId={googleClientId}*/}
                    {/*        buttonText="Sign in with Google"*/}
                    {/*        onSuccess={onSuccess}*/}
                    {/*        onFailure={onFailure}*/}
                    {/*        scope={'email profile'}*/}
                    {/*        responseType={'code'}*/}
                    {/*        disabled={true}*/}
                    {/*    />*/}
                    {/*</div>*/}
                </div>

                {signInError && <div className={classes.errorBox}>
                    <Typography variant="body2" color="error" align="center">
                        {signInError}
                    </Typography>
                </div>}
            </div>
            <Box mt={1}>
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