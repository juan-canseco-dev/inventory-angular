export interface SignInRequest {
    email: string;
    password: string;
};

export interface JwtResponse {
    token: string;
};

export interface UserDetails {
    id: string;
    fullName: string;
    email: string;
    permissions: string[];
};
