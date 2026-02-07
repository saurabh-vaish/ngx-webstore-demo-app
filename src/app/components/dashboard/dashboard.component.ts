import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Feature {
  title: string;
  icon: string;
  description: string;
  link: string;
  color: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  features: Feature[] = [
    {
      title: 'LocalStorage',
      icon: '💾',
      description: 'Persistent browser storage with cross-tab synchronization',
      link: '/local-storage',
      color: '#667eea'
    },
    {
      title: 'SessionStorage',
      icon: '⏱️',
      description: 'Session-based storage for temporary data',
      link: '/session-storage',
      color: '#06b6d4'
    },
    {
      title: 'Cookies',
      icon: '🍪',
      description: 'HTTP cookie management with full options support',
      link: '/cookie',
      color: '#f59e0b'
    },
    {
      title: 'IndexedDB',
      icon: '🗄️',
      description: 'Large data storage for offline-first applications',
      link: '/indexeddb',
      color: '#10b981'
    },
    {
      title: 'Global State',
      icon: '🔄',
      description: 'Reactive state management with signals & observables',
      link: '/global-state',
      color: '#8b5cf6'
    },
    {
      title: 'Storage Manager',
      icon: '⚙️',
      description: 'Unified API with automatic fallback strategies',
      link: '/storage-manager',
      color: '#ec4899'
    },
    {
      title: 'Encryption',
      icon: '🔐',
      description: 'AES-GCM encryption for sensitive data',
      link: '/encryption',
      color: '#f43f5e'
    },
    {
      title: 'TTL',
      icon: '⏰',
      description: 'Time-to-live and automatic expiration',
      link: '/ttl',
      color: '#14b8a6'
    },
    {
      title: 'Cross-Tab Sync',
      icon: '🔗',
      description: 'Real-time synchronization across browser tabs',
      link: '/cross-tab',
      color: '#a855f7'
    }
  ];

  codeExample = `// Install the library
npm install ngx-webstore

// Configure in your app
import { NgxStorageManagerModule } from 'ngx-webstore';

@NgModule({
  imports: [
    NgxStorageManagerModule.forRoot({
      namespace: 'myApp',
      encryption: { enabled: true, secret: '...' }
    })
  ]
})

// Use in components
constructor(private localStorage: LocalStorageService) {}

async saveData() {
  await this.localStorage.set('user', { name: 'John' });
}`;
}
