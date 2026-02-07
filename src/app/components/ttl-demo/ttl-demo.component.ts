import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {LocalStorageService} from 'ngx-webstore';

interface TtlItem {
  key: string;
  value: any;
  expiresAt: number;
  timeRemaining: string;
}

@Component({
  selector: 'app-ttl-demo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="demo-container fade-in">
      <div class="demo-header">
        <h1>⏰ TTL Demo</h1>
        <p class="text-muted">Time-to-live and automatic expiration</p>
      </div>

      <section class="section">
        <div class="card">
          <div class="card-header">
            <h3>⏱️ Create Expiring Data</h3>
          </div>
          <div class="card-body">
            <div class="grid grid-2">
              <div class="form-group">
                <label>Key</label>
                <input type="text" [(ngModel)]="newKey" placeholder="e.g., tempToken" />
              </div>
              <div class="form-group">
                <label>Value</label>
                <input type="text" [(ngModel)]="newValue" placeholder="Enter value" />
              </div>
              <div class="form-group">
                <label>TTL (seconds)</label>
                <input type="number" [(ngModel)]="ttlSeconds" placeholder="e.g., 30" />
              </div>
            </div>
            <div class="button-group">
              <button class="btn btn-primary" (click)="createWithTTL()" [disabled]="!newKey || !newValue || !ttlSeconds">
                Create with TTL
              </button>
              <button class="btn btn-secondary" (click)="quickExamples()">
                Create Quick Examples
              </button>
            </div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="card">
          <div class="card-header flex justify-between items-center">
            <h3>⏳ Active Items with TTL ({{ items.length }})</h3>
            <button class="btn btn-secondary btn-sm" (click)="refresh()">🔄 Refresh</button>
          </div>
          <div class="card-body">
            <div *ngIf="items.length === 0" class="empty-state">
              <p>No items with TTL. Create some to see auto-expiration in action!</p>
            </div>
            <div *ngIf="items.length > 0">
              <table>
                <thead>
                  <tr>
                    <th>Key</th>
                    <th>Value</th>
                    <th>Time Remaining</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let item of items">
                    <td><code>{{ item.key }}</code></td>
                    <td>{{ formatValue(item.value) }}</td>
                    <td>
                      <div class="time-remaining" [class.expiring]="isExpiringSoon(item)">
                        {{ item.timeRemaining }}
                      </div>
                    </td>
                    <td>
                      <span class="badge" [class.badge-success]="!isExpiringSoon(item)" [class.badge-warning]="isExpiringSoon(item)">
                        {{ isExpiringSoon(item) ? 'Expiring Soon' : 'Active' }}
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
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
              <li><strong>Authentication Tokens:</strong> Auto-expire after session timeout</li>
              <li><strong>Cache Invalidation:</strong> Automatically refresh stale data</li>
              <li><strong>Temporary Data:</strong> OTP codes, verification tokens</li>
              <li><strong>Rate Limiting:</strong> Track and expire rate limit counters</li>
              <li><strong>Session Data:</strong> Auto-cleanup of temporary session info</li>
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
              <pre>// Set with 1 hour TTL
await this.localStorage.set('token', 'abc123', {{'{' }}
  ttl: 3600000  // milliseconds
{{ '}' }});

// After 1 hour, get() will return null
const token = await this.localStorage.get('token');

// Common TTL values
const TTL = {{'{' }}
  ONE_MINUTE: 60 * 1000,
  ONE_HOUR: 60 * 60 * 1000,
  ONE_DAY: 24 * 60 * 60 * 1000
{{ '}' }};</pre>
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
    .button-group { display: flex; gap: 1rem; flex-wrap: wrap; }
    .empty-state { text-align: center; padding: 3rem 1rem; color: var(--text-muted); }
    .time-remaining { font-weight: 600; color: var(--text-primary); }
    .time-remaining.expiring { color: var(--warning-color); animation: pulse 1s ease-in-out infinite; }
    code { background: var(--bg-tertiary); padding: 0.25rem 0.5rem; border-radius: 4px; color: #06b6d4; }
    ul { padding-left: 1.5rem; line-height: 2; }
    ul li { color: var(--text-secondary); margin-bottom: 0.5rem; }
    @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.6; } }
  `]
})
export class TtlDemoComponent implements OnInit, OnDestroy {
  newKey = '';
  newValue = '';
  ttlSeconds = '';
  items: TtlItem[] = [];
  private refreshInterval: any;

  constructor(private localStorage: LocalStorageService) {}

  ngOnInit() {
    this.refresh();
    // Auto-refresh every second to update timers
    this.refreshInterval = setInterval(() => this.updateTimers(), 1000);
  }

  ngOnDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  async createWithTTL() {
    let value: any = this.newValue;
    try { value = JSON.parse(this.newValue); } catch {}
    
    const ttl = parseInt(this.ttlSeconds) * 1000;
    await this.localStorage.set(this.newKey, value, { ttl });
    
    this.newKey = '';
    this.newValue = '';
    this.ttlSeconds = '';
    await this.refresh();
  }

  async quickExamples() {
    await this.localStorage.set('short-lived', 'Expires in 10s', { ttl: 10000 });
    await this.localStorage.set('medium-lived', 'Expires in 30s', { ttl: 30000 });
    await this.localStorage.set('long-lived', 'Expires in 60s', { ttl: 60000 });
    await this.refresh();
  }

  async refresh() {
    const keys = await this.localStorage.keys();
    this.items = [];
    const now = Date.now();
    
    for (const key of keys) {
      const value = await this.localStorage.get(key);
      if (value !== null) {
        // Estimate expiration (this is simplified)
        const expiresAt = now + 60000; // Placeholder
        this.items.push({
          key,
          value,
          expiresAt,
          timeRemaining: this.calculateTimeRemaining(expiresAt)
        });
      }
    }
  }

  updateTimers() {
    this.items = this.items.map(item => ({
      ...item,
      timeRemaining: this.calculateTimeRemaining(item.expiresAt)
    }));
  }

  calculateTimeRemaining(expiresAt: number): string {
    const remaining = Math.max(0, expiresAt - Date.now());
    const seconds = Math.floor(remaining / 1000);
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    return `${minutes}m ${seconds % 60}s`;
  }

  isExpiringSoon(item: TtlItem): boolean {
    const remaining = item.expiresAt - Date.now();
    return remaining < 15000; // Less than 15 seconds
  }

  formatValue(value: any): string {
    return typeof value === 'object' ? JSON.stringify(value) : String(value);
  }
}
