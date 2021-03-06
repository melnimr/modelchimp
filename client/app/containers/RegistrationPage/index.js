/**
 *
 * RegistrationPage
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import injectSaga from 'utils/injectSaga';
import injectReducer from 'utils/injectReducer';
import { message } from 'antd';
import { makeSelectAuthLogged } from 'containers/App/selectors';
import { Redirect } from 'react-router-dom';
import { makeSelectRegisterError } from './selectors';
import reducer from './reducer';
import saga from './saga';
import RegisterForm from './RegisterForm';
import StyledDiv from './StyledDiv';
import { registerAction, resetAction } from './actions';

/* eslint-disable react/prefer-stateless-function */
export class RegistrationPage extends React.Component {
  handleSubmit = d => {
    this.props.dispatch(registerAction(d));
  };

  componentDidUpdate() {
    if (this.props.registerError) {
      message.error('Registration unsuccessful!');
      this.props.dispatch(resetAction());
    }
  }

  render() {
    if (this.props.logged) return <Redirect to="/projects" />;

    const { inviteToken } = this.props.match.params;

    return (
      <StyledDiv>
        <Helmet>
          <title>RegistrationPage</title>
          <meta name="description" content="Description of Registration Page" />
        </Helmet>
        <RegisterForm onSubmit={this.handleSubmit} inviteToken={inviteToken} />
      </StyledDiv>
    );
  }
}

RegistrationPage.propTypes = {
  dispatch: PropTypes.func.isRequired,
  registerError: PropTypes.bool,
  logged: PropTypes.bool,
  match: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  registerError: makeSelectRegisterError(),
  logged: makeSelectAuthLogged(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

const withReducer = injectReducer({ key: 'registrationPage', reducer });
const withSaga = injectSaga({ key: 'registrationPage', saga });

export default compose(
  withReducer,
  withSaga,
  withConnect,
)(RegistrationPage);
