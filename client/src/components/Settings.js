import React, { useContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { UserContext } from "../App";

function Account() {
  const { state, dispatch } = useContext(UserContext);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [btnText, setBtnText] = useState("Save");
  const [emailConfirmation, setEmailConfirmation] = useState("");
  const [displayErr, setDisplayErr] = useState("none");
  const [overlay, setOverlay] = useState(false);

  const history = useHistory();

  useEffect(() => {
    setUsername(state ? state.name : "");
    setEmail(state ? state.email : "");
  }, [state]);

  const updateAccountDetails = () => {
    if (state.name === username && state.email === email) {
      return;
    } else {
      setBtnText("Saving...");
      fetch("/updateuserdetails", {
        method: "PUT",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: username,
          email,
        }),
      })
        .then((res) => res.json())
        .then((result) => {
          localStorage.setItem(
            "user",
            JSON.stringify({
              ...state,
              name: result.name,
              email: result.email,
            })
          );
          dispatch({
            type: "UPDATEUSERDETAIL",
            payload: { name: result.name, email: result.email },
          });
          setBtnText("Save");
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  // const deleteAccount = () => {
  //   if (state.email !== emailConfirmation) {
  //     setDisplayErr("block");
  //   } else {
  //     setDisplayErr("none");
  //     setOverlay(true);
  //     fetch("/deleteuser", {
  //       method: "DELETE",
  //       headers: {
  //         Authorization: "Bearer " + localStorage.getItem("token"),
  //       },
  //     })
  //       .then((res) => res.json())
  //       .then((result) => {
  //         console.log(result);
  //         localStorage.clear();
  //         dispatch({ type: "CLEAR" });
  //         history.push("/signup");
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   }
  // };

  return (
    <div className="accounts">
      <div className="accordion" id="accordionExample">
        <div className="card accordion-card">
          <div className="card-header" id="headingOne">
            <h2
              className="mb-0 toggle-btn"
              data-toggle="collapse"
              data-target="#collapseOne"
              aria-expanded="true"
              aria-controls="collapseOne"
            >
              <p>Account</p>
            </h2>
          </div>
          <div
            id="collapseOne"
            className="collapse show"
            aria-labelledby="headingOne"
            data-parent="#accordionExample"
          >
            <div className="card-body">
              <form>
                <div className="form-group">
                  <label htmlFor="name">Name</label>
                  <input
                    name="name"
                    type="text"
                    value={username}
                    className="form-control shadow-none"
                    id="name"
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email address</label>
                  <input
                    name="email"
                    type="email"
                    value={email}
                    className="form-control shadow-none"
                    id="email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  onClick={(e) => {
                    e.preventDefault();
                    updateAccountDetails();
                  }}
                >
                  {btnText}
                </button>
              </form>
            </div>
          </div>
        </div>
        {/* <div className="card accordion-card">
          <div className="card-header" id="headingTwo">
            <h2
              className="mb-0 toggle-btn"
              data-toggle="collapse"
              data-target="#collapseTwo"
              aria-expanded="false"
              aria-controls="collapseTwo"
            >
              <p>Advanced</p>
            </h2>
          </div>
          <div
            id="collapseTwo"
            className="collapse"
            aria-labelledby="headingTwo"
            data-parent="#accordionExample"
          >
            <div className="card-body">
              <div className="card-body">
                <p>Hi {state ? state.name : ""},</p>
                <p>
                  We're sorry that you want to delete your account. Keep in mind
                  you will not be able to reactivate your account or retrieve
                  any of the content or information you have added.
                </p>
                <p>
                  Please enter the email address exactly as it appears here to
                  confirm your account deletion.
                </p>
                <p style={{ textAlign: "center", fontWeight: "bold" }}>
                  {state ? state.email : ""}
                </p>
                <div className="form-group">
                  <p
                    className="alert alert-danger"
                    style={{ textAlign: "center", display: displayErr }}
                  >
                    Email not matched
                  </p>
                  <input
                    name="email"
                    type="email"
                    value={emailConfirmation}
                    className="form-control shadow-none"
                    onChange={(e) => setEmailConfirmation(e.target.value)}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary btn-block"
                  onClick={(e) => {
                    e.preventDefault();
                    deleteAccount();
                  }}
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      */}
      </div>
      {overlay ? (
        <div className="overlay">
          <div className="spinner-border text-light spiner" role="status">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default Account;
