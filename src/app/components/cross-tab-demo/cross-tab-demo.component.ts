import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LocalStorageService } from 'ngx-webstore';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-cross-tab-demo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="demo-container fade-in">
      <div class="demo-header">
        <h1>🔗 Cross-Tab Sync Demo</h1>
        <p class="text-muted">Real-time synchronization across browser tabs</p>
      </div>

      <section class="section">
        <div class="card highlight-card">
          <div class="card-header">
            <h3>📋 Instructions</h3>
          </div>
          <div class="card-body">
            <ol class="instructions">
              <li>Open this page in <strong>two or more browser tabs</strong></li>
              <li>Make changes in one tab</li>
              <li>Watch the changes instantly appear in other tabs</li>
              <li>Try the counter, theme toggle, and message examples below</li>
            </ol>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="grid grid-2">
          <!-- Synchronized Counter -->
          <div class="card">
            <div class="card-header">
              <h3>🔢 Synchronized Counter</h3>
            </div>
            <div class="card-body">
              <div class="sync-display">
                <div class="sync-value">{{ counter }}</div>
                <div class="sync-label">Current Count</div>
              </div>
              <div class="button-group">
                <button class="btn btn-primary" (click)="incrementCounter()">
                  + Increment
                </button>
                <button class="btn btn-secondary" (click)="decrementCounter()">
                  - Decrement
                </button>
                <button class="btn btn-warning" (click)="resetCounter()">
                  Reset
                </button>
              </div>
              <p class="sync-status" *ngIf="lastUpdate">
                Last update: {{ lastUpdate }}
              </p>
            </div>
          </div>

          <!-- Synchronized Theme -->
          <div class="card">
            <div class="card-header">
              <h3>🎨 Synchronized Theme</h3>
            </div>
            <div class="card-body">
              <div class="sync-display" [class.theme-dark]="theme === 'dark'" [class.theme-light]="theme === 'light'">
                <div class="theme-preview">
                  <span class="theme-icon">{{ theme === 'dark' ? '🌙' : '☀️' }}</span>
                  <div class="theme-name">{{ theme }} Mode</div>
                </div>
              </div>
              <button class="btn btn-primary" (click)="toggleTheme()">
                Toggle Theme
              </button>
            </div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="card">
          <div class="card-header">
            <h3>💬 Shared Message Board</h3>
          </div>
          <div class="card-body">
            <div class="message-display" *ngIf="message">
              <div class="message-content">{{ message }}</div>
              <div class="message-meta">Synced across all tabs</div>
            </div>
            <div class="form-group">
              <label>Write a message (will sync to all tabs)</label>
              <input type="text" [(ngModel)]="newMessage" placeholder="Type your message..." />
            </div>
            <button class="btn btn-primary" (click)="updateMessage()" [disabled]="!newMessage">
              Broadcast Message
            </button>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="card">
          <div class="card-header">
            <h3>🔄 How It Works</h3>
          </div>
          <div class="card-body">
            <p class="mb-2">
              Cross-tab synchronization uses the browser's <code>storage</code> event to detect changes in localStorage 
              from other tabs. When you update a value, all other tabs are notified and can react to the change.
            </p>
            <ul>
              <li>Only works with <strong>localStorage</strong> (not sessionStorage or cookies)</li>
              <li>Changes are detected in <strong>real-time</strong></li>
              <li>All tabs must be from the <strong>same origin</strong></li>
              <li>Uses the <code>watch()</code> method with Observable pattern</li>
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
              <pre>import {{ '{' }} LocalStorageService {{ '}' }} from 'ngx-webstore';

// Watch for changes from other tabs
this.localStorage.watch&lt;number&gt;('counter').subscribe(value => {{'{' }}
  this.counter = value || 0;
  console.log('Counter updated from another tab:', value);
{{ '}' }});

// Update value (will trigger watch in all tabs)
await this.localStorage.set('counter', newValue);

// All tabs will instantly receive the update!</pre>
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
    .highlight-card { border: 2px solid var(--info-color); }
    .instructions { padding-left: 1.5rem; line-height: 2; }
    .instructions li { color: var(--text-secondary); margin-bottom: 1rem; }
    .instructions strong { color: var(--text-primary); }
    .sync-display { background: var(--bg-tertiary); padding: 2rem; border-radius: var(--border-radius); text-align: center; margin-bottom: 1.5rem; }
    .sync-value { font-size: 3rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.5rem; }
    .sync-label { color: var(--text-muted); }
    .sync-status { margin-top: 1rem; padding: 0.75rem; background: var(--bg-secondary); border-radius: var(--border-radius); font-size: 0.9rem; color: var(--text-muted); }
    .theme-preview { display: flex; flex-direction: column; align-items: center; gap: 1rem; }
    .theme-icon { font-size: 4rem; }
    .theme-name { font-size: 1.5rem; font-weight: 600; text-transform: capitalize; }
    .theme-dark { background: #1e293b; }
    .theme-light { background: #f1f5f9; color: #1e293b; }
    .message-display { background: var(--bg-tertiary); padding: 1.5rem; border-radius: var(--border-radius); margin-bottom: 1.5rem; }
    .message-content { font-size: 1.25rem; font-weight: 500; margin-bottom: 0.5rem; }
    .message-meta { color: var(--text-muted); font-size: 0.9rem; }
    .button-group { display: flex; gap: 1rem; flex-wrap: wrap; }
    code { background: var(--bg-tertiary); padding: 0.25rem 0.5rem; border-radius: 4px; color: #06b6d4; }
    ul { padding-left: 1.5rem; line-height: 2; }
    ul li { color: var(--text-secondary); }
  `]
})
export class CrossTabDemoComponent implements OnInit, OnDestroy {
  counter = 0;
  theme = 'dark';
  message = '';
  newMessage = '';
  lastUpdate = '';
  
  private subscriptions: Subscription[] = [];

  constructor(private localStorage: LocalStorageService) {}

  async ngOnInit() {
    // Watch counter changes
    this.subscriptions.push(
      this.localStorage.watch<number>('sync-counter').subscribe(value => {
        this.counter = value || 0;
        this.lastUpdate = new Date().toLocaleTimeString();
      })
    );

    // Watch theme changes
    this.subscriptions.push(
      this.localStorage.watch<string>('sync-theme').subscribe(value => {
        this.theme = value || 'dark';
      })
    );

    // Watch message changes
    this.subscriptions.push(
      this.localStorage.watch<string>('sync-message').subscribe(value => {
        this.message = value || '';
      })
    );

    // Initialize values
    this.counter = await this.localStorage.get<number>('sync-counter') || 0;
    this.theme = await this.localStorage.get<string>('sync-theme') || 'dark';
    this.message = await this.localStorage.get<string>('sync-message') || '';
  }

  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  async incrementCounter() {
    this.counter++;
    await this.localStorage.set('sync-counter', this.counter);
  }

  async decrementCounter() {
    this.counter--;
    await this.localStorage.set('sync-counter', this.counter);
  }

  async resetCounter() {
    this.counter = 0;
    await this.localStorage.set('sync-counter', 0);
  }

  async toggleTheme() {
    this.theme = this.theme === 'dark' ? 'light' : 'dark';
    await this.localStorage.set('sync-theme', this.theme);
  }

  async updateMessage() {
    if (this.newMessage) {
      await this.localStorage.set('sync-message', this.newMessage);
      this.newMessage = '';
    }
  }
}
