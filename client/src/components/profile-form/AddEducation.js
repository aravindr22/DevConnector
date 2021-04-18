import React, {Fragment, useState} from 'react';
import PropTypes from 'prop-types';
import {Link, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {addEducation} from '../../actions/profile';

const AddEducation = ({addEducation}) => {
    return (
        <Fragment>
            <h1 class="large text-primary">
                Add Your Education
            </h1>
            <p class="lead">
                <i class="fas fa-graduation-cap"></i> Add any school, bootcamp, etc that
                you have attended
            </p>
            <small>* = required field</small>
            <form class="form">
                <div class="form-group">
                <input
                    type="text"
                    placeholder="* School or Bootcamp"
                    name="school"
                    required
                />
                </div>
                <div class="form-group">
                <input
                    type="text"
                    placeholder="* Degree or Certificate"
                    name="degree"
                    required
                />
                </div>
                <div class="form-group">
                <input type="text" placeholder="Field Of Study" name="fieldofstudy" />
                </div>
                <div class="form-group">
                <h4>From Date</h4>
                <input type="date" name="from" />
                </div>
                <div class="form-group">
                <p>
                    <input type="checkbox" name="current" value="" /> Current School or Bootcamp
                </p>
                </div>
                <div class="form-group">
                <h4>To Date</h4>
                <input type="date" name="to" />
                </div>
                <div class="form-group">
                <textarea
                    name="description"
                    cols="30"
                    rows="5"
                    placeholder="Program Description"
                ></textarea>
                </div>
                <input type="submit" class="btn btn-primary my-1" />
                <a class="btn btn-light my-1" href="dashboard.html">Go Back</a>
            </form>
        </Fragment>
    );
}

AddEducation.propTypes = {
    addEducation: PropTypes.func.isRequired
}

export default connect(null,{addEducation})(AddEducation);
