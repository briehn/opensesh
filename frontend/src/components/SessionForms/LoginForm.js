import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./SessionForm.css";

import { login, clearSessionErrors } from "../../store/session";

/*
  TODO:
    - ADD BETTER ERROR HANDLING
      1) INVALID EMAIL
      2) INVALID PASSWORD
      3) INVALID PASSWORD FOR EMAIL
*/

function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const errors = useSelector((state) => state.errors.session);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => {
      dispatch(clearSessionErrors());
    };
  }, [dispatch]);

  const update = (field) => {
    const setState = field === "email" ? setEmail : setPassword;
    return (e) => setState(e.currentTarget.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <div className="session-form-container">
      <form className="session-form" onSubmit={handleSubmit}>
        <h2 className="session-header">Log In</h2>
        <label>
          <input
            type="text"
            value={email}
            onChange={update("email")}
            placeholder="Email"
            className="session-input"
          />
        </label>
        <div className="errors">
          {errors?.email ? "Invalid email address" : errors?.email}
        </div>
        <label>
          <input
            type="password"
            value={password}
            onChange={update("password")}
            placeholder="Password"
            className="session-input"
          />
        </label>
        <div className="errors">
          {errors?.password ? "Invalid Password" : errors?.password}
        </div>
        <div className="button-container">
          <input className="session-b" type="submit" value="Open Your Sesh" />
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
