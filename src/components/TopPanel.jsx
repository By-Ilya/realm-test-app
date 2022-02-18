import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { fade, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';

import { AuthContext } from 'context/AuthContext';
import { ProjectContext } from 'context/ProjectContext';
import HeaderSelect from 'components/topPanel/HeaderSelect';
import SearchField from 'components/common/SearchField';
import FilterButton from 'components/common/FilterButton';
import Profile from 'components/common/Profile';
import ProfileMenu from 'components/common/ProfileMenu';
import ProfileMobileMenu from 'components/common/ProfileMobileMenu';
import SyncButton from 'components/common/SyncButton';

import { PAGES } from 'helpers/constants/common';
import { ENTER_KEY } from 'components/constants/common';

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
        fetchItems,
        filter,
        sort,
        filtersList,
        sortFieldsList,
        getFilters,
        getSortValues,
        fetchDefaultFilters,
        setFilter,
        setSorting,
        setLoadProcessing,
        setDefaultPagination,
    } = props;

    const {
        user,
        getActiveUserFilter,
        logOut,
        ceMode,
        toggleCEMode,
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

    const getSortObject = () => getSortValues({
        localSort,
        setLocalSorting,
        sortFieldsList,
    });

    const onApplyFilters = (searchQuery = undefined) => {
        const newFilter = searchQuery !== undefined
            ? { ...localFilter, name: searchQuery }
            : localFilter;

        setLocalFilter(newFilter);
        setFilter(newFilter);
        setDefaultPagination();
    };

    const onApplyDropdownFilters = (filterName, value) => {
        const newFilter = { ...localFilter, [filterName]: value };
        setLocalFilter(newFilter);
        setFilter(newFilter);
        setDefaultPagination();
    };

    const onApplySorting = () => {
        setSorting(localSort);
    };

    useEffect(() => {
        fetchDefaultFilters();
    }, [activePage]);

    useEffect(() => {
        setLoadProcessing(true);
        setLocalFilter(filter);
        setLocalSorting(sort);
        fetchItems({ needToClean: true });
    }, [filter, sort]);

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

    let topPanel = null;
    switch (activePage) {
        case PAGES.projects:
        case PAGES.opportunities:
            topPanel = (
                <SearchFilterSortPanel
                    classes={classes}
                    searchInputPlaceHolder={
                        localFilter.name
                            ? localFilter.name
                            : `Search ${activePage.toLowerCase()}`
                    }
                    onSearchKeyDown={handleSearchKeyDown}
                    filterDialogTitle={`Filter ${activePage.toLowerCase()}`}
                    getFiltersObject={getFiltersObject}
                    onApplyFilters={onApplyFilters}
                    sortDialogTitle={`Sort ${activePage.toLowerCase()}`}
                    getSortObject={getSortObject}
                    onApplySorting={onApplySorting}
                />
            );
            break;
        case PAGES.forecast:
            topPanel = (
                <ModeGeoPsmPanel
                    classes={{
                        formContainer: classes.formContainer,
                        formControl: classes.formControl,
                    }}
                    modeCurrentValue={localFilter.level}
                    modeAllValues={filtersList.levelsList}
                    onChangeMode={(v) => onApplyDropdownFilters('level', v)}
                    geoCurrentValue={localFilter.geo}
                    geoAllValues={filtersList.geoNamesList}
                    onChangeGeo={(v) => onApplyDropdownFilters('geo', v)}
                    psmCurrentValue={localFilter.psmName}
                    psmAllValues={filtersList.psmNamesList}
                    onChangePsmName={(v) => onApplyDropdownFilters('psmName', v)}
                />
            );
            break;
        default:
            break;
    }

    return (
        <div className={classes.grow}>
            <AppBar position="fixed">
                <Toolbar>
                    <HeaderSelect
                        classes={{
                            formContainer: '',
                            formControl: '',
                        }}
                        currentValue={activePage}
                        setValue={setActivePage}
                        allValues={Object.values(PAGES)}
                    />

                    {topPanel}
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
    activePage: PropTypes.string.isRequired,
    setActivePage: PropTypes.func.isRequired,
    fetchItems: PropTypes.func,
    filter: PropTypes.object,
    sort: PropTypes.object,
    filtersList: PropTypes.object,
    sortFieldsList: PropTypes.array,
    getFilters: PropTypes.func,
    getSortValues: PropTypes.func,
    fetchDefaultFilters: PropTypes.func,
    setFilter: PropTypes.func,
    setSorting: PropTypes.func,
    setLoadProcessing: PropTypes.func,
    setDefaultPagination: PropTypes.func,
};

TopPanel.defaultProps = {
    fetchItems: () => {},
    filter: {},
    sort: {},
    filtersList: {},
    sortFieldsList: [],
    getFilters: () => {},
    getSortValues: () => {},
    fetchDefaultFilters: () => {},
    setFilter: () => {},
    setSorting: () => {},
    setLoadProcessing: () => {},
    setDefaultPagination: () => {},
};

function SearchFilterSortPanel(props) {
    const {
        classes,
        searchInputPlaceHolder,
        onSearchKeyDown,
        filterDialogTitle,
        getFiltersObject,
        onApplyFilters,
        sortDialogTitle,
        getSortObject,
        onApplySorting,
    } = props;

    return (
        <>
            <SearchField
                classes={{
                    searchContainer: classes.search,
                    searchIcon: classes.searchIcon,
                    inputBaseRoot: classes.inputRoot,
                    inputBaseInput: classes.inputInput,
                }}
                inputPlaceHolder={searchInputPlaceHolder}
                onKeyDown={onSearchKeyDown}
            />
            <FilterButton
                classes={{
                    formContainer: classes.formContainer,
                    formControl: classes.formControl,
                }}
                filterButtonText="Filters"
                filterDialogTitle={filterDialogTitle}
                filtersObject={getFiltersObject() ?? []}
                applyButtonText="Apply filters"
                onApplyFilters={onApplyFilters}
            />
            <FilterButton
                classes={{
                    formContainer: classes.formContainer,
                    formControl: classes.formControl,
                }}
                filterButtonText="Sort"
                filterDialogTitle={sortDialogTitle}
                filtersObject={getSortObject() ?? []}
                applyButtonText="Sort"
                onApplyFilters={onApplySorting}
            />
        </>
    );
}

SearchFilterSortPanel.propTypes = {
    classes: PropTypes.object.isRequired,
    searchInputPlaceHolder: PropTypes.string.isRequired,
    onSearchKeyDown: PropTypes.func.isRequired,
    filterDialogTitle: PropTypes.string.isRequired,
    getFiltersObject: PropTypes.func.isRequired,
    onApplyFilters: PropTypes.func.isRequired,
    sortDialogTitle: PropTypes.string.isRequired,
    getSortObject: PropTypes.func.isRequired,
    onApplySorting: PropTypes.func.isRequired,
};

function ModeGeoPsmPanel(props) {
    const {
        classes,
        modeCurrentValue,
        modeAllValues,
        onChangeMode,
        geoCurrentValue,
        geoAllValues,
        onChangeGeo,
        psmCurrentValue,
        psmAllValues,
        onChangePsmName,
    } = props;

    const isPsmNameAvaliable = (modeCurrentValue === 'PSM');
    const isGeoAvaliable = (modeCurrentValue !== 'VP');

    const modeDropdown = modeCurrentValue ? (
        <HeaderSelect
            classes={classes}
            currentValue={modeCurrentValue}
            setValue={onChangeMode}
            allValues={modeAllValues}
        />
    ) : null;
    const geoDropdown = isGeoAvaliable ? (
        <HeaderSelect
            classes={classes}
            currentValue={geoCurrentValue || ''}
            setValue={onChangeGeo}
            allValues={geoAllValues}
        />
    ) : null;
    const psmNameDropdown = isPsmNameAvaliable ? (
        <HeaderSelect
            classes={classes}
            currentValue={psmCurrentValue || ''}
            setValue={onChangePsmName}
            allValues={psmAllValues}
        />
    ) : null;

    return (
        <>
            {modeDropdown}
            {geoDropdown}
            {psmNameDropdown}
        </>
    );
}

ModeGeoPsmPanel.propTypes = {
    classes: PropTypes.object.isRequired,
    modeCurrentValue: PropTypes.string.isRequired,
    modeAllValues: PropTypes.array.isRequired,
    onChangeMode: PropTypes.func.isRequired,
    geoCurrentValue: PropTypes.string.isRequired,
    geoAllValues: PropTypes.array.isRequired,
    onChangeGeo: PropTypes.func.isRequired,
    psmCurrentValue: PropTypes.string.isRequired,
    psmAllValues: PropTypes.array.isRequired,
    onChangePsmName: PropTypes.func.isRequired,
};
