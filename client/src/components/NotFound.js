import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { UserContext } from "../App";

function NotFound() {
  const { state, dispatch } = useContext(UserContext);
  return (
    <div className="not-found-wrapper">
      <h1 className="not-found-text">Oops! Something went wrong!</h1>
      <Link
        className="btn btn-primary not-found-btn shadow-none"
        to={state ? "/" : "/welcome"}
      >
        Return to Home
      </Link>
    </div>
  );
}

export default NotFound;
