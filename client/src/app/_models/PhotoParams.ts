import { User } from "./user";

export class PhotoParams {
    currentUsername: string;
    pageNumber = 1;
    pageSize = 5;

    constructor(user: User){
        this.currentUsername = user.username;
    }
}