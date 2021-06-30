import React, { useContext } from 'react';

import { Redirect } from 'react-router-dom';
import { RouterPath } from '../const/';

function GuestGuard({ children }) {
	const userLocal = sessionStorage.getItem('_tk');

	if (userLocal) {
		return <Redirect to={RouterPath.HOME} />;
	}

	return children;
}

export default GuestGuard;
