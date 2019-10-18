/* eslint-disable react/forbid-prop-types */
import React, {Fragment, Component} from "react";
import {Route, Switch, withRouter, RouteComponentProps} from "react-router-dom";
import Helmet from "react-helmet";
import Header from "../components/documentHeader/DocumentHeader";
import NoMatch from "./noMatch/NoMatch";
import {Reservation, ReservationInfo, ReservationCheck} from "./outPages";
import HM from "./outPages/HM/HM";
import HMwrap from "./outPages/HM/HMwrap";
import {StaticContext} from "react-router";

interface IProps extends RouteComponentProps<any, StaticContext, any> {}

const OutPageRouter: React.SFC<IProps> = ({match, location}) => {
  // TODO location.search 안에 변수 있음 거기서 token 뽑아서 서버에 요청
  return (
    <Fragment>
      {/* 예약페이지 */}
      {/* http://localhost:3000/#/outpage/reservation?publickey=05dfe136-1f1e-beed-b96d-ea3d68d8b847 */}
      <Switch>
        <Route
          path="/outpage/reservation/:publickey/:agencyId?"
          component={Reservation}
        />
        <Route
          exact
          path="/outpage/checkReservation/:publickey/:transId?"
          component={ReservationCheck}
        />
        <Route
          exact
          path="/outpage/infoReservation"
          component={ReservationInfo}
        />
        <Route exact path="/outpage/HM/:publickey" component={HMwrap} />
        <Route component={NoMatch} />
      </Switch>
    </Fragment>
  );
};

export default OutPageRouter;