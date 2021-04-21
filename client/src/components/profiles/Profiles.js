import React, {Fragment, useEffect} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';

import {getProfiles} from '../../actions/profile';
import Spinnner from '../layout/Spinner';

import ProfileItem from './ProfileItem';

const Profiles = ({ getProfiles, profile: {profiles, loading}}) => {
    
    useEffect(() => {
        getProfiles();
    }, []);

    if(loading){
        return <Spinnner />
    }

    return (
        <Fragment>
            <h1 className="large text-primary">Developers</h1>
            <p className="lead">
                <i className="fab fa-connectdevelop"></i> Browse and connect with developers
            </p>
            <div className="profiles">
                {profiles.length > 0 ? (
                    profiles.map(profile => (
                        <ProfileItem key={profile._id} profile={profile} />
                    ))
                ) : <h4>Profiles not Found...</h4> }
            </div>
        </Fragment>
    )
}

Profiles.propTypes = {
    getProfiles: PropTypes.func.isRequired,
    profile: PropTypes.object.isRequired,
}

const mapStateToProps = state => {
    return {
        profile: state.profile
    }
}

export default connect(mapStateToProps, {getProfiles})(Profiles);
