import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import MainLayout from './components/layouts/MainLayout';

// Components
import RoleProtectedRoute from './components/common/RoleProtectedRoute';

// Pages
import Dashboard from './pages/dashboard/Dashboard';
import Stock from './pages/stock/Stock';
import MoveHistory from './pages/history/MoveHistory';
import Receipts from './pages/operations/Receipts';
import Deliveries from './pages/operations/Deliveries';
import Transfers from './pages/operations/Transfers';
import Settings from './pages/settings/Settings';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        
        {/* Dashboard - All authenticated users */}
        <Route path="dashboard" element={<Dashboard />} />
        
        {/* Stock */}
        <Route path="stock" element={<Stock />} />
        <Route path="products" element={<Stock />} />
        
        {/* Operations - All authenticated users */}
        <Route path="operations/receipts" element={<Receipts />} />
        <Route path="operations/deliveries" element={<Deliveries />} />
        <Route path="operations/transfers" element={<Transfers />} />
        
        {/* Move History */}
        <Route path="history" element={<MoveHistory />} />
        <Route path="inventory/ledger" element={<MoveHistory />} />
        
        {/* Settings */}
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* Unauthorized Page */}
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* 404 */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}

export default App;

