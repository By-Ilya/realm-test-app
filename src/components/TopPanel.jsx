import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import { AuthContext } from 'context/AuthContext';
import { ProjectContext } from 'context/ProjectContext';
import { OpportunityContext } from 'context/OpportunityContext';
import HeaderSelect from 'components/topPanel/HeaderSelect';
import SearchField from 'components/common/SearchField';
import FilterButton from 'components/common/FilterButton';
import Profile from 'components/common/Profile';
import ProfileMenu from 'components/common/ProfileMenu';
import ProfileMobileMenu from 'components/common/ProfileMobileMenu';
import SyncButton from 'components/common/SyncButton';

import { PAGES } from 'helpers/constants/common';
import { ENTER_KEY } from 'components/constants/common';
import {
    getProjectFilters,
    getProjectSortValues,
} from 'components/projects/filters';
import {
    getOpportunityFilters,
    getOpportunitySortValues,
} from 'components/opportunities/filters';

const useStyles = makeStyles((theme) => ({
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
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
        marginLeft: theme.spacing(2),
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
    const {
        activePage,
        setActivePage,
        fetchProjects,
        fetchOpportunities,
    } = props;

    const {
        user,
        getActiveUserFilter,
        logOut,
        ceMode,
        toggleCEMode
    } = useContext(AuthContext);
    const {
        filter: projectFilter,
        setFilter: setProjectFilter,
        sortFields: projectSortFields,
        sort: projectSort,
        setSorting: setProjectSorting,
        regionsList: projectRegionsList,
        ownersList: projectOwnersList,
        projectManagersList,
        stagesList: projectStagesList,
        fetchFiltersDefaultValues: fetchProjectDefaultFilters,
        setLoadProcessing: setProjectLoadProcessing,
        setDefaultPagination: setProjectDefaultPagination,
        requestSync,
        isSyncActive
    } = useContext(ProjectContext);
    const {
        filter: opportunityFilter,
        setFilter: setOpportunityFilter,
        sortFields: opportunitySortFields,
        sort: opportunitySort,
        setSorting: setOpportunitySorting,
        ownerRegionsList: opportunityOwnerRegionsList,
        psRegionsList: opportunityPsRegionsList,
        emManagersList: opportunityEmManagersList,
        fetchFiltersDefaultValues: fetchOpportunityDefaultFilters,
        setLoadProcessing: setOpportunityLoadProcessing,
        setDefaultPagination: setOpportunitiesDefaultPagination,
    } = useContext(OpportunityContext);

    const isProjectsPage = activePage === PAGES.projects;

    const [localFilter, setLocalFilter] = useState(isProjectsPage
        ? projectFilter
        : opportunityFilter);
    const [localSort, setLocalSorting] = useState(isProjectsPage
        ? projectSort
        : opportunitySort);

    const getProjectFiltersObject = () => {
        const filtersList = {
            regionsList: projectRegionsList,
            ownersList: projectOwnersList,
            projectManagersList,
            stagesList: projectStagesList,
        };
        return getProjectFilters({
            localFilter,
            setLocalFilter,
            filtersList,
            getActiveUserFilter,
        });
    };
    const getProjectSortObject = () => getProjectSortValues({
        localSort,
        setLocalSorting,
        fieldsList: projectSortFields,
    });

    const getOpportunityFiltersObject = () => {
        const filtersList = {
            ownerRegionsList: opportunityOwnerRegionsList,
            psRegionsList: opportunityPsRegionsList,
            emManagersList: opportunityEmManagersList,
        };

        return getOpportunityFilters({
            localFilter,
            setLocalFilter,
            filtersList,
            getActiveUserFilter,
        });
    };
    const getOpportunitySortObject = () => getOpportunitySortValues({
        localSort,
        setLocalSorting,
        fieldsList: opportunitySortFields,
    });

    let filtersObject = isProjectsPage
        ? getProjectFiltersObject()
        : getOpportunityFiltersObject();

    let sortObject = isProjectsPage
        ? getProjectSortObject()
        : getOpportunitySortObject();

    useEffect(() => {
        if (isProjectsPage) {
            fetchProjectDefaultFilters();
            setLocalFilter(projectFilter);
            setLocalSorting(projectSort);
            filtersObject = getProjectFiltersObject();
            sortObject = getProjectSortObject();
        } else {
            fetchOpportunityDefaultFilters();
            setLocalFilter(opportunityFilter);
            setLocalSorting(opportunitySort);
            filtersObject = getOpportunityFiltersObject();
            sortObject = getOpportunitySortObject();
        }
    }, [isProjectsPage]);

    const onApplyFilters = (searchQuery = undefined) => {
        const setFilterFunc = isProjectsPage
            ? setProjectFilter
            : setOpportunityFilter;
        if (searchQuery !== undefined) {
            setLocalFilter({ ...localFilter, name: searchQuery });
            setFilterFunc({ ...localFilter, name: searchQuery });
        } else {
            setFilterFunc(localFilter);
        }
        const setDefaultPaginationFunc = isProjectsPage
            ? setProjectDefaultPagination
            : setOpportunitiesDefaultPagination;
        setDefaultPaginationFunc();
    };

    const onApplySorting = () => {
        const setSortingFunc = isProjectsPage
            ? setProjectSorting
            : setOpportunitySorting;
        setSortingFunc(localSort);
    };

    useEffect(() => {
        setProjectLoadProcessing(true);
        fetchProjects({ needToClean: true });
    }, [projectFilter, projectSort]);

    useEffect(() => {
        setOpportunityLoadProcessing(true);
        fetchOpportunities({ needToClean: true });
    }, [opportunityFilter, opportunitySort]);

    const handleSearchKeyDown = async (event) => {
        if (event.key === ENTER_KEY) {
            onApplyFilters(event.target.value);
        }
    };

    const menuId = 'primary-search-account-menu';
    const mobileMenuId = 'primary-search-account-menu-mobile';

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState(null);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
    const { profile } = user;

    const onTriggerSync = () => {
        requestSync();
    };
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
    };

    return (
        <div className={classes.grow}>
            <AppBar position="fixed">
                <Toolbar>
                    <HeaderSelect
                        currentValue={activePage}
                        setValue={setActivePage}
                        allValues={Object.values(PAGES)}
                    />
                    <SearchField
                        classes={{
                            searchContainer: classes.search,
                            searchIcon: classes.searchIcon,
                            inputBaseRoot: classes.inputRoot,
                            inputBaseInput: classes.inputInput,
                        }}
                        inputPlaceHolder={localFilter.name ? localFilter.name : `Search ${activePage.toLowerCase()}`}
                        onKeyDown={handleSearchKeyDown}
                    />
                    <FilterButton
                        classes={{
                            formContainer: classes.formContainer,
                            formControl: classes.formControl,
                        }}
                        filterButtonText="Filters"
                        filterDialogTitle={`Filter ${activePage.toLowerCase()}`}
                        filtersObject={filtersObject}
                        applyButtonText="Apply filters"
                        onApplyFilters={onApplyFilters}
                    />
                    <FilterButton
                        classes={{
                            formContainer: classes.formContainer,
                            formControl: classes.formControl,
                        }}
                        filterButtonText="Sort"
                        filterDialogTitle={`Sort ${activePage.toLowerCase()}`}
                        filtersObject={sortObject}
                        applyButtonText="Sort"
                        onApplyFilters={onApplySorting}
                    />
                    <div className={classes.grow} />
                    <SyncButton
                        classes={{
                            formContainer: classes.formContainer,
                            formControl: classes.formControl,
                        }}
                        onTriggerSync={onTriggerSync}
                        isSyncActive={isSyncActive}
                    />
                    <Profile
                        classes={{
                            sectionDesktop: classes.sectionDesktop,
                            sectionMobile: classes.sectionMobile,
                        }}
                        profile={profile}
                        menuId={menuId}
                        mobileMenuId={mobileMenuId}
                        onProfileMenuOpen={handleProfileMenuOpen}
                        onMobileMenuOpen={handleMobileMenuOpen}
                    />
                </Toolbar>
            </AppBar>

            <ProfileMobileMenu
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
                onLogout={handleLogOut}
                ceMode={ceMode}
                toggleCEMode={toggleCEMode}
            />
        </div>
    );
}

TopPanel.propTypes = {
    fetchProjects: PropTypes.func.isRequired,
    fetchOpportunities: PropTypes.func.isRequired,
    activePage: PropTypes.string.isRequired,
    setActivePage: PropTypes.func.isRequired,
};
