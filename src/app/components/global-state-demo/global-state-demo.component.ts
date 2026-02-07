import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GlobalStateService, GlobalVariable } from 'ngx-webstore';

@Component({
  selector: 'app-global-state-demo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="demo-container fade-in">
      <div class="demo-header">
        <h1>🔄 Global State Demo</h1>
        <p class="text-muted">Reactive state management with Signals & Observables</p>
      </div>

      <div class="grid grid-2">
        <!-- Signals Demo -->
        <section class="section">
          <div class="card">
            <div class="card-header">
              <h3>✨ Angular Signals</h3>
            </div>
            <div class="card-body">
              <div class="demo-display">
                <div class="state-value">
                  <span class="label">Counter:</span>
                  <span class="value">{{ counter() }}</span>
                </div>
                <div class="state-value">
                  <span class="label">Theme:</span>
                  <span class="value">{{ theme() }}</span>
                </div>
              </div>
              
              <div class="button-group">
                <button class="btn btn-primary" (click)="incrementCounter()">
                  Increment Counter
                </button>
                <button class="btn btn-secondary" (click)="toggleTheme()">
                  Toggle Theme
                </button>
              </div>
              
              <p class="text-muted mt-2">
                <small>✓ Signals auto-persist to localStorage</small>
              </p>
            </div>
          </div>
        </section>

        <!-- Observables Demo -->
        <section class="section">
          <div class="card">
            <div class="card-header">
              <h3>📡 RxJS Observables</h3>
            </div>
            <div class="card-body">
              <div class="demo-display">
                <div class="state-value">
                  <span class="label">User Name:</span>
                  <span class="value">{{ (userName$ | async) || 'Not set' }}</span>
                </div>
              </div>
              
              <div class="form-group">
                <label>Update User Name</label>
                <input type="text" [(ngModel)]="newUserName" placeholder="Enter name" />
              </div>
              
              <button class="btn btn-primary" (click)="updateUserName()" [disabled]="!newUserName">
                Update Name
              </button>
              
              <p class="text-muted mt-2">
                <small>✓ Observable auto-syncs across components</small>
              </p>
            </div>
          </div>
        </section>
      </div>

      <!-- Code Examples -->
      <section class="section">
        <div class="card">
          <div class="card-header">
            <h3>💻 Code Examples</h3>
          </div>
          <div class="card-body">
            <h4>Signals (Angular 16+)</h4>
            <div class="code-block">
              <pre>import {{ '{' }} GlobalStateService {{ '}' }} from 'ngx-webstore';

// Create a signal
counter = this.globalState.createSignal('counter', 0, {{'{' }}
  storage: 'localStorage',
  persist: true
{{ '}' }});

// Use in template: {{ '{{' }} counter() {{ '}}' }}

// Update signal
this.counter.set(5);
this.counter.update(val => val + 1);</pre>
            </div>

            <h4 class="mt-3">Observables (RxJS)</h4>
            <div class="code-block">
              <pre>// Create observable variable
userName = this.globalState.createVar('userName', '', {{'{' }}
  storage: 'localStorage',
  persist: true
{{ '}' }});

// Subscribe in template with async pipe
userName$ = this.userName.value$;

// Update value
await this.userName.set('John Doe');
await this.userName.update(name => name.toUpperCase());</pre>
            </div>
          </div>
        </div>
      </section>

      <!-- Features -->
      <section class="section">
        <div class="card">
          <div class="card-header">
            <h3>🎯 Key Features</h3>
          </div>
          <div class="card-body">
            <ul>
              <li><strong>Reactive:</strong> Auto-update UI when state changes</li>
              <li><strong>Persistent:</strong> Optional localStorage/sessionStorage sync</li>
              <li><strong>Type-Safe:</strong> Full TypeScript generic support</li>
              <li><strong>Cross-Component:</strong> Share state across entire app</li>
              <li><strong>TTL Support:</strong> Auto-expire state data</li>
              <li><strong>Encryption:</strong> Secure sensitive state data</li>
            </ul>
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
    .demo-display { background: var(--bg-tertiary); padding: 1.5rem; border-radius: var(--border-radius); margin-bottom: 1.5rem; }
    .state-value { display: flex; justify-content: space-between; align-items: center; padding: 0.75rem 0; border-bottom: 1px solid var(--border-color); }
    .state-value:last-child { border-bottom: none; }
    .state-value .label { color: var(--text-muted); font-weight: 500; }
    .state-value .value { font-size: 1.25rem; font-weight: 700; color: var(--text-primary); }
    .button-group { display: flex; gap: 1rem; flex-wrap: wrap; }
    ul { padding-left: 1.5rem; line-height: 2; }
    ul li { color: var(--text-secondary); margin-bottom: 0.5rem; }
  `]
})
export class GlobalStateDemoComponent implements OnInit {
  // Signals
  counter = signal(0);
  theme = signal('dark');
  
  // Observable
  userName!: GlobalVariable<string>;
  userName$ = null as any;
  newUserName = '';

  constructor(private globalState: GlobalStateService) {}

  async ngOnInit() {
    // Initialize signals with persistence
    const savedCounter = await this.globalState.createSignal('counter', 0, {
      storage: 'localStorage',
      persist: true
    });
    this.counter.set(savedCounter());
    
    const savedTheme = await this.globalState.createSignal('theme', 'dark', {
      storage: 'localStorage',
      persist: true
    });
    this.theme.set(savedTheme());

    // Create observable variable
    this.userName = this.globalState.createVar('userName', '', {
      storage: 'localStorage',
      persist: true
    });
    this.userName$ = this.userName.value$;
  }

  incrementCounter() {
    this.counter.update((val: number) => val + 1);
  }

  toggleTheme() {
    this.theme.update((val: string) => val === 'dark' ? 'light' : 'dark');
  }

  async updateUserName() {
    if (this.newUserName) {
      await this.userName.set(this.newUserName);
      this.newUserName = '';
    }
  }
}
