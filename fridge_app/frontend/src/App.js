import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
// Components
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Register from './components/Register';

function App() {
	return (
		<div className='App'>
			<Router>
				<AuthProvider>
					<Routes>
						<Route path='/dashboard' element={<Dashboard />} />
						<Route path='/login' element={<Login />} />
						<Route path='/register' element={<Register />} />
					</Routes>
				</AuthProvider>
			</Router>
		</div>
	);
}

export default App;
