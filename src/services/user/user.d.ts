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
    user: any;
}

export interface SignNameResponse extends BaseResponse {
    user: any;
}

export interface BaseResponse {
    isSuccessful: boolean;
    message: string;
}
