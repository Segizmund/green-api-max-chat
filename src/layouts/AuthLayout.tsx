import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AuthLayout = () => {
    const { isAuthenticated } = useAuth();

    if (isAuthenticated) {
        return <Navigate to="/chat" replace />;
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
            <Outlet />
        </div>
        </div>
    );
};