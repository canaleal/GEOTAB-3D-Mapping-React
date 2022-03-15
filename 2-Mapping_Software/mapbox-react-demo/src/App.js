import logo from "./logo.svg";
import { Outlet, Link } from "react-router-dom";
import "./App.css";

import HelpModal from "./components/HelpModal";

import { useState, useRef, Fragment } from "react";
import Footer from "./components/Footer";

function App() {
  return (
    <Fragment>
      <nav className="bg-blue-500 color-white">
        <div className="px-5 py-5">
          <Link to="/" className="nav-item">
            <span className="text-xl weight-bold">A.I.M 3D Mapping</span>
          </Link>
          <div className="inline float-right">
            <Link to="0" className="nav-item">
              <span className="text-xl m-4 font-thin hover:text-green-400 ease-in-out duration-150">
                Kingston
              </span>
            </Link>
            <Link to="1" className="nav-item">
              <span className="text-xl m-4 font-thin hover:text-green-400 ease-in-out duration-150">
                Vancouver
              </span>
            </Link>
            <Link to="2" className="nav-item">
              <span className="text-xl m-4 font-thin hover:text-green-400 ease-in-out duration-150">
                Chicago
              </span>
            </Link>
          </div>
        </div>
      </nav>

      <Outlet />
    </Fragment>
  );
}

export default App;
