import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class AlertService {

    error(message: string) {
        Swal.fire({
            title: 'Oops!',
            text: message,
            icon: 'error'
          })
    }

    success(message: string) {
        Swal.fire({
            title: 'Yay!',
            text: message,
            icon: 'success'
          })

    }
}