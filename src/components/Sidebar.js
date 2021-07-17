import React, { useEffect, useState } from 'react'
import './Sidebar.css';
import { Avatar, IconButton } from '@material-ui/core';
import SidebarChat from './SidebarChat';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import db, {auth} from './../firebase';
import { actionTypes } from './../reducer';
import { useStateValue } from './../StateProvider';

function Sidebar() {
	const [rooms, setRooms] = useState([]);
	const [{ user }, dispatch] = useStateValue();

	useEffect(() => {
		db.collection('rooms').onSnapshot(snapshot => (
			setRooms(snapshot.docs.map(doc => ({
				id: doc.id,
				data: doc.data(),
			})
			))
		))
	}, [])

	const logout = () => {
		if(user){
			auth.signOut();
			dispatch({
				type: actionTypes.SET_USER,
				user: null,
			});
		}
	}

	return (
		<div className="sidebar">
			<div className="sidebar_header">
				<Avatar src={user?.photoURL} />
				<div className="siderbar_headerRight_dropdown_profile">
					<p>{user.displayName} </p>
					<p>{user.email} </p>
				</div>


				<div className="sidebar_headerRight">
					{/* <IconButton>
						<MoreVertIcon />
					</IconButton> */}


					<div className="siderbar_headerRight_dropdown">
						<IconButton>
							<MoreVertIcon />
						</IconButton>
						<div className="siderbar_headerRight_dropdown_content">
							<a onClick={() => {logout()}}>Logout</a>
							{/* <a>Profile</a> */}
						</div>
					</div>


				</div>
			</div>


			<div className="sidebar_chats">
				<SidebarChat addNewChat /> 
				{rooms.map(room => (
					<SidebarChat key={room.id} id={room.id} name={room.data.name} />
					
				))}
			</div>
		</div>
	)
}

export default Sidebar
