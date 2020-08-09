import React from 'react';
import PropTypes from 'prop-types';
import SearchIcon from '@material-ui/icons/Search';
import InputBase from "@material-ui/core/InputBase";

SearchField.propTypes = {
    classes: PropTypes.object.isRequired,
    inputPlaceHolder: PropTypes.string.isRequired
}

export default function SearchField(props) {
    const {classes, inputPlaceHolder} = props;
    const {
        searchContainer,
        searchIcon,
        inputBaseRoot,
        inputBaseInput
    } = classes;

    return (
        <div className={searchContainer}>
            <div className={searchIcon}>
                <SearchIcon />
            </div>

            <InputBase
                placeholder={inputPlaceHolder}
                classes={{
                    root: inputBaseRoot,
                    input: inputBaseInput
                }}
                inputProps={{'aria-label': 'search'}}
            />
        </div>
    )
}
