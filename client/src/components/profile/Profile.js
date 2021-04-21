import React, {Fragment, useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import { Link } from 'react-router-dom';

import {getProfileById} from '../../actions/profile';

import Spinner from '../layout/Spinner';

const Profile = ({match, getProfileById, profile: {profile, loading}, auth}) => {
    useEffect(() => {
        getProfileById(match.params.id);   
    },[getProfileById]);
    
    if(profile === null || loading){
        return <Spinner />
    }
    return (
        <Fragment>
            <Link to='/profiles' className='btn btn-light'>
                Back To Profiles
            </Link>
            {auth.isAuthenticated && auth.loading === false && auth.user._id === profile.user._id && (
                <Link to="/edit-profile" className="btn btn-dark">
                    Edit Profile
                </Link>
            )}
        </Fragment>
    )
}

Profile.propTypes = {
    getProfileById: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    profile: state.profile,
    auth: state.auth
});

export default connect(mapStateToProps, {getProfileById})(Profile);
