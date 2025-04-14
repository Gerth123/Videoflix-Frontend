import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  /**
   * Returns the recommended video quality based on the user's network speed
   *
   * @returns a string representing the recommended video quality (e.g. '144p', '240p', '360p', '480p', '720p', '1080p', or 'auto')
   */
  getNetworkSpeed(): string {
    const connection = (navigator as any).connection;
    const downlink = connection?.downlink;
    if (downlink !== undefined) {
      if (downlink < 0.5) return '144p';
      if (downlink < 1) return '240p';
      if (downlink < 2.5) return '360p';
      if (downlink < 4) return '480p';
      if (downlink < 8) return '720p';
      return '1080p';
    }
    return 'auto';
  }  
}
