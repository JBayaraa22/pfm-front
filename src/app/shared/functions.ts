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