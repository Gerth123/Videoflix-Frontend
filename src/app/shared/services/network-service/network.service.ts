import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class NetworkService {

  getNetworkSpeed(): string {
    if ('connection' in navigator) {
      const connection = (navigator as any).connection;
      const downlink = connection.downlink;

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
