export interface CustomAccount{
    id? : number,
    main_flg? : boolean,
    visible_flg? : boolean,
    permit_flg? : boolean,
    acct : {
        id ? : number ,
        acct_num : string,
        active_flg? : boolean,
        acct_code : string,
        acct_type : string 
    } 
}