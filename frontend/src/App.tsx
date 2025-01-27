import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import NewBusinessUnit from "./pages/New_Business_Unit/newBusinessUnit";
import NewSubBusinessUnit from "./pages/New_SubBusiness_Unit/newSubBusinessUnit";
import NewService from "./pages/New_Service/newService";
import ApiDetailsPage from "./pages/Api_Details/ApiDetailsPage";
import Help from "./pages/Help/HelpPage";
import MonitorService from "./pages/Monitor/MonitorService";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/"  element={<Dashboard />}></Route>
          <Route
            path="/newBusinessUnit"
            
            element={<NewBusinessUnit />}
          ></Route>
          <Route
            path="/newSubBusinessUnit"
            
            element={<NewSubBusinessUnit />}
          ></Route>
          <Route path="/newService"  element={<NewService />}></Route>
          <Route path="/monitorService"  element={<MonitorService />}></Route>
          <Route path="/api-details/:id" element={<ApiDetailsPage />} />
          <Route
            path="/help"
            
            element={<Help />}
          ></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
