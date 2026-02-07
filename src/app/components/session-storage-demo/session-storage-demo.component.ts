import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SessionStorageService } from 'ngx-webstore';

@Component({
  selector: 'app-session-storage-demo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="demo-container fade-in">
      <div class="demo-header">
        <div>
          <h1>⏱️ SessionStorage Demo</h1>
          <p class="text-muted">Session-based storage (clears on tab close)</p>
        </div>
        <span class="badge" [class.badge-success]="isAvailable" [class.badge-error]="!isAvailable">
          {{ isAvailable ? '✓ Available' : '✗ Not Available' }}
        </span>
      </div>

      <section class="section">
        <div class="card">
          <div class="card-header">
            <h3>📝 Add Session Data</h3>
          </div>
          <div class="card-body">
            <div class="grid grid-2">
              <div class="form-group">
                <label>Key</label>
                <input type="text" [(ngModel)]="newKey" placeholder="e.g., formDraft" />
              </div>
              <div class="form-group">
                <label>Value</label>
                <input type="text" [(ngModel)]="newValue" placeholder="Enter value" />
              </div>
            </div>
            <button class="btn btn-primary" (click)="setItem()" [disabled]="!newKey || !newValue">
              Save to Session
            </button>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="card">
          <div class="card-header flex justify-between items-center">
            <h3>📦 Session Items ({{ items.length }})</h3>
            <div class="button-group">
              <button class="btn btn-secondary btn-sm" (click)="refresh()">🔄 Refresh</button>
              <button class="btn btn-danger btn-sm" (click)="clearAll()" *ngIf="items.length > 0">
                🗑️ Clear All
              </button>
            </div>
          </div>
          <div class="card-body">
            <div *ngIf="items.length === 0" class="empty-state">
              <p>No session data. Data will persist only for this tab session.</p>
            </div>
            <table *ngIf="items.length > 0">
              <thead>
                <tr>
                  <th>Key</th>
                  <th>Value</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let item of items">
                  <td><code>{{ item.key }}</code></td>
                  <td><pre>{{ formatValue(item.value) }}</pre></td>
                  <td>
                    <button class="btn btn-danger btn-sm" (click)="removeItem(item.key)">
                      Remove
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="card">
          <div class="card-header">
            <h3>💡 Use Cases</h3>
          </div>
          <div class="card-body">
            <ul>
              <li>Form drafts (temporary form data)</li>
              <li>Multi-step wizard progress</li>
              <li>Temporary filters and search states</li>
              <li>Session-specific user preferences</li>
              <li>Shopping cart (session-only)</li>
            </ul>
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
              <pre>import {{ '{' }} SessionStorageService {{ '}' }} from 'ngx-webstore';

// Inject service
constructor(private sessionStorage: SessionStorageService) {{ '{' }}{{ '}' }}

// Save form draft
await this.sessionStorage.set('formDraft', formData);

// Retrieve on page refresh
const draft = await this.sessionStorage.get('formDraft');

// Clear after submission
await this.sessionStorage.remove('formDraft');</pre>
            </div>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .demo-container { max-width: 1200px; margin: 0 auto; }
    .demo-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 2rem; flex-wrap: wrap; gap: 1rem; }
    .demo-header h1 { margin-bottom: 0.5rem; }
    .section { margin-bottom: 2rem; }
    .empty-state { text-align: center; padding: 3rem 1rem; color: var(--text-muted); }
    .button-group { display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 1rem; }
    code { background: var(--bg-tertiary); padding: 0.25rem 0.5rem; border-radius: 4px; color: #06b6d4; }
    ul { padding-left: 1.5rem; line-height: 2; }
    ul li { color: var(--text-secondary); }
  `]
})
export class SessionStorageDemoComponent implements OnInit {
  newKey = '';
  newValue = '';
  items: Array<{key: string, value: any}> = [];
  isAvailable = false;

  constructor(private sessionStorage: SessionStorageService) {}

  async ngOnInit() {
    this.isAvailable = this.sessionStorage.isAvailable;
    await this.refresh();
  }

  async setItem() {
    let value: any = this.newValue;
    try { value = JSON.parse(this.newValue); } catch {}
    await this.sessionStorage.set(this.newKey, value);
    this.newKey = '';
    this.newValue = '';
    await this.refresh();
  }

  async removeItem(key: string) {
    await this.sessionStorage.remove(key);
    await this.refresh();
  }

  async clearAll() {
    await this.sessionStorage.clear();
    await this.refresh();
  }

  async refresh() {
    const keys = await this.sessionStorage.keys();
    this.items = [];
    for (const key of keys) {
      const value = await this.sessionStorage.get(key);
      this.items.push({ key, value });
    }
  }

  formatValue(value: any): string {
    return value === null ? 'null' : (typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value));
  }
}
