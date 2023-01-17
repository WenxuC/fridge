// import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
// Components
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Register from './components/Register';
import Landing from './components/Landing';

export default function App() {
	return (
		<Router>
			<AuthProvider>
				<Routes>
					<Route path='/' element={<Landing />} />
					<Route path='/dashboard' element={<Dashboard />} />
					<Route path='/login' element={<Login />} />
					<Route path='/register' element={<Register />} />
				</Routes>
			</AuthProvider>
		</Router>
	);
}
