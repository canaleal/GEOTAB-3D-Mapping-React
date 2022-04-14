import { Outlet, Link } from "react-router-dom";
import "./App.css";
import { Fragment } from "react";
import Footer from "./components/Footer";
import Header from "./components/Header";


function App() {
  return (
    <Fragment >
     

      <Outlet />

      <Footer />
    </Fragment>
  );
}

export default App;
