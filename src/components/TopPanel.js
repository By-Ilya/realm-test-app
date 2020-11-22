import React, {useContext, useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';

import {RealmContext} from "../context/RealmContext";
import SearchField from "./common/SearchField";
import FilterButton from "./common/FilterButton";
import Profile from "./common/Profile";
import Avatar from "./common/Avatar";

TopPanel.propTypes = {
    fetchProjects: PropTypes.func.isRequired
};

const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing(2),
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing(3),
            width: 'auto',
        },
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    inputRoot: {
        color: 'inherit',
    },
    inputInput: {
        padding: theme.spacing(1, 1, 1, 0),
        paddingLeft: `calc(1em + ${theme.spacing(4)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',
        [theme.breakpoints.up('md')]: {
            width: '20ch',
        },
    },
    formContainer: {
        marginLeft: theme.spacing(2)
    },
    formControl: {
        margin: theme.spacing(1),
        minWidth: 120,
    },
    sectionDesktop: {
        display: 'none',
        [theme.breakpoints.up('md')]: {
            display: 'flex',
        },
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md')]: {
            display: 'none',
        },
    },
}));

export default function TopPanel(props) {
    const classes = useStyles();

    const {fetchProjects} = props;
    const {
        filter, setFilter, sort, setSorting,
        regionsList, ownersList, projectManagersList,
        fetchFiltersDefaultValues, setLoadProcessing,
        getActiveUserName, user, logOut,
        setDefaultPagination
    } = useContext(RealmContext);

    useEffect(() => {
        fetchFiltersDefaultValues();
    }, []);

    useEffect(() => {
        setLoadProcessing(true);
        fetchProjects({needToClean: true});
    }, [filter, sort]);

    const {profile} = user;
    const [localFilter, setLocalFilter] = useState(filter);

    const filtersObject = [
        {
            label: 'Region',
            currentValue: localFilter.region,
            values: regionsList,
            setValue: event => {
                setLocalFilter({...localFilter, region: event.target.value});
            }
        },
        {
            label: 'Owner',
            currentValue: localFilter.owner,
            values: ownersList,
            setValue: event => {
                setLocalFilter({...localFilter, owner: event.target.value});
            }
        },
        {
            label: 'PM',
            currentValue: localFilter.project_manager,
            values: projectManagersList,
            setValue: event => {
                setLocalFilter({...localFilter, project_manager: event.target.value});
            }
        },
        {
            label: 'Only Active',
            currentValue: localFilter.active ? "Yes" : "No",
            values: ["Yes","No"],
            setValue: event => {
                setLocalFilter({
                    ...localFilter,
                    active: (event.target.value === "Yes")
                });
            }
        },
        {
            label: 'Only my projects',
            currentValue: localFilter.active_user_filter ? "Yes" : "No",
            values: ["Yes","No"],
            setValue: event => {
                setLocalFilter({
                    ...localFilter,
                    active_user_filter: (event.target.value === "Yes")
                        ? getActiveUserName()
                        : ''
                });
            }
        }
    ];

    const onApplyFilters = (searchQuery = undefined) => {
        if (searchQuery !== undefined) {
            setLocalFilter({...localFilter, name: searchQuery});
            setFilter({...localFilter, name: searchQuery});
        } else {
            setFilter(localFilter);
        }
        setDefaultPagination();
    }

    const [localSort, setLocalSorting] = useState(sort);
    const sortObject = [
        {
            label: 'Field',
            currentValue: localSort.field,
            values: ['name', 'region', 'owner'],
            setValue: event => {
                setLocalSorting({...localSort, field: event.target.value});
            }
        },
        {
            label: 'Order',
            currentValue: localSort.order,
            values: ['ASC', 'DESC'],
            setValue: event => {
                setLocalSorting({...localSort, order: event.target.value});
            }
        }
    ];

    const onApplySorting = () => {
        setSorting(localSort);
    }

    const handleSearchKeyDown = async (event) => {
        if (event.key === 'Enter') {
            onApplyFilters(event.target.value);
        }
    }

    const menuId = 'primary-search-account-menu';
    const mobileMenuId = 'primary-search-account-menu-mobile';

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleProfileMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuOpen = (event) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };
    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };
    const handleLogOut = () => {
        logOut();
        handleMenuClose();
    }

    return (
        <div className={classes.grow}>
            <AppBar position="fixed">
                <Toolbar>
                    <Typography className={classes.title} variant="h6" noWrap>
                        Projects
                    </Typography>
                    <SearchField
                        classes={{
                            searchContainer: classes.search,
                            searchIcon: classes.searchIcon,
                            inputBaseRoot: classes.inputRoot,
                            inputBaseInput: classes.inputInput
                        }}
                        inputPlaceHolder={'Search projects'}
                        onKeyDown={handleSearchKeyDown}
                    />
                    <FilterButton
                        classes={{
                            formContainer: classes.formContainer,
                            formControl: classes.formControl
                        }}
                        filterButtonText={'Filters'}
                        filterDialogTitle={'Filter projects'}
                        filtersObject={filtersObject}
                        applyButtonText={'Apply filters'}
                        onApplyFilters={onApplyFilters}
                        showEmptyValue={true}
                    />
                    <FilterButton
                        classes={{
                            formContainer: classes.formContainer,
                            formControl: classes.formControl
                        }}
                        filterButtonText={'Sort'}
                        filterDialogTitle={'Sort projects'}
                        filtersObject={sortObject}
                        applyButtonText={'Sort'}
                        onApplyFilters={onApplySorting}
                        showEmptyValue={false}
                    />
                    <div className={classes.grow} />

                    <Profile
                        classes={{
                            sectionDesktop: classes.sectionDesktop,
                            sectionMobile: classes.sectionMobile
                        }}
                        profile={profile}
                        menuId={menuId}
                        mobileMenuId={mobileMenuId}
                        onProfileMenuOpen={handleProfileMenuOpen}
                        onMobileMenuOpen={handleMobileMenuOpen}
                    />
                </Toolbar>
            </AppBar>

            <MobileMenu
                mobileMoreAnchorEl={mobileMoreAnchorEl}
                mobileMenuId={mobileMenuId}
                isMobileMenuOpen={isMobileMenuOpen}
                onMobileMenuClose={handleMobileMenuClose}
                onProfileMenuOpen={handleProfileMenuOpen}
                profile={profile}
            />

            <ProfileMenu
                anchorEl={anchorEl}
                menuId={menuId}
                isMenuOpen={isMenuOpen}
                onMenuClose={handleMenuClose}
                onLogOut={handleLogOut}
            />
        </div>
    );
}

function ProfileMenu(props) {
    const {
        anchorEl, menuId, isMenuOpen,
        onMenuClose, onLogOut
    } = props;

    return (
        <Menu
            anchorEl={anchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={menuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMenuOpen}
            onClose={onMenuClose}
        >
            <MenuItem onClick={onLogOut}>Log Out</MenuItem>
        </Menu>
    )
}

function MobileMenu(props) {
    const {
        mobileMoreAnchorEl, mobileMenuId,
        isMobileMenuOpen, onMobileMenuClose,
        onProfileMenuOpen, profile
    } = props;

    const {name, email, pictureUrl} = profile;

    return (
        <Menu
            anchorEl={mobileMoreAnchorEl}
            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            id={mobileMenuId}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMobileMenuOpen}
            onClose={onMobileMenuClose}
        >
            <MenuItem onClick={onProfileMenuOpen}>
                <IconButton
                    aria-label="account of current user"
                    aria-controls="primary-search-account-menu"
                    aria-haspopup="true"
                    color="inherit"
                >
                    <Avatar
                        avatarImage={pictureUrl}
                        accountName={name}
                        accountEmail={email}
                    />
                </IconButton>
            </MenuItem>
        </Menu>
    )
}
