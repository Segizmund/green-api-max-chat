import { useState, type SubmitEvent } from 'react';
import { useAuth } from '../context/AuthContext';

export const LoginPage = () => {
    const { login } = useAuth();
    const [idInstance, setIdInstance] = useState('');
    const [apiTokenInstance, setApiTokenInstance] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: SubmitEvent) => {
        e.preventDefault();
        if (!idInstance.trim() || !apiTokenInstance.trim()) return;

        setIsLoading(true);
        await login({ idInstance: idInstance.trim(), apiTokenInstance: apiTokenInstance.trim() });
        setIsLoading(false);
    };

    return (
        <div>
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Авторизация</h2>
        <p className="text-sm text-slate-500 mb-6">
            Введите idInstance и apiTokenInstance
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                ID INSTANCE
            </label>
            <input
                type="text"
                required
                placeholder="1101000000"
                value={idInstance}
                onChange={(e) => setIdInstance(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            </div>

            <div>
            <label className="block text-xs font-semibold text-slate-600 uppercase mb-1">
                API TOKEN INSTANCE
            </label>
            <input
                type="password"
                required
                placeholder="apiTokenInstance"
                value={apiTokenInstance}
                onChange={(e) => setApiTokenInstance(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            </div>

            <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-[#3b9702] hover:bg-[#327e02] text-white font-medium rounded-lg transition cursor-pointer disabled:opacity-50 mt-2"
            >
            {isLoading ? 'Проверка...' : 'Войти'}
            </button>
        </form>
        </div>
    );
};