import { ValidatorFn, AbstractControl } from '@angular/forms';

export function FcDateValidator(date : string) : ValidatorFn{
    return (control : AbstractControl): {[key:string]:any } | any =>{
        return null
    }
}