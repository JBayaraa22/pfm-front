export interface Budget{
    id : number,
    name : string,
    freq?: FREQ_TYPE,
    amount : number
    repeat? : boolean,
    end_date : string,
    start_date : string,
    category_id? : number,
    actual? : number,
    [key : string] : any
}

export enum FREQ_TYPE {
    MONTH = "M",
    QUARTER = "Q",
    YEAR = "Y",
    CUSTOM = "C",
}