import "./App.css";
import Header from "./components/header/Header";
import Map from "./components/map/Map";
import Sidebar from "./components/sidebar/Sidebar";
import Slider from "./components/slider/Slider";


function App() {
  

  return (
    <div className="App">
      <Header></Header>
      <Sidebar></Sidebar>
      <Slider></Slider>
      {/* <Map></Map> */}
    </div>
  );
}

export default App;
