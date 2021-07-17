import { Avatar } from '@material-ui/core';
import React, { useEffect, useState } from 'react'
import { useParams, useHistory } from 'react-router-dom';
import './Chat.css';
import db from './../firebase';
import { useStateValue } from './../StateProvider';
import firebase from 'firebase';

function Chat() {
	const history = useHistory();
	const [seed, setSeed] = useState("");
	const [input, setInput] = useState("");
	const { roomId } = useParams();
	const [roomName, setRoomName] = useState("");
	const [messages, setMessages] = useState([]);
	const [{ user }, dispatch] = useStateValue();

	useEffect( () => {
		if(roomId) {
			db.collection('rooms').doc(roomId).onSnapshot(snapshot => {
				try{
					setRoomName(snapshot.data().name)
				}catch(err){
					history.push('/');
				}
			})

			db.collection('rooms').doc(roomId).collection("messages").orderBy("timestamp","asc").onSnapshot(snapshot => {
				setMessages(snapshot.docs.map(doc => doc.data()))
			});

			setSeed(Math.floor(Math.random() * 5000));
		}
	}, [roomId]);

	useEffect(() => {
		setSeed(Math.floor(Math.random() * 5000));
	}, []);

	const sendMessage = (e) => {
		e.preventDefault();
		db.collection('rooms').doc(roomId).collection('messages').add({
			message: input,
			name: user.displayName,
			email: user.email,
			timestamp: firebase.firestore.FieldValue.serverTimestamp(),
		})
		setInput('');
	}


	const determineDate = date => {
		date = date.toLocaleDateString();
		const today = new Date().toLocaleDateString();
		const yesterday = new Date(new Date() - 1000*60*60*24).toLocaleDateString();
		// console.log(date);
		if(date === today){
			return 'Today';
		}else if(date === yesterday){
			return 'Yesterday';
		}
		return date;
	}

	const scrollToBottom = ()=>{
		const d = document.getElementsByClassName('chat_body')[0];
		// console.log(d);
		if(d){
			d.scrollTop = d.scrollHeight;
		}
	}

	return (
		<div className="chat">
			<div className="chat_header">
				<Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
				<div className="chat__headerInfo">
					<h3>{ roomName }</h3>
					{messages?.length > 0 && <p>Last seen { determineDate(new Date(
						messages[messages.length - 1]?.timestamp?.toDate()))} at { new Date(
						messages[messages.length - 1]?.timestamp?.toDate()).toLocaleTimeString() }</p> }
					
				</div>
			</div>

			<div className="chat_body">
				{ messages.map((message, id) => (
					<>
						<p className={`chat_message ${message.email === user.email && `chat_sender`}`} id={'message'+id} key={'message'+id}>
							<span className="chat_name">{ (message.email === user.email)?'You':message.name }</span>
							{/* <span className="chat_name">{ message.name }</span> */}
							{ message.message }
							<span className="chat_timestamp">
								{ determineDate(new Date(message.timestamp?.toDate()))}
								@{ new Date(message.timestamp?.toDate()).toLocaleTimeString()}
							</span>
						</p>
						{ scrollToBottom() }
					</>
				))}
			</div>
			<div className="chat_footer">
				<form>
					<input type="text"
						value={input}	
						onChange={(e) => setInput(e.target.value)}
						placeholder="Type a message"
					/>
					<button onClick={sendMessage} >Send a message</button>
				</form>
			</div>
		</div>
	)
}

export default Chat
