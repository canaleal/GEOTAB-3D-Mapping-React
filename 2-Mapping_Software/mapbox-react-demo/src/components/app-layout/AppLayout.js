import { Layout, Menu, Breadcrumb, Radio } from "antd";
import { GiWalk } from "react-icons/gi";
import Map from "../map/Map";
import { useState } from "react";
import { MdDirectionsBike } from "react-icons/md";
import { IoIosCar } from "react-icons/io";

const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

const AppLayout = () => {
  const [civFilter, setCivFilter] = useState();
  const [pedestrianFilter, setPedestrianFilter] = useState();

  const handleCivFilterChange = (e) => {
    setCivFilter(e.target.value);
  };

  const handlePedestrianFilterChange = (e) => {
    setPedestrianFilter(e.target.value);
  };

  const pedestrianOptions = [];
  return (
    <Layout className="h-screen">
      <Header className="">
        <div></div>
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1">Civilians</Menu.Item>
          <Menu.Item key="2">Road Conditions</Menu.Item>
        </Menu>
      </Header>
      <Layout>
        <Sider width={300} className="p-2" theme="light">
          <div className="border-2 rounded-md p-3">
            <Radio.Group
              optionType="button"
              buttonStyle="solid"
              value={civFilter}
              onChange={handleCivFilterChange}
              style={{ display: "flex" }}
            >
              <Radio.Button value="pedestrian" className="grow text-center">
                <GiWalk className="inline" />
              </Radio.Button>
              <Radio.Button value="bike" className="grow text-center">
                <MdDirectionsBike className="inline" />
              </Radio.Button>
              <Radio.Button value="traffic" className="grow text-center">
                <IoIosCar className="inline" />
              </Radio.Button>
              <Radio.Button value="all" className="grow text-center">
                All
              </Radio.Button>
            </Radio.Group>

            <div className="mt-2">
              <Radio.Group
                defaultValue={"All"}
                buttonStyle="solid"
                value={pedestrianFilter}
                onChange={handlePedestrianFilterChange}
                style={{ display: "flex" }}
              >
                <Radio.Button value="Crossing" className="grow text-center">
                  Crossing
                </Radio.Button>
                <Radio.Button value="Jaywalking" className="grow text-center">
                  Jaywalking
                </Radio.Button>
                <Radio.Button value="All" className="grow text-center">
                  All
                </Radio.Button>
              </Radio.Group>
            </div>
          </div>

          <div className="border-2 mt-2 rounded-md p-3">
            <img alt="chart" src={require("../../images/pedestrian.png")}></img>
          </div>
        </Sider>
        <Layout className="pl-5 pt-5">
          <Content className="">
            <Map />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
