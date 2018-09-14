import React, {Component} from 'react';
import { Link } from 'react-router-dom';

class SideMenu extends Component {
    render() {
        return (
            <div className="sideMenu">
                <Link to="/">#Dialogs</Link>
                <Link to="/">#Firends</Link>
                <Link to="/">#Likes</Link>
                <Link to="/">#Favorites</Link>
            </div>
        )
    }
}

export default SideMenu;