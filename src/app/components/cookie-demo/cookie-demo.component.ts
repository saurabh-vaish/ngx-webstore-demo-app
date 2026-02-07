import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CookieService } from 'ngx-webstore';

@Component({
  selector: 'app-cookie-demo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="demo-container fade-in">
      <div class="demo-header">
        <div>
          <h1>🍪 Cookie Demo</h1>
          <p class="text-muted">HTTP cookie management with full options support</p>
        </div>
      </div>

      <section class="section">
        <div class="card">
          <div class="card-header">
            <h3>🍪 Set Cookie</h3>
          </div>
          <div class="card-body">
            <div class="grid grid-2">
              <div class="form-group">
                <label>Key</label>
                <input type="text" [(ngModel)]="newKey" placeholder="e.g., authToken" />
              </div>
              <div class="form-group">
                <label>Value</label>
                <input type="text" [(ngModel)]="newValue" placeholder="Enter value" />
              </div>
              <div class="form-group">
                <label>TTL (seconds)</label>
                <input type="number" [(ngModel)]="ttl" placeholder="e.g., 3600" />
              </div>
              <div class="form-group">
                <label>Path</label>
                <input type="text" [(ngModel)]="path" placeholder="Default: /" />
              </div>
              <div class="form-group checkbox-group">
                <label class="checkbox-label">
                  <input type="checkbox" [(ngModel)]="secure" />
                  <span>Secure (HTTPS only)</span>
                </label>
                <label class="checkbox-label">
                  <input type="checkbox" [(ngModel)]="encrypt" />
                  <span>Encrypt Value</span>
                </label>
              </div>
              <div class="form-group">
                <label>SameSite</label>
                <select [(ngModel)]="sameSite">
                  <option value="Lax">Lax</option>
                  <option value="Strict">Strict</option>
                  <option value="None">None</option>
                </select>
              </div>
            </div>
            <button class="btn btn-primary" (click)="setCookie()" [disabled]="!newKey || !newValue">
              Set Cookie
            </button>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="card">
          <div class="card-header flex justify-between items-center">
            <h3>🍪 Active Cookies ({{ cookies.length }})</h3>
            <button class="btn btn-secondary btn-sm" (click)="refresh()">🔄 Refresh</button>
          </div>
          <div class="card-body">
            <div *ngIf="cookies.length === 0" class="empty-state">
              <p>No cookies set. Add a cookie to get started!</p>
            </div>
            <table *ngIf="cookies.length > 0">
              <thead>
                <tr>
                  <th>Key</th>
                  <th>Value</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr *ngFor="let cookie of cookies">
                  <td><code>{{ cookie.key }}</code></td>
                  <td><pre>{{ formatValue(cookie.value) }}</pre></td>
                  <td>
                    <button class="btn btn-danger btn-sm" (click)="removeCookie(cookie.key)">
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
            <h3>⚠️ Important Notes</h3>
          </div>
          <div class="card-body">
            <ul>
              <li><strong>Size Limit:</strong> Cookies have a ~4KB size limit</li>
              <li><strong>Security:</strong> For auth tokens, prefer httpOnly cookies set server-side</li>
              <li><strong>SameSite:</strong> Use "Strict" for CSRF protection</li>
              <li><strong>Secure Flag:</strong> Should be enabled for production HTTPS sites</li>
              <li><strong>HTTP Requests:</strong> Cookies are sent with every HTTP request</li>
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
              <pre>import {{ '{' }} CookieService {{ '}' }} from 'ngx-webstore';

constructor(private cookieService: CookieService) {{ '{' }}{{ '}' }}

// Set cookie with options
await this.cookieService.set('authToken', 'abc123', {{'{' }}
  ttl: 3600000,        // 1 hour
  secure: true,        // HTTPS only
  sameSite: 'Strict',  // CSRF protection
  path: '/',           // Available site-wide
  encrypt: true        // Encrypt value
{{ '}' }});

// Get cookie
const token = await this.cookieService.get&lt;string&gt;('authToken');

// Remove cookie
await this.cookieService.remove('authToken');</pre>
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
    .empty-state { text-align: center; padding: 3rem 1rem; color: var(--text-muted); }
    .checkbox-group { display: flex; flex-direction: column; gap: 0.75rem; }
    .checkbox-label { display: flex; align-items: center; gap: 0.5rem; cursor: pointer; }
    .checkbox-label input[type="checkbox"] { width: auto; cursor: pointer; }
    code { background: var(--bg-tertiary); padding: 0.25rem 0.5rem; border-radius: 4px; color: #06b6d4; }
    ul { padding-left: 1.5rem; line-height: 2; }
    ul li { color: var(--text-secondary); margin-bottom: 0.5rem; }
  `]
})
export class CookieDemoComponent implements OnInit {
  newKey = '';
  newValue = '';
  ttl = '';
  path = '/';
  secure = false;
  sameSite: 'Strict' | 'Lax' | 'None' = 'Lax';
  encrypt = false;
  cookies: Array<{key: string, value: any}> = [];

  constructor(private cookieService: CookieService) {}

  async ngOnInit() {
    await this.refresh();
  }

  async setCookie() {
    const options: any = {
      path: this.path,
      secure: this.secure,
      sameSite: this.sameSite
    };
    
    if (this.ttl) options.ttl = parseInt(this.ttl) * 1000;
    if (this.encrypt) options.encrypt = true;

    let value: any = this.newValue;
    try { value = JSON.parse(this.newValue); } catch {}

    await this.cookieService.set(this.newKey, value, options);
    
    // Reset form
    this.newKey = '';
    this.newValue = '';
    this.ttl = '';
    this.encrypt = false;
    
    await this.refresh();
  }

  async removeCookie(key: string) {
    await this.cookieService.remove(key);
    await this.refresh();
  }

  async refresh() {
    const keys = await this.cookieService.keys();
    this.cookies = [];
    for (const key of keys) {
      const value = await this.cookieService.get(key);
      this.cookies.push({ key, value });
    }
  }

  formatValue(value: any): string {
    return value === null ? 'null' : (typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value));
  }
}
