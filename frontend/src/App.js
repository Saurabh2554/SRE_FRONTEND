import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import NewBusinessUnit from "./pages/New_Business_Unit/newBusinessUnit";
import NewSubBusinessUnit from "./pages/New_SubBusiness_Unit/newSubBusinessUnit";
import NewService from "./pages/New_Service/newService";
function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" exact element={<Dashboard />}></Route>
          <Route
            path="/newBusinessUnit"
            exact
            element={<NewBusinessUnit />}
          ></Route>
          <Route
            path="/newSubBusinessUnit"
            exact
            element={<NewSubBusinessUnit />}
          ></Route>
          <Route path="/newService" exact element={<NewService />}></Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
