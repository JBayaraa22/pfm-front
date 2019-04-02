import Swal from 'sweetalert2'

export function makeToast(text , type){
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
      
      Toast.fire({
        type: type,
        title: text
      })
}

export enum MODAL_MODE{
  EDIT = "e",
  VIEW = "v",
}

export function maskDescription(description: string, visibleDigits: number = 4): string {
  //const visibleDigits = 4;


  return description.replace(/[a-zA-Z\d]/g, 'X');
}

export function maskAmount(amount : number) : number {
  return amount * Math.random()
}