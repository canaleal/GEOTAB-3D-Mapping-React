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

  const pedestrianOptions = [
    { label: "Jaywalking", value: "Jaywalking" },
    { label: "Crossing", value: "Crossing" },
    { label: "All", value: "All" },
  ];
  return (
    <Layout className="h-screen">
      <Header className="">
        {/* <div className="logo" /> */}
        <Menu theme="dark" mode="horizontal" defaultSelectedKeys={["1"]}>
          <Menu.Item key="1">Civilians</Menu.Item>
          <Menu.Item key="2">Road Conditions</Menu.Item>
        </Menu>
      </Header>
      <Layout>
        <Sider width={300} className="p-2" theme="light">
          <div>
            <Radio.Group
              optionType="button"
              buttonStyle="solid"
              value={civFilter}
              onChange={handleCivFilterChange}
            >
              <Radio.Button value="pedestrian">
                <GiWalk className="inline" />
              </Radio.Button>
              <Radio.Button value="bike">
                <MdDirectionsBike className="inline" />
              </Radio.Button>
              <Radio.Button value="traffic">
                <IoIosCar className="inline" />
              </Radio.Button>
              <Radio.Button value="all">All</Radio.Button>
            </Radio.Group>
            <Radio.Group optionType="button" buttonStyle="solid"></Radio.Group>
            <Radio.Group
              options={pedestrianOptions}
              optionType="button"
              buttonStyle="solid"
              value={pedestrianFilter}
              onChange={handlePedestrianFilterChange}
            ></Radio.Group>
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
