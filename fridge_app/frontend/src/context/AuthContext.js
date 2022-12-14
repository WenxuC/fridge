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
			setAuthTokens(data);
			localStorage.setItem('authTokens', JSON.stringify(data));
			navigate('/dashboard');
		} else {
			alert('Something went wrong!');
		}
	};

	const logoutUser = () => {
		setAuthTokens(null);
		setUser(null);
		localStorage.removeItem('authTokens');
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
		logoutUser: logoutUser,
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
