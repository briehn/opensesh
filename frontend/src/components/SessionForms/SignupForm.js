import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./SessionForm.css";
import { signup, clearSessionErrors } from "../../store/session";

function SignupForm() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(clearSessionErrors());
    };
  }, [dispatch]);

  const update = (field) => {
    let setState;

    switch (field) {
      case "email":
        setState = setEmail;
        break;
      case "username":
        setState = setUsername;
        break;
      case "password":
        setState = setPassword;
        break;
      case "password2":
        setState = setPassword2;
        break;
      default:
        throw Error("Unknown field in Signup Form");
    }

    return (e) => setState(e.currentTarget.value);
  };

  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email cannot be empty";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
    }

    if (!username) {
      newErrors.username = "Username cannot be empty";
    } else if (username.length < 6) {
      newErrors.username = "Username must be at least 6 characters";
    }

    if (!password) {
      newErrors.password = "Password cannot be empty";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (password !== password2) {
      newErrors.password2 = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleMouseLeave = () => {
    setErrors({});
  };

  const usernameSubmit = (e) => {
    e.preventDefault();
    const isValid = Object.keys(errors).length === 0;
    const user = {
      email,
      username,
      password,
    };
    if (isValid) {
      dispatch(signup(user));
    }
  };

  return (
    <div className="session-form-container">
      <form className="session-form" onSubmit={usernameSubmit}>
        <h2 className="session-header">Sign Up Form</h2>
        <label>
          <div>Email</div>
          <input
            type="text"
            value={email}
            onChange={update("email")}
            placeholder="Email"
          />
        </label>{" "}
        <div className="errors">{errors.email}</div>
        <label>
          <div>Username</div>
          <input
            type="text"
            value={username}
            onChange={update("username")}
            placeholder="Username"
          />
        </label>{" "}
        <div className="errors">{errors.username}</div>
        <label>
          <div>Password</div>
          <input
            type="password"
            value={password}
            onChange={update("password")}
            placeholder="Password"
          />
        </label>{" "}
        <div className="errors">{errors.password}</div>
        <label>
          <div>Confirm Password</div>
          <input
            type="password"
            value={password2}
            onChange={update("password2")}
            placeholder="Confirm Password"
          />
        </label>
        <div className="errors">{errors.password2}</div>
        <div className="button-container">
          <input
            className="session-b"
            type="submit"
            value="Sign Up"
            onMouseEnter={validateForm}
            onMouseLeave={handleMouseLeave}
          />
        </div>
      </form>
    </div>
  );
}

export default SignupForm;
