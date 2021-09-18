import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter as Router, Switch, Redirect } from "react-router-dom";
import { startCheking } from "../actions/auth";
import { LoginScreen } from "../components/auth/LoginScreen";
import { CalendarScreen } from "../components/calendar/CalendarScreen";
import { PrivateRoutes } from "./PrivateRoutes";
import { PublicRoutes } from "./PublicRoutes";

export const AppRouter = () => {
  //llamar al startCheking del action /auth para que se ejecute
  const dispatch = useDispatch();
  const { checking, uid } = useSelector((state) => state.auth);
  useEffect(() => {
    dispatch(startCheking());
  }, [dispatch]);
  if (checking) {
    return <h5>ESPERE ...</h5>;
  }

  return (
    <Router>
      <div>
        <Switch>
          <PublicRoutes
            exact
            path="/login"
            component={LoginScreen}
            isLoggedIn={!!uid}
          />
          <PrivateRoutes
            exact
            path="/"
            component={CalendarScreen}
            isLoggedIn={!!uid}
          />
          <Redirect to="/" />
        </Switch>
      </div>
    </Router>
  );
};
