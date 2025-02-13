import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class AlertService {

    error(message: string, seconds: number) {
        Swal.fire({
            position: "top-end",
            text: message,
            icon: 'error',
            toast: true,
            showConfirmButton: false,
            timer: seconds*1000,
            timerProgressBar: true
          })
    }

    success(message: string, seconds: number) {
        Swal.fire({
            position: "top-end",
            text: message,
            icon: 'success',
            toast: true,
            showConfirmButton: false,
            timer: seconds*1000,
            timerProgressBar: true
          })

    }
}