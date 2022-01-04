export interface User {
    username: string;
    email: string;
    token: string;
    photoUrl: string;
    knownAs: string;
    gender: string;
    roles: string[];
    emailConfirmed: boolean;
}