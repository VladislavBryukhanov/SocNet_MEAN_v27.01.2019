import React, {Component} from 'react';
import { Link } from 'react-router-dom';

class SideMenu extends Component {
    render() {
        return (
            <table className="sideMenu">
                <tr className="menuItem">
                    <td className="menuLink">
                        <Link to="/">#Dialogs</Link>
                    </td>
                    <td>
                        <span className="counter">223</span>
                    </td>
                </tr>
                <tr className="menuItem">
                    <td className="menuLink">
                        <Link to="/">#Firends</Link>
                    </td>
                    <td>
                        <span className="counter">23</span>
                    </td>
                </tr>
                <tr className="menuItem">
                    <td className="menuLink">
                        <Link to="/">#Likes</Link>
                    </td>
                    <td>
                        <span className="counter">3</span>
                    </td>
                </tr>
                <tr className="menuItem">
                    <td className="menuLink">
                        <Link to="/">#Favorites</Link>
                    </td>
                    <td>
                        <span className="counter">7231</span>
                    </td>
                </tr>
            </table>
        )
    }
}

export default SideMenu;