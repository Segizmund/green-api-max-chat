export interface GreenApiCredentials {
    idInstance: string;
    apiTokenInstance: string;
}

export interface LoginResult {
    ok: boolean;
    error?: string;
}

export interface AuthContextType {
    credentials: GreenApiCredentials | null;
    login: (credentials: GreenApiCredentials) => Promise<LoginResult>;
    logout: () => void;
    isAuthenticated: boolean;
}