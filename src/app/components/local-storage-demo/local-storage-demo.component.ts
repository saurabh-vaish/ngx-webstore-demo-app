import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LocalStorageService } from 'ngx-webstore';
import { Subscription } from 'rxjs';

interface StorageItem {
  key: string;
  value: any;
  encrypted?: boolean;
  ttl?: number;
}

@Component({
  selector: 'app-local-storage-demo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './local-storage-demo.component.html',
  styleUrls: ['./local-storage-demo.component.css']
})
export class LocalStorageDemoComponent implements OnInit, OnDestroy {
  // Form inputs
  newKey = '';
  newValue = '';
  newTTL = '';
  encryptData = false;
  
  // Data display
  storageItems: StorageItem[] = [];
  allKeys: string[] = [];
  watchKey = '';
  watchedValue: any = null;
  
  // Status
  isAvailable = false;
  lastError = '';
  
  private watchSubscription?: Subscription;

  constructor(private localStorage: LocalStorageService) {}

  async ngOnInit() {
    this.isAvailable = this.localStorage.isAvailable;
    await this.refreshStorageItems();
  }

  ngOnDestroy() {
    this.watchSubscription?.unsubscribe();
  }

  async setItem() {
    try {
      this.lastError = '';
      const options: any = {};
      
      if (this.newTTL) {
        options.ttl = parseInt(this.newTTL) * 1000; // Convert to milliseconds
      }
      
      if (this.encryptData) {
        options.encrypt = true;
      }

      // Try to parse as JSON, otherwise use as string
      let value: any = this.newValue;
      try {
        value = JSON.parse(this.newValue);
      } catch {
        // Keep as string if not valid JSON
      }

      await this.localStorage.set(this.newKey, value, options);
      await this.refreshStorageItems();
      
      // Clear form
      this.newKey = '';
      this.newValue = '';
      this.newTTL = '';
      this.encryptData = false;
    } catch (error: any) {
      this.lastError = error.message;
    }
  }

  async removeItem(key: string) {
    try {
      this.lastError = '';
      await this.localStorage.remove(key);
      await this.refreshStorageItems();
    } catch (error: any) {
      this.lastError = error.message;
    }
  }

  async clearAll() {
    try {
      this.lastError = '';
      await this.localStorage.clear();
      await this.refreshStorageItems();
    } catch (error: any) {
      this.lastError = error.message;
    }
  }

  async refreshStorageItems() {
    try {
      this.allKeys = await this.localStorage.keys();
      this.storageItems = [];

      for (const key of this.allKeys) {
        const value = await this.localStorage.get(key);
        this.storageItems.push({ key, value });
      }
    } catch (error: any) {
      this.lastError = error.message;
    }
  }

  async watchForChanges() {
    if (this.watchKey) {
      this.watchSubscription?.unsubscribe();
      this.watchSubscription = this.localStorage.watch(this.watchKey).subscribe(value => {
        this.watchedValue = value;
      });
    }
  }

  stopWatching() {
    this.watchSubscription?.unsubscribe();
    this.watchedValue = null;
    this.watchKey = '';
  }

  formatValue(value: any): string {
    if (value === null || value === undefined) {
      return 'null';
    }
    if (typeof value === 'object') {
      return JSON.stringify(value, null, 2);
    }
    return String(value);
  }

  async quickSetExamples() {
    await this.localStorage.set('userName', 'John Doe');
    await this.localStorage.set('userAge', 30);
    await this.localStorage.set('userProfile', {
      name: 'John Doe',
      email: 'john@example.com',
      role: 'developer'
    });
    await this.localStorage.set('preferences', {
      theme: 'dark',
      language: 'en',
      notifications: true
    }, { ttl: 300000 }); // 5 minutes TTL
    
    await this.refreshStorageItems();
  }
}
