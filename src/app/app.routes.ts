import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./components/dashboard/dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'local-storage',
    loadComponent: () => import('./components/local-storage-demo/local-storage-demo.component').then(m => m.LocalStorageDemoComponent)
  },
  {
    path: 'session-storage',
    loadComponent: () => import('./components/session-storage-demo/session-storage-demo.component').then(m => m.SessionStorageDemoComponent)
  },
  {
    path: 'cookie',
    loadComponent: () => import('./components/cookie-demo/cookie-demo.component').then(m => m.CookieDemoComponent)
  },
  {
    path: 'indexeddb',
    loadComponent: () => import('./components/indexeddb-demo/indexeddb-demo.component').then(m => m.IndexedDBDemoComponent)
  },
  {
    path: 'global-state',
    loadComponent: () => import('./components/global-state-demo/global-state-demo.component').then(m => m.GlobalStateDemoComponent)
  },
  {
    path: 'storage-manager',
    loadComponent: () => import('./components/storage-manager-demo/storage-manager-demo.component').then(m => m.StorageManagerDemoComponent)
  },
  {
    path: 'encryption',
    loadComponent: () => import('./components/encryption-demo/encryption-demo.component').then(m => m.EncryptionDemoComponent)
  },
  {
    path: 'ttl',
    loadComponent: () => import('./components/ttl-demo/ttl-demo.component').then(m => m.TtlDemoComponent)
  },
  {
    path: 'cross-tab',
    loadComponent: () => import('./components/cross-tab-demo/cross-tab-demo.component').then(m => m.CrossTabDemoComponent)
  },
  {
    path: '**',
    redirectTo: ''
  }
];
