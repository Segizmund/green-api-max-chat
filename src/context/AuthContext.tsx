import { createContext, useContext, useState, type ReactNode } from 'react';
import type { GreenApiCredentials, AuthContextType } from '../types/auth';
import { greenApiAxios } from '../api/axiosClient';

const STORAGE_KEY = 'green_api_credentials';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [credentials, setCredentials] = useState<GreenApiCredentials | null>(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (!saved) return null;
        try {
            return JSON.parse(saved);
        } catch {
            localStorage.removeItem(STORAGE_KEY);
            return null;
        }
    });

    const login = async (data: GreenApiCredentials): Promise<boolean> => {
        try {
            await greenApiAxios.get(
                `/waInstance${data.idInstance}/getStateInstance/${data.apiTokenInstance}`
            );

            setCredentials(data);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
            return true;
            } catch (error) {
                console.error('Ошибка авторизации:', error);
                alert('Не удалось подключиться. Проверьте idInstance и apiTokenInstance.');
                return false;
            }
    };

    const logout = () => {
        setCredentials(null);
        localStorage.removeItem(STORAGE_KEY);
    };

    return (
        <AuthContext.Provider
        value={{
            credentials,
            login,
            logout,
            isAuthenticated: !!credentials,
        }}
        >
        {children}
        </AuthContext.Provider>
    );
    };

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth доступен только внутри AuthProvider');
    }
    return context;
};