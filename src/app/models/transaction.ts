import { Category } from './category';

export interface Raw{
    id : number,
    deleted? : boolean,
    tran_part ?: TRAN_PART_TYPES,
    tran_date : string,
    tran_datetime? : Date,
    amount_mnt : number ,
    description? : string ,
    account? : string,
    rec_account? : string,
    rec_name? : string,
    currency ?: string,
    tran_category? : Category

}

enum TRAN_SRC_TYPES {
    CUSTOM = "PERSON",
    FINACLE = "TBAADM",
    CARDPRO_DBTSET = "DBTSET",
    CARDPRO_LSSTMT = "LSSTMT",
    CARDPRO_CRDTRX = "CRDTRX",
    EBANK = "EBK"
}

enum TRAN_PART_TYPES {
    INCOME = "C",
    OUTCOME = "D",
    TRANSFER = "T"
}