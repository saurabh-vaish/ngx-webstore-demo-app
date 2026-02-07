import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

interface NavItem {
  path: string;
  label: string;
  icon: string;
  description: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'ngx-webstore Demo';
  
  navItems: NavItem[] = [
    {
      path: '/',
      label: 'Dashboard',
      icon: '🏠',
      description: 'Overview & Getting Started'
    },
    {
      path: '/local-storage',
      label: 'LocalStorage',
      icon: '💾',
      description: 'Persistent browser storage'
    },
    {
      path: '/session-storage',
      label: 'SessionStorage',
      icon: '⏱️',
      description: 'Session-based storage'
    },
    {
      path: '/cookie',
      label: 'Cookies',
      icon: '🍪',
      description: 'HTTP cookie management'
    },
    {
      path: '/indexeddb',
      label: 'IndexedDB',
      icon: '🗄️',
      description: 'Large data storage'
    },
    {
      path: '/global-state',
      label: 'Global State',
      icon: '🔄',
      description: 'Reactive state management'
    },
    {
      path: '/storage-manager',
      label: 'Storage Manager',
      icon: '⚙️',
      description: 'Unified storage API'
    },
    {
      path: '/encryption',
      label: 'Encryption',
      icon: '🔐',
      description: 'Secure data storage'
    },
    {
      path: '/ttl',
      label: 'TTL',
      icon: '⏰',
      description: 'Time-to-live & expiration'
    },
    {
      path: '/cross-tab',
      label: 'Cross-Tab Sync',
      icon: '🔗',
      description: 'Multi-tab synchronization'
    }
  ];

  sidebarOpen = true;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }
}
