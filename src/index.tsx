if (!String.prototype.repeat) {
  // @ts-ignore
  window.isOldBorwesr = true;
  String.prototype.repeat = function(count) {
    "use strict";
    if (this == null)
      throw new TypeError("can't convert " + this + " to object");

    var str = "" + this;
    // To convert string to integer.
    count = +count;
    // Check NaN
    if (count != count) count = 0;

    if (count < 0) throw new RangeError("repeat count must be non-negative");

    if (count == Infinity)
      throw new RangeError("repeat count must be less than infinity");

    count = Math.floor(count);
    if (str.length == 0 || count == 0) return "";

    // Ensuring count is a 31-bit integer allows us to heavily optimize the
    // main part. But anyway, most current (August 2014) browsers can't handle
    // strings 1 << 28 chars or longer, so:
    if (str.length * count >= 1 << 28)
      throw new RangeError(
        "repeat count must not overflow maximum string size"
      );

    var maxCount = str.length * count;
    count = Math.floor(Math.log(count) / Math.log(2));
    while (count) {
      str += str;
      count--;
    }
    str += str.substring(0, maxCount - str.length);
    return str;
  };
}
import "babel-polyfill";
import "react-app-polyfill/ie9";
import "react-app-polyfill/ie11";
/* eslint-disable */
import React from "react";
import "whatwg-fetch";
import dotenv from "dotenv";
import ReactDOM from "react-dom";
import "./style_config/main.scss";
import App from "./App";
// @ts-ignore
import { registerObserver } from "react-perf-devtool";

dotenv.config({
  path: "../.env"
});

registerObserver();
ReactDOM.render(<App />, document.getElementById("root"));
