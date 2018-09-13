import React, {Component} from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'

class Rooms extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rooms: [],
            roomName: '',
            showCreateForm: false
        }
    }

    componentWillMount() {
        axios.get("/rooms/getRooms")
            .then((res) => {
                this.setState({rooms: res.data});
            })
    }

    onRoomNameChanged = (e) => {
        this.setState({roomName: e.target.value});
    }

    addRoom = () => {
        let room = {
            name: this.state.roomName,
            access: 'user'
        };
        axios.post('/rooms/addRoom', room)
            .then((res) => {
                this.addNewRoom();
                this.setState({
                    rooms : [
                        ...this.state.rooms, res.data
                    ],
                    roomName: ''
                })
            })
    }

    addNewRoom = () => {
        this.setState({showCreateForm: !this.state.showCreateForm});
    }

    render() {
        return (
            <div className="chatList">
                <div onClick={this.addNewRoom} className="newRoom">
                    +
                </div>
                {
                    this.state.rooms.map(item => {
                        return (
                            <Link  key={item._id} to={`/chat/${item._id}`} className="chat">
                                {item.name}
                            </Link>
                        )
                    })
                }
                <div className={`newRoomForm ${ this.state.showCreateForm ? "show" : "hide"}`}>
                    <input
                        value={this.state.roomName}
                        onChange={this.onRoomNameChanged}
                        placeholder="room name"/>
                    <button onClick={this.addRoom}>Add room</button>
                </div>
            </div>
        )
    }
}

export default Rooms