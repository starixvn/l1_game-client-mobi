export interface Session {
    isAuthenticated: boolean;
    username: string;
    language: string;
    ss: string;
}

export interface ReCheckInResponse extends BaseResponse {
    balance: number;
    isDisableAccount: boolean;
}

export interface AuthorizeResponse extends BaseResponse {
    authorized: boolean;
    user: User;
}

export interface SignNameResponse extends BaseResponse {
    user: User;
}

export interface BaseResponse {
    isSuccessful: boolean;
    message: string;
}

export interface User {
    UID: number;
    avatarId: number;
    currency: string;
    name: string;
    red: number;
}
