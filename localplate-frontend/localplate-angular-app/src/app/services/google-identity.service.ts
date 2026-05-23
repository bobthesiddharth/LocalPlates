import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GoogleIdentityService {
  private scriptPromise?: Promise<void>;

  loadScript(): Promise<void> {
    if (typeof window !== 'undefined' && (window as any).google?.accounts?.id) {
      return Promise.resolve();
    }

    if (!this.scriptPromise) {
      this.scriptPromise = new Promise<void>((resolve, reject) => {
        const existing = document.querySelector('script[data-google-gis="true"]') as HTMLScriptElement | null;
        if (existing) {
          existing.addEventListener('load', () => resolve(), { once: true });
          existing.addEventListener('error', () => reject(new Error('Failed to load Google Identity Services.')), { once: true });
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        script.defer = true;
        script.dataset['googleGis'] = 'true';
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Failed to load Google Identity Services.'));
        document.head.appendChild(script);
      });
    }

    return this.scriptPromise;
  }

  async renderButton(
    container: HTMLElement,
    clientId: string,
    onCredential: (credential: string) => void,
    text: 'continue_with' | 'signin_with' | 'signup_with' = 'continue_with'
  ): Promise<void> {
    if (!clientId) {
      throw new Error('Google client ID is not configured.');
    }

    await this.loadScript();
    const googleApi = (window as any).google;
    if (!googleApi?.accounts?.id) {
      throw new Error('Google Identity Services is unavailable.');
    }

    container.innerHTML = '';
    googleApi.accounts.id.initialize({
      client_id: clientId,
      callback: (response: any) => {
        if (response?.credential) {
          onCredential(response.credential);
        }
      }
    });

    googleApi.accounts.id.renderButton(container, {
      theme: 'outline',
      size: 'large',
      shape: 'pill',
      width: Math.max(280, container.clientWidth || 320),
      text
    });
  }
}

