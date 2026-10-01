import type { GreenApiCredentials } from '../types/auth';

interface HeaderProps {
    credentials: GreenApiCredentials | null;
    logout: () => void;
}

export const Header = ({ credentials, logout }: HeaderProps) => {
    return (
        <header className="bg-[#3b9702] px-6 py-3 flex justify-between items-center shadow-md">
        <div className="flex items-center gap-3">
            <h1 className="font-bold text-lg text-white">GREEN-API Chat MAX</h1>
            <span className="text-xs bg-white px-2 py-1 rounded text-[#3b9702]">
            ID: {credentials?.idInstance}
            </span>
        </div>
        <button
            onClick={logout}
            className="border border-[#3b9702] bg-white hover:bg-[#3b9702] hover:text-white hover:border-white text-sm px-3 py-1.5 rounded text-[#3b9702] transition duration-300 ease-linear cursor-pointer"
        >
            Выйти
        </button>
        </header>
    );
};