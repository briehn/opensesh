import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import "./SessionForm.css";

import { login, clearSessionErrors } from "../../store/session";

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
        <h2 className="session-header">Log In Form</h2>
        <label>
          <div>Email</div>
          <input
            type="text"
            value={email}
            onChange={update("email")}
            placeholder="Email"
          />
        </label>
        <div className="errors">{errors?.email}</div>
        <label>
          <div>Password</div>
          <input
            type="password"
            value={password}
            onChange={update("password")}
            placeholder="Password"
          />
        </label>
        <div className="errors">{errors?.password}</div>
        <div className="button-container">
          <input className="session-b" type="submit" value="Log In" />
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
