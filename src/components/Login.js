import { Button } from '@material-ui/core';
import React from 'react';
import './Login.css';
import { auth, provider } from './../firebase';
import { useStateValue } from './../StateProvider';
import { actionTypes } from './../reducer';
import { useEffect } from 'react';
import whatsappLogo from '../whatsapp-logo.png'

function Login() {
	const [{} ,dispatch] = useStateValue();

	const signIn = () => {
		auth.signInWithPopup(provider)
			.then((result) => {
				dispatch({
					type: actionTypes.SET_USER,
					user: result.user,
				});
			})
			.catch((error) => {
				alert(error.message);
			});
	}

	useEffect(() => {
		auth.onAuthStateChanged(function(user){
			if(user){
				console.log('user logged in');
				dispatch({
					type: actionTypes.SET_USER,
					user: user,
				});
			}else{
				console.log('user not logged in');
			}
		});
	},[]);

	return (
		<div className="login">
			<div className="login_container">
				<img
					src={whatsappLogo}
					alt=""
				/>
				<div className="login_text">
					<h1>Sign in to Sociol</h1>
				</div>
				<Button type="submit" onClick={signIn}>
					Sign In With Google
				</Button>
			</div>
		</div>
	)
}

export default Login
