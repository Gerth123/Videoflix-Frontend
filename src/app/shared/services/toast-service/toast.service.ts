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

  /**
   * Adds a toast to the list of toasts and automatically removes it after 4 seconds.
   * @param message The message to be displayed in the toast.
   * @param type The type of the toast. Can be 'success', 'error', 'info' or 'warning'.
   * @param buttonText The text of a button to be displayed in the toast. If not provided, no button will be shown.
   */
  show(
    message: string,
    type: 'success' | 'error' | 'info' | 'warning',
    buttonText?: string
  ) {
    const toast: Toast = { message, type, buttonText, state: 'in' }; 
    this.toasts.push(toast);
    setTimeout(() => this.remove(toast), 4000);
  }

  /**
   * Removes a toast from the list of toasts after a short delay.
   * @param toast The toast to be removed.
   */
  remove(toast: Toast) {
    toast.state = 'out'; 
    setTimeout(() => {
      this.toasts = this.toasts.filter(t => t !== toast);
    }, 500); 
  }
}
