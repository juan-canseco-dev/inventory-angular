export interface SignInRequest {
    email: string;
    password: string;
};

export interface JwtResponse {
    token: string;
};
