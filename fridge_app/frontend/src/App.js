// import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from '@mui/material';
import theme from './components/ui/Theme';
// Components
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Register from './components/Register';
import Landing from './components/Landing';
import About from './components/About';
import Contact from './components/Contact';

export default function App() {
	return (
		<ThemeProvider theme={theme}>
			<Router>
				<AuthProvider>
					<Routes>
						<Route path='/' element={<Landing />} />
						<Route path='/dashboard' element={<Dashboard />} />
						<Route path='/login' element={<Login />} />
						<Route path='/register' element={<Register />} />
						<Route path='/about' element={<About />} />
						<Route path='/contact' element={<Contact />} />
					</Routes>
				</AuthProvider>
			</Router>
		</ThemeProvider>
	);
}
