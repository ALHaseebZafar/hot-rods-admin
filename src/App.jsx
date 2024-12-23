import React from 'react';
import { BrowserRouter,Route, Routes } from 'react-router-dom';
import Layout from './pages/layout';
import Professionals from './pages/Professionals';
import Services from './pages/Services';
import Dashboard from './pages/Dashboard';
import  Appointment  from './pages/Appointment';
import OrderSummary from './pages/OrderSummary';
import Inquire from './pages/Inquire';
import Contactus from './pages/Contactus';
import ShopTiming from './pages/ShopTiming';
function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />  {/* Default route */}
        <Route path="/services" element={<Services />} />  {/* Default route */}
        <Route path="/professionals" element={<Professionals />} />  {/* Default route */}
        <Route path='/appointments' element={<Appointment/>}/>
        <Route path='/ordersummary' element={<OrderSummary/>}/>
        <Route path='/inquiry'element={<Inquire/>}/>
        <Route path='/contactus' element={<Contactus/>}/>
        <Route path='/shoptiming'element={<ShopTiming/>}/>
      </Routes>
    </Layout>
  );
}

export default App;
