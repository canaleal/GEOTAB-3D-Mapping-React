import React from "react";
import { render } from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";

import Home from "./pages/home/Home.js";
import Error from "./pages/error/Error.js";
import reportWebVitals from "./reportWebVitals";

import SelectCity from "./pages/selectCity/SelectCity";


//Import font awesome and some icons
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faLayerGroup,
  faX,
  faPlus,
  faBuilding,
  faBorderAll,
  faPerson,
  faBus,
  faBuildingColumns,
  faHelmetSafety,
  faPlay,
  faPause,
  faCamera,
  faRoad
} from "@fortawesome/free-solid-svg-icons";
import KingstonHome from "./pages/home/KingstonHome";
import ChicagoHome from "./pages/home/ChicagoHome";
import VancouverHome from "./pages/home/VancouverHome";



//Add the icons to the library so they can be used in ever single component
library.add(
  faLayerGroup,
  faX,
  faPlus,
  faBuilding,
  faBorderAll,
  faPerson,
  faBus,
  faBuildingColumns,
  faCamera,
  faRoad,
  faHelmetSafety,
  faPlay,
  faPause
);

const rootElement = document.getElementById("root");

render(
  <BrowserRouter>
    <Routes>
      <Route exact path="/" element={<App />}>
        <Route index element={<SelectCity/>} />
        <Route path="/Kingston" element={<KingstonHome/>} />
        <Route path="/Chicago" element={<ChicagoHome/>} />
        <Route path="/Vancouver" element={<VancouverHome/>} />
        <Route path=":cityId" element={<Home/>} />
        <Route path="*" element={<Error />} />
      </Route>
    </Routes>
  </BrowserRouter>,
  rootElement
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
