import { createDrawerNavigator, DrawerContentScrollView, DrawerItem, DrawerItemList } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";
import { ActivityIndicator } from "react-native";
import { useEffect, useState } from "react/cjs/react.production.min";
import Home from "./components/Admin/Home/Home";
import UserManagement from "./components/Admin/UserManagement/UserManagement";
import Login from "./components/User/Login";
import API, { endpoints } from "./configs/API";
import React, { useReducer } from 'react'
import MyContext from "./configs/MyContext";
import MyUserReducer from "./reducers/MyUserReducer";
import Logout from "./components/User/Logout";
import Register from "./components/User/Register";
import Schedule from "./components/Admin/Schedule/Schedule";
import SchedulePatient from "./components/Patient/Schedule/Schedule";
import RegisterSchedule from "./components/Patient/RegisterSchedule/RegisterSchedule";
import ApproveSchedule from "./components/Nurse/ApproveSchedule/ApproveSchedule";
import ScheduleNurse from "./components/Nurse/Schedule/Schedule";
import ScheduleDoctor from "./components/Doctor/Schedule/Schedule";
import PrescribeMedication from "./components/Doctor/PrescribeMedication/PrescribeMedication";
import Statistical from "./components/Admin/Statistical/Statistical";
import Payment from "./components/Nurse/Payment/Payment";

const Drawer = createDrawerNavigator();

const App = () => {
  const [user, dispatch] = useReducer(MyUserReducer, null);

  return (
    <MyContext.Provider value={[user, dispatch]}>
      <NavigationContainer>
        <Drawer.Navigator drawerContent={MyDrawerItem} screenOptions={{ headerRight: Logout }}>
          {user === null ? (
            <>
              <Drawer.Screen name="Login" options={{ title: 'Đăng nhập' }} component={Login} />
              <Drawer.Screen name="Register" options={{ title: 'Đăng ký' }} component={Register} />
            </>
          ) : (
            <>
              {user === "Admin Scope Description" && (
                <>
                  <Drawer.Screen name="Home" component={Home} options={{ title: 'Thuốc' }} />
                  <Drawer.Screen name="UserManagement" component={UserManagement} options={{ title: 'Quản lý tài khoản' }} />
                  <Drawer.Screen name="Schedule" component={Schedule} options={{ title: 'Quản lý lịch trực' }} />
                  <Drawer.Screen name="Statistical" component={Statistical} options={{ title: 'Thống kê' }} />

                </>
              )}
              {user === "Patient Scope Description" && (
                <>
                  <Drawer.Screen name="SchedulePatient" component={SchedulePatient} options={{ title: 'Đặt lịch khám bệnh' }} />
                  <Drawer.Screen name="RegisterSchedule" component={RegisterSchedule} options={{ title: 'Danh sách đặt chỗ' }} />
                </>
              )}

              {user === "Nurse Scope Description" && (
                <>
                  <Drawer.Screen name="ApproveSchedule" component={ApproveSchedule} options={{ title: 'Phê duyệt đặt chỗ' }} />
                  <Drawer.Screen name="ScheduleNurse" component={ScheduleNurse} options={{ title: 'Lịch làm việc' }} />
                  <Drawer.Screen name="Payment" component={Payment} options={{ title: 'Thanh toán' }} />
                </>
              )}

              {user === "Doctor Scope Description" && (
                <>
                  <Drawer.Screen name="ScheduleDoctor" component={ScheduleDoctor} options={{ title: 'Lịch làm việc' }} />
                  <Drawer.Screen name="PrescribeMedication" component={PrescribeMedication} options={{ title: 'Kê đơn' }} />
                </>
              )}


              <Drawer.Screen name="Profile" component={Home} options={{ title: user }} />
            </>
          )}
        </Drawer.Navigator>
      </NavigationContainer>
    </MyContext.Provider>

  )
}

const MyDrawerItem = (props) => {
  const [categories, setCategories] = React.useState(null);

  React.useEffect(() => {

  }, []);

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItemList {...props} />

    </DrawerContentScrollView>
  );
}

export default App;