import { Outlet, Link } from "react-router-dom";
import "./App.css";
import { Fragment } from "react";


function App() {
  return (
    <Fragment>
      <nav className="bg-sky color-white">
        <div className="px-5 py-2">
          <Link to="/" className="nav-item">
            <span className="text-xl weight-bold">A.I.M 3D Mapping</span>
          </Link>

        </div>
      </nav>

      <Outlet />
    </Fragment>
  );
}

export default App;
