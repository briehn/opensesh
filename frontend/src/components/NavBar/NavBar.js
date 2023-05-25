import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import "./NavBar.css";
import { logout } from "../../store/session";

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
          <Link to={"/"}>Home</Link>
          <Link to={"/posts"}>All Posts</Link>
          <Link to={"/profile"}>Profile</Link>
          <Link to={"/posts/new"}>Write a Post</Link>
          <button onClick={logoutUser}>Logout</button>
        </div>
      );
    } else {
      return (
        <div className="navbar-links">
          <Link to={"/signup"}>Signup</Link>
          <Link to={"/login"}>Login</Link>
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
