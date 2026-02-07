import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StorageManagerService } from 'ngx-webstore';

@Component({
  selector: 'app-storage-manager-demo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="demo-container fade-in">
      <div class="demo-header">
        <h1>⚙️ Storage Manager Demo</h1>
        <p class="text-muted">Unified API with automatic fallback strategies</p>
      </div>

      <section class="section">
        <div class="card">
          <div class="card-header">
            <h3>📊 Storage Availability</h3>
          </div>
          <div class="card-body">
            <div class="storage-grid">
              <div class="storage-status" *ngFor="let storage of availableStorages">
                <span class="storage-icon" [class.available]="storage.available">
                  {{ storage.available ? '✓' : '✗' }}
                </span>
                <span class="storage-name">{{ storage.name }}</span>
                <span class="badge" [class.badge-success]="storage.available" [class.badge-error]="!storage.available">
                  {{ storage.available ? 'Available' : 'Not Available' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="card">
          <div class="card-header">
            <h3>💾 Dynamic Storage Selection</h3>
          </div>
          <div class="card-body">
            <div class="form-group">
              <label>Key</label>
              <input type="text" [(ngModel)]="key" placeholder="e.g., myData" />
            </div>
            <div class="form-group">
              <label>Value</label>
              <input type="text" [(ngModel)]="value" placeholder="Enter value" />
            </div>
            <div class="form-group">
              <label>Storage Type</label>
              <select [(ngModel)]="selectedStorage">
                <option value="localStorage">LocalStorage</option>
                <option value="sessionStorage">SessionStorage</option>
                <option value="cookie">Cookie</option>
                <option value="indexedDB">IndexedDB</option>
              </select>
            </div>
            <div class="button-group">
              <button class="btn btn-primary" (click)="setInStorage()" [disabled]="!key || !value">
                Set in {{ selectedStorage }}
              </button>
              <button class="btn btn-secondary" (click)="getFromStorage()" [disabled]="!key">
                Get from {{ selectedStorage }}
              </button>
            </div>
            <div *ngIf="retrievedValue !== null" class="result-display">
              <strong>Retrieved Value:</strong> {{ retrievedValue }}
            </div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="card">
          <div class="card-header">
            <h3>🔄 Fallback Strategy</h3>
          </div>
          <div class="card-body">
            <p class="text-muted mb-2">
              The fallback strategy automatically tries each storage type in order until one succeeds.
            </p>
            <div class="form-group">
              <label>Key for Fallback Test</label>
              <input type="text" [(ngModel)]="fallbackKey" placeholder="e.g., importantData" />
            </div>
            <div class="form-group">
              <label>Value</label>
              <input type="text" [(ngModel)]="fallbackValue" placeholder="Enter value" />
            </div>
            <div class="button-group">
              <button class="btn btn-primary" (click)="setWithFallback()" [disabled]="!fallbackKey || !fallbackValue">
                Set with Fallback
              </button>
              <button class="btn btn-secondary" (click)="getWithFallback()" [disabled]="!fallbackKey">
                Get with Fallback
              </button>
            </div>
            <div *ngIf="fallbackResult" class="result-display">
              {{ fallbackResult }}
            </div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="card">
          <div class="card-header">
            <h3>💻 Code Example</h3>
          </div>
          <div class="card-body">
            <div class="code-block">
              <pre>import {{ '{' }} StorageManagerService {{ '}' }} from 'ngx-webstore';

constructor(private storage: StorageManagerService) {{ '{' }}{{ '}' }}

// Direct access to specific storage
await this.storage.local.set('key', value);
await this.storage.session.set('key', value);
await this.storage.cookie.set('key', value);
await this.storage.indexedDB.set('key', value);

// Dynamic storage selection
await this.storage.set('key', value, {{ '{' }} storage: 'indexedDB' {{ '}' }});

// Fallback strategy (tries each storage in order)
await this.storage.setWithFallback('important', data);
const data = await this.storage.getWithFallback('important');

// Check availability
const available = this.storage.getAvailableStorages();
const isAvailable = this.storage.isStorageAvailable('indexedDB');</pre>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .demo-container { max-width: 1200px; margin: 0 auto; }
    .demo-header { margin-bottom: 2rem; }
    .demo-header h1 { margin-bottom: 0.5rem; }
    .section { margin-bottom: 2rem; }
    .storage-grid { display: grid; gap: 1rem; }
    .storage-status { display: flex; align-items: center; gap: 1rem; padding: 1rem; background: var(--bg-tertiary); border-radius: var(--border-radius); }
    .storage-icon { font-size: 1.5rem; font-weight: bold; width: 30px; text-align: center; }
    .storage-icon.available { color: var(--success-color); }
    .storage-name { flex: 1; font-weight: 500; text-transform: capitalize; }
    .result-display { margin-top: 1rem; padding: 1rem; background: var(--bg-tertiary); border-radius: var(--border-radius); }
    .button-group { display: flex; gap: 1rem; flex-wrap: wrap; }
  `]
})
export class StorageManagerDemoComponent implements OnInit {
  key = '';
  value = '';
  selectedStorage: 'localStorage' | 'sessionStorage' | 'cookie' | 'indexedDB' = 'localStorage';
  retrievedValue: any = null;
  
  fallbackKey = '';
  fallbackValue = '';
  fallbackResult = '';
  
  availableStorages: Array<{name: string, available: boolean}> = [];

  constructor(private storage: StorageManagerService) {}

  ngOnInit() {
    const storages = ['localStorage', 'sessionStorage', 'cookie', 'indexedDB'];
    this.availableStorages = storages.map(name => ({
      name,
      available: this.storage.isStorageAvailable(name as any)
    }));
  }

  async setInStorage() {
    let val: any = this.value;
    try { val = JSON.parse(this.value); } catch {}
    await this.storage.set(this.key, val, { storage: this.selectedStorage });
    this.value = '';
  }

  async getFromStorage() {
    this.retrievedValue = await this.storage.get(this.key, { storage: this.selectedStorage });
  }

  async setWithFallback() {
    let val: any = this.fallbackValue;
    try { val = JSON.parse(this.fallbackValue); } catch {}
    await this.storage.setWithFallback(this.fallbackKey, val);
    this.fallbackResult = `✓ Data saved with fallback strategy`;
    this.fallbackValue = '';
  }

  async getWithFallback() {
    const result = await this.storage.getWithFallback(this.fallbackKey);
    this.fallbackResult = result ? `Retrieved: ${JSON.stringify(result)}` : 'Not found in any storage';
  }
}
