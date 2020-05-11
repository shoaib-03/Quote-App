import React, { createContext, useEffect, useReducer, useContext } from "react";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";

import "./App.css";
import Navbar from "./components/Navbar";
import Welcome from "./components/Welcome";
import Home from "./components/Home";
import Explore from "./components/Explore";
import Profile from "./components/Profile";
import Signup from "./components/Signup";
import Signin from "./components/Signin";
import CreatePost from "./components/CreatePost";
import UserProfile from "./components/UserProfile";
import Settings from "./components/Settings";
import NotFound from "./components/NotFound";
import { reducer, initialState } from "./reducers/userReducer";

export const UserContext = createContext();

const Routing = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "USER", payload: user });
    } else {
      history.push("/welcome");
    }
  }, []);

  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route exact path="/welcome" component={Welcome} />
      <Route exact path="/explore" component={Explore} />
      <Route exact path="/profile" component={Profile} />
      <Route exact path="/signup" component={Signup} />
      <Route exact path="/signin" component={Signin} />
      <Route exact path="/create" component={CreatePost} />
      <Route exact path="/settings" component={Settings} />
      <Route exact path="/error" component={NotFound} />
      <Route exact path="/profile/:userId" component={UserProfile} />
      <Route component={NotFound} />
    </Switch>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Navbar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
