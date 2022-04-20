import React from "react";
import { render } from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";

import Error from "./pages/error/Error";
import reportWebVitals from "./reportWebVitals";

import SelectCityPage from "./pages/selectCity/SelectCityPage";


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
  faRoad,
  faTree,
  faPersonWalking,
} from "@fortawesome/free-solid-svg-icons";
import KingstonHome from "./pages/page_kingston/KingstonHome";
import ChicagoHome from "./pages/page_chicago/ChicagoHome";
import VancouverHome from "./pages/page_vancouver/VancouverHome";
import FranceHome from "./pages/page_france/FranceHome";



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
  faPersonWalking,
  faTree,
  faPlay,
  faPause
);

const rootElement = document.getElementById("root");

render(
  <BrowserRouter>
    <Routes>
      <Route exact path="/" element={<App />}>
        <Route index element={<SelectCityPage/>} />
        <Route path="/Kingston" element={<KingstonHome/>} />
        <Route path="/Chicago" element={<ChicagoHome/>} />
        <Route path="/Vancouver" element={<VancouverHome/>} />
        <Route path="/France" element={<FranceHome/>} />
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
