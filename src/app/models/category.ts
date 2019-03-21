export interface Category{
    id : number , 
    name : string ,
    part : PARTS ,
    translate? : boolean
    parent? : Category
}

enum PARTS {
    INCOME = "C",
    OUTCOME = "D",
}