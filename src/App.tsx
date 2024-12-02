import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CustomerView from './components/CustomerView';
import KitchenDashboard from './components/KitchenDashboard';
import Layout from './components/Layout';
import LandingPage from './components/LandingPage';
import { OrderProvider } from './contexts/OrderContext';

function App() {
  return (
      <BrowserRouter>
        <OrderProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<LandingPage />} />
              <Route path="/table/:tableId" element={<CustomerView />} />
              <Route path="/kitchen" element={<KitchenDashboard />} />
            </Route>
          </Routes>
        </OrderProvider>
      </BrowserRouter>
    
  );
}

export default App;