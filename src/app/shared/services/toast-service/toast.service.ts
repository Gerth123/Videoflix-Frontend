import { Injectable } from '@angular/core';

interface Toast {
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  buttonText?: string;
  state?: 'in' | 'out';
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor() {}

  toasts: Toast[] = [];

  show(
    message: string,
    type: 'success' | 'error' | 'info' | 'warning',
    buttonText?: string
  ) {
    const toast: Toast = { message, type, buttonText, state: 'in' }; 
    this.toasts.push(toast);
    setTimeout(() => this.remove(toast), 4000);
  }

  remove(toast: Toast) {
    toast.state = 'out'; 
    setTimeout(() => {
      this.toasts = this.toasts.filter(t => t !== toast);
    }, 500); 
  }
}
