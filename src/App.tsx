/* eslint-disable no-shadow */
import React, { useEffect } from "react";
import { ApolloProvider } from "react-apollo";
import { HashRouter as Router, Route, Switch } from "react-router-dom";
// @ts-ignore
import Favicon from "react-favicon";
import client from "./apollo/apolloClient";
import DocumentRouter from "./pages/documents/DocumentRouter";
import OutPageRouter from "./pages/outPages/OutPageRouter";
import NoMatch from "./pages/noMatch/NoMatch";
import BookingHostRouter from "./pages/bookingHost/BookingHostRouter";
import JDtoast from "./atoms/toast/Toast";
import "./lib/wave/wave"; // 웨이브 이펙트
import "./lib/wave/wave.scss";
import { useLang } from "./hooks/hook";
import { globalLanguageSetting } from "./utils/globalLagnSet";
import $ from "jquery";

function App() {
  const langHook = useLang("kr");

  globalLanguageSetting();

  useEffect(() => {
    const versionToggle = (e: any) => {
      if (e.altKey && e.ctrlKey && e.key === "v") {
        $("#JDversion").toggle();
      }
    };

    document.addEventListener("keydown", versionToggle);
    return () => {
      document.removeEventListener("keydown", versionToggle);
    };
  });

  <div onKeyDown={e => {}}></div>;

  return (
    <div id="JDoutWrapper">
      <ApolloProvider client={client}>
        <Favicon url="https://res.cloudinary.com/stayjanda-com/image/upload/v1554092565/favicon.ico" />
        <Router>
          <Switch>
            {/* 상위 컴포넌트 영향에벋어날수 없다. */}
            <Route
              path="/documents"
              render={prop => <DocumentRouter {...prop} />}
            />
            <Route
              path="/outpage/:token"
              render={prop => <OutPageRouter {...prop} />}
            />
            {["/"].map(path => (
              <Route
                key={`router${path}`}
                path={path}
                render={() => <BookingHostRouter langHook={langHook} />}
              />
            ))}
            <Route component={NoMatch} />
          </Switch>
        </Router>
        <JDtoast />
        <div
          style={{
            display: "none",
            position: "fixed",
            right: "2%",
            bottom: "1%"
          }}
          id="JDversion"
          className="JDtextColor--placeHolder"
        >
          1.1.0 Last Update 2019.11.21.
        </div>
        <div id="JDpreloaderPortal" />
        {/* for old borwser */}
        <div id="outdated" />
      </ApolloProvider>
    </div>
  );
}
export default App;
