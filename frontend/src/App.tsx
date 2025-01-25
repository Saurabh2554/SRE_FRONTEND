import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard/Dashboard.tsx';
import NewBusinessUnit from './pages/New_Business_Unit/newBusinessUnit.tsx';
import NewSubBusinessUnit from './pages/New_SubBusiness_Unit/newSubBusinessUnit.tsx';
import NewService from './pages/New_Service/newService.tsx';
import ApiDetailsPage from './pages/Api_Details/ApiDetailsPage.tsx';
import Help from './pages/Help/HelpPage.tsx';
import MonitorService from './pages/Monitor/MonitorService.tsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/newBusinessUnit" element={<NewBusinessUnit />} />
        <Route path="/newSubBusinessUnit" element={<NewSubBusinessUnit />} />
        <Route path="/newService" element={<NewService />} />
        <Route path="/monitorService" element={<MonitorService />} />
        <Route path="/api-details/:id" element={<ApiDetailsPage />} />
        <Route path="/help" element={<Help />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
