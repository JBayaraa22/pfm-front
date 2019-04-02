import { Category } from './category';

export interface Raw{
    id : number,
    deleted? : boolean,
    tran_part ?: TRAN_PART_TYPES,
    tran_date : string,
    tran_datetime? : string,
    amount_mnt : number ,
    description? : string ,
    account_id? : number,
    cpty_account? : string,
    cpty_name? : string,
    tran_category? : any,
    tran_src : TRAN_SRC_TYPES

}

export enum TRAN_SRC_TYPES {
    CUSTOM = "PERSON",
    FINACLE = "TBAADM",
    CARDPRO_DBTSET = "DBTSET",
    CARDPRO_LSSTMT = "LSSTMT",
    CARDPRO_CRDTRX = "CRDTRX",
    EBANK = "EBK"
}

export enum TRAN_PART_TYPES {
    INCOME = "C",
    OUTCOME = "D",
    TRANSFER = "T"
}