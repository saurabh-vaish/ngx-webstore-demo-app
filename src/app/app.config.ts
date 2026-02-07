import { ApplicationConfig, provideZoneChangeDetection, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { NgxWebStoreModule } from 'ngx-webstore';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    importProvidersFrom(
      NgxWebStoreModule.forRoot({
        namespace: 'demo-app',
        defaultStorage: 'localStorage',
        encryption: {
          enabled: true,
          secret: 'demo-secret-key-change-in-production-!@#$%',
          keyDerivationIterations: 100000
        },
        indexedDB: {
          dbName: 'demo-app-db',
          storeName: 'demo-storage',
          version: 1
        },
        cookie: {
          path: '/',
          secure: true,
          sameSite: 'Lax'
        }
      })
    )
  ]
};
