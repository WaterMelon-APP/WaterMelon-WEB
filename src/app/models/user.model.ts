export interface User {
    Id: string;
    Name: string;
    Username: string;
    Password: string;
    Email: string;
    Token: string;
    FirstName: string;
    LastName: string;
    Phone: string;
    Birthdate: Date;
    ProfilePicture: string;
    Events: Array<string>;
}