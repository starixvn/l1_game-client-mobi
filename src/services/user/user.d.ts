export interface SignInResponse {
    isAuthenticated: boolean;
    username: string;
    language: string;
    ss: string;
}

export interface ReCheckInResponse {
    isSuccessful: boolean;
    message: string;
    balance: number;
    isDisableAccount: boolean;
}

export interface AuthorizeResponse {
    isSuccessful: boolean;
    message: string;
    authorized: boolean;
    user: any;
}

export interface SignNameResponse {
    isSuccessful: boolean;
    message: string;
    user: any;
}
