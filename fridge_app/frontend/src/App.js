import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components
import Login from './components/Login';
import Dashboard from './components/Dashboard';
function App() {
	return (
		<Router>
			<Routes>
				<Route path='/dashboard' element={<Dashboard />} />
				<Route path='/login' element={<Login />} />
			</Routes>
		</Router>
	);
}

export default App;
