import './App.css';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Login from './components/Login';
import { useStateValue } from './StateProvider';
import Redirection from './components/Redirection';

function App() {
	const [{user}, dispatch] = useStateValue();


	return (
		<div className="app">
			{!user?(
				<Login />
			): (
				<div className="app_body">
					<Router>
						<Sidebar />
						<Switch>
							<Route path="/rooms/:roomId">
								<Chat />
							</Route>
							<Route exact path="/">
								{/* <Chat /> */}
							</Route>
							<Route path="/:slug">
								<Redirection />
							</Route>
						</Switch>
					</Router>
				</div>
			)}
		</div>
	);
}

export default App;
