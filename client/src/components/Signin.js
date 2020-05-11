import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { useForm } from "react-hook-form";
import {
  ToastsContainer,
  ToastsStore,
  ToastsContainerPosition,
} from "react-toasts";
import { UserContext } from "../App";

function Signin() {
  const { state, dispatch } = useContext(UserContext);
  const { register, handleSubmit, errors } = useForm();

  const history = useHistory();
  const [overlay, setOverlay] = useState(false);

  if (state) {
    history.push("/");
  }

  const onSubmit = (data) => {
    setOverlay(true);

    fetch("/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: data.email,
        password: data.password,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          ToastsStore.error(data.error);
          setOverlay(false);
        } else {
          localStorage.setItem("token", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          dispatch({ type: "USER", payload: data.user });
          ToastsStore.success("Signed In Successfully");
          history.push("/");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div className="container signin-wrapper">
      <div className="card">
        <div className="card-header">Log In</div>
        <div className="card-body">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label htmlFor="email">Email address</label>
              <input
                name="email"
                type="email"
                className="form-control shadow-none"
                id="email"
                aria-describedby="emailHelp"
                ref={register({
                  required: true,
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                    message: "Invalid email address",
                  },
                })}
              />
              {errors.email && (
                <div className="alert alert-danger" role="alert">
                  {errors.email.message === ""
                    ? "Email address required"
                    : "Invalid email address"}
                </div>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                name="password"
                type="password"
                className="form-control shadow-none"
                id="password"
                ref={register({ required: true })}
              />
              {errors.password && (
                <div className="alert alert-danger " role="alert">
                  Password is required
                </div>
              )}
            </div>
            <button type="submit" className="btn btn-primary btn-block">
              Log In
            </button>
          </form>
        </div>
        <p>
          Don't have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
      {overlay ? (
        <div className="overlay">
          <div className="spinner-border text-light spiner" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : null}

      <ToastsContainer
        store={ToastsStore}
        position={ToastsContainerPosition.TOP_CENTER}
        lightBackground
      />
    </div>
  );
}

export default Signin;
