import React from "react";
import { render } from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";

import Home from "./pages/home/Home.js";
import Error from "./pages/error/Error.js";
import reportWebVitals from "./reportWebVitals";

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
  faPlay,
  faPause,
} from "@fortawesome/free-solid-svg-icons";
import LayerButton from "./pages/home/components/layer/LayerButton";

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
  faPlay,
  faPause
);

const rootElement = document.getElementById("root");
const UniqComponent = () => {
  const uniqId = Math.floor(Math.random(1000)); // may be carId
  return <div key={uniqId} />
}
render(
  <BrowserRouter>
    <Routes>
      <Route exact path="/" element={<App />}>
        <Route index element={<Home />} />
        <Route path=":cityId" element={<Home />} />
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
