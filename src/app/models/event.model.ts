export class Event {
    Id: string;
    Name: string;
    Owner: string;
    Date: Date;
    Address: string;
    Guests: Array<string>;
    Public: boolean;
    ItemList: Array<string>;
    InvitationList: Array<string>;
}
