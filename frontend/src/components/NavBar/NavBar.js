import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "./NavBar.css";
import { logout } from "../../store/session";
import RefreshLink from "../RefreshLink.js";

function NavBar() {
  const loggedIn = useSelector((state) => !!state.session.user);
  const dispatch = useDispatch();

  const logoutUser = (e) => {
    e.preventDefault();
    dispatch(logout());
  };

  const getLinks = () => {
    if (loggedIn) {
      return (
        <div className="navbar-links">
          {process.env.NODE_ENV === "development" && (
            <RefreshLink to="/posts">All Posts (development only)</RefreshLink>
          )}
          <RefreshLink to="/home">Home</RefreshLink>
          <RefreshLink to="/profile">Profile</RefreshLink>
          <RefreshLink to="/posts/new">Write a Post</RefreshLink>
          <button onClick={logoutUser}>Logout</button>
        </div>
      );
    } else {
      return (
        <div className="navbar-links">
          <RefreshLink to={"/signup"}>Signup</RefreshLink>
          <RefreshLink to={"/login"}>Login</RefreshLink>
        </div>
      );
    }
  };

  return (
    <nav className="navbar">
      <h1>
        <Link to={"/"}>OpenSesh</Link>
      </h1>
      {getLinks()}
    </nav>
  );
}

export default NavBar;
