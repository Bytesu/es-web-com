import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

function AuthGuard({ children }) {
	const userLocal = sessionStorage.getItem('_tk');

	if (!userLocal) {
		return <Redirect to="/signIn" />;
	}

	return children;
}

AuthGuard.propTypes = {
	children: PropTypes.any,
};

export default AuthGuard;
