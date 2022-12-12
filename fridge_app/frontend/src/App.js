import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Register from './components/Register';
function App() {
	return (
		<Router>
			<Routes>
				<Route path='/dashboard' element={<Dashboard />} />
				<Route path='/login' element={<Login />} />
				<Route path='/register' element={<Register />} />
			</Routes>
		</Router>
	);
}

export default App;
