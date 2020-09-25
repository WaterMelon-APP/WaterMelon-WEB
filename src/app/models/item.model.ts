export interface Bring {
    Name: string;
    Quantity: number;
}

export interface Item {
    Id: string;
    Name: string;
    Quantity: number;
    Price: number;
    About: string;
    Bring: Array<Bring>;
    Pay: Array<Bring>;
    FromEvent: string;
    QuantityLeft: number;
}
