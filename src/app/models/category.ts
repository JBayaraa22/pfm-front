export interface Category{
    id : number , 
    name : string ,
    part : PARTS ,
    translate? : boolean
    parent? : number,
    children ? : Category[] ,
    icon ? : string

}

export enum PARTS {
    INCOME = "C",
    OUTCOME = "D",
    TRANSFER = "T"
}