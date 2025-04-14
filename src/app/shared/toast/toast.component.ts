import { Component } from '@angular/core';
import { ToastService } from '../services/toast-service/toast.service';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-toast',
  imports: [NgFor, NgClass, NgIf],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.scss',
  animations: [
    trigger('slideInOut', [
      state('in', style({ transform: 'translateX(0)', opacity: 1 })),
      state('out', style({ transform: 'translateX(100%)', opacity: 0 })),
      transition('out => in', [
        style({ transform: 'translateX(100%)', opacity: 0 }),
        animate('0.5s ease-out')
      ]),
      transition('in => out', [
        animate('0.5s ease-in', style({ transform: 'translateX(100%)', opacity: 0 }))
      ])
    ])
  ]
})
  export class ToastComponent {
    constructor(public toastService: ToastService) {}

    /**
     * Hides the toast component and removes it from the list of toasts after 500ms.
     * @param toast The toast to be removed.
     */
    hideToast(toast: any) {
      toast.state = 'out'; 
      setTimeout(() => {
        this.toastService.remove(toast); 
      }, 500); 
    }
}
