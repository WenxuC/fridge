import { createContext, useState, useEffect } from 'react';
import { config } from '../components/Constants';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();
const URL = config.url;

export default AuthContext;

// Provider
export const AuthProvider = ({ children }) => {
	const navigate = useNavigate();
	const [open, setOpen] = useState(false);
	const [alert, setAlert] = useState('');
	const [user, setUser] = useState(() =>
		localStorage.getItem('authTokens')
			? jwt_decode(localStorage.getItem('authTokens'))
			: null
	);
	const [authTokens, setAuthTokens] = useState(() =>
		localStorage.getItem('authTokens')
			? JSON.parse(localStorage.getItem('authTokens'))
			: null
	);
	const [loading, setLoading] = useState(false);

	const guestUser = async e => {
		e.preventDefault();
		const response = await fetch(`${URL}account/token/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				username: 'guest',
				password: 'guest123',
			}),
		});
		const data = await response.json();
		if (response.status === 200) {
			setUser(jwt_decode(data.access));
			setAuthTokens(data);
			localStorage.setItem('authTokens', JSON.stringify(data));
			navigate('/dashboard');
		} else {
			setAlert('Wrong Username or Password. Please try again.');
			setOpen(true);
		}
	};

	const loginUser = async e => {
		e.preventDefault();
		const value = JSON.parse(e.target.value);
		const response = await fetch(`${URL}account/token/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				username: value.username,
				password: value.password,
			}),
		});
		const data = await response.json();
		if (response.status === 200) {
			setUser(jwt_decode(data.access));
			localStorage.setItem('authTokens', JSON.stringify(data));
			setAuthTokens(data);

			navigate('/dashboard');
		} else {
			setAlert('Wrong Username or Password. Please try again.');
			setOpen(true);
		}
	};

	const logoutUser = () => {
		setAuthTokens(null);
		setUser(null);
		localStorage.removeItem('authTokens');
		localStorage.removeItem('ingredients');
		navigate('/login');
	};

	const updateToken = async () => {
		const response = await fetch(`${URL}account/token/refresh/`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ refresh: authTokens?.refresh }),
		});

		const data = await response.json();

		if (response.status === 200) {
			setAuthTokens(data);
			setUser(jwt_decode(data.access));
			localStorage.setItem('authTokens', JSON.stringify(data));
		} else {
			logoutUser();
		}

		if (loading) {
			setLoading(false);
		}
	};

	const contextData = {
		user: user,
		authTokens: authTokens,
		loginUser: loginUser,
		guestUser: guestUser,
		logoutUser: logoutUser,
		setOpen: setOpen,
		open: open,
		alert: alert,
	};

	useEffect(() => {
		if (loading) {
			updateToken();
		}

		let fourMinutes = 1000 * 60 * 4;

		let interval = setInterval(() => {
			if (authTokens) {
				updateToken();
			}
		}, fourMinutes);
		return () => clearInterval(interval);
	}, [authTokens, loading, updateToken]);

	return (
		<AuthContext.Provider value={contextData}>{children}</AuthContext.Provider>
	);
};
