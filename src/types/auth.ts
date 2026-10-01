export interface GreenApiCredentials {
    idInstance: string;
    apiTokenInstance: string;
}

export interface AuthContextType {
    credentials: GreenApiCredentials | null;
    login: (credentials: GreenApiCredentials) => Promise<boolean>;
    logout: () => void;
    isAuthenticated: boolean;
}