import React, { Component, useCallback, useState, Fragment } from "react";
import * as ReactDOMClient from "react-dom/client";


import "./index.scss";
import backImg from "@/assets/back.png";
import user from "@/assets/user.png";
export interface Props {
  close?: () => void;
  open?: () => void;
  openState: boolean;
}
class Menulist extends Component {
  state = {
    openState: false,
  };
  open = () => {
    this.setState({
      openState: true,
    });
  };
  close() {
    this.setState({
      openState: false,
    });
  }
  render(): React.ReactNode {
    return (
      <div
        className="menu-wrap"
        style={
          this.state.openState ? { display: "block" } : { display: "none" }
        }
      >
        <div className="menu-list">
          <div className="menu-back">
            <img src={backImg} />
          </div>
          <div className="user">
            <img src={user} />
          </div>
        </div>
      </div>
    );
  }
}
 
const div = document.createElement('div');
const props = {
 
};
document.body.appendChild(div);
 
// const MenuLeft = React.render(React.createElement(
//     Menulist,
//   props
// ),div);
export default props
