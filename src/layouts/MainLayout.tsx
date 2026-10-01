import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Header } from '../components/Header';

export const MainLayout = () => {
    const { isAuthenticated, credentials, logout } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="h-screen flex flex-col bg-slate-50">
        <Header
            credentials={credentials}
            logout={logout}
        />

        <main className="flex-1 flex overflow-hidden">
            <Outlet />
        </main>
        </div>
    );
};