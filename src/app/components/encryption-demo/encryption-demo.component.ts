import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { LocalStorageService } from 'ngx-webstore';

@Component({
  selector: 'app-encryption-demo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="demo-container fade-in">
      <div class="demo-header">
        <h1>🔐 Encryption Demo</h1>
        <p class="text-muted">AES-GCM encryption for sensitive data</p>
      </div>

      <section class="section">
        <div class="card">
          <div class="card-header">
            <h3>🔒 Store Encrypted Data</h3>
          </div>
          <div class="card-body">
            <div class="form-group">
              <label>Sensitive Data (e.g., SSN, API Key)</label>
              <input type="text" [(ngModel)]="sensitiveData" placeholder="e.g., 123-45-6789" />
            </div>
            <div class="button-group">
              <button class="btn btn-primary" (click)="storeEncrypted()" [disabled]="!sensitiveData">
                🔐 Store Encrypted
              </button>
              <button class="btn btn-secondary" (click)="storeUnencrypted()" [disabled]="!sensitiveData">
                📝 Store Unencrypted
              </button>
            </div>
            <div *ngIf="storageComplete" class="success-message mt-2">
              ✓ Data stored! Check your browser DevTools > Application > Local Storage to see the difference
            </div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="card">
          <div class="card-header">
            <h3>📊 Comparison</h3>
          </div>
          <div class="card-body">
            <div class="comparison-grid">
              <div class="comparison-item">
                <h4>Encrypted Value</h4>
                <div class="code-block">
                  <pre>{{ encryptedValue || 'Not set' }}</pre>
                </div>
                <button class="btn btn-secondary btn-sm mt-2" (click)="retrieveEncrypted()">
                  Retrieve & Decrypt
                </button>
                <div *ngIf="decryptedValue" class="result-display mt-2">
                  <strong>Decrypted:</strong> {{ decryptedValue }}
                </div>
              </div>
              
              <div class="comparison-item">
                <h4>Unencrypted Value</h4>
                <div class="code-block">
                  <pre>{{ unencryptedValue || 'Not set' }}</pre>
                </div>
                <button class="btn btn-secondary btn-sm mt-2" (click)="retrieveUnencrypted()">
                  Retrieve
                </button>
                <div *ngIf="plainValue" class="result-display mt-2">
                  <strong>Value:</strong> {{ plainValue }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="card">
          <div class="card-header">
            <h3>🔑 Encryption Details</h3>
          </div>
          <div class="card-body">
            <ul>
              <li><strong>Algorithm:</strong> AES-GCM (256-bit)</li>
              <li><strong>Key Derivation:</strong> PBKDF2 with 100,000 iterations</li>
              <li><strong>Web Crypto API:</strong> Native browser encryption</li>
              <li><strong>Per-Session Salt:</strong> Unique salt generated each session</li>
              <li><strong>Unique IV:</strong> Each encrypted value has its own initialization vector</li>
            </ul>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="card">
          <div class="card-header">
            <h3>⚠️ Security Best Practices</h3>
          </div>
          <div class="card-body">
            <ul>
              <li>Never hardcode encryption secrets in your code</li>
              <li>Use environment variables for production secrets</li>
              <li>Client-side encryption is not a replacement for server-side security</li>
              <li>For highly sensitive data, use server-side encryption with httpOnly cookies</li>
              <li>Regularly rotate encryption keys</li>
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
              <pre>// Configure encryption globally
NgxStorageManagerModule.forRoot({{'{' }}
  encryption: {{'{' }}
    enabled: true,
    secret: environment.storageSecret,
    keyDerivationIterations: 100000
  {{ '}' }}
{{ '}' }})

// Store encrypted data
await this.localStorage.set('ssn', '123-45-6789', {{'{' }}
  encrypt: true
{{ '}' }});

// Data is automatically decrypted when retrieved
const ssn = await this.localStorage.get&lt;string&gt;('ssn');</pre>
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
    .success-message { padding: 1rem; background: rgba(16, 185, 129, 0.1); border: 1px solid var(--success-color); border-radius: var(--border-radius); color: var(--success-color); }
    .comparison-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
    .comparison-item h4 { margin-bottom: 1rem; color: var(--text-primary); }
    .result-display { padding: 1rem; background: var(--bg-tertiary); border-radius: var(--border-radius); }
    ul { padding-left: 1.5rem; line-height: 2; }
    ul li { color: var(--text-secondary); margin-bottom: 0.5rem; }
  `]
})
export class EncryptionDemoComponent {
  sensitiveData = '';
  storageComplete = false;
  encryptedValue = '';
  unencryptedValue = '';
  decryptedValue = '';
  plainValue = '';

  constructor(private localStorage: LocalStorageService) {}

  async storeEncrypted() {
    await this.localStorage.set('encrypted-data', this.sensitiveData, { encrypt: true });
    this.encryptedValue = 'Encrypted binary data (check DevTools to see)';
    this.storageComplete = true;
    this.sensitiveData = '';
  }

  async storeUnencrypted() {
    await this.localStorage.set('unencrypted-data', this.sensitiveData);
    this.unencryptedValue = this.sensitiveData;
    this.storageComplete = true;
    this.sensitiveData = '';
  }

  async retrieveEncrypted() {
    this.decryptedValue = await this.localStorage.get<string>('encrypted-data') || '';
  }

  async retrieveUnencrypted() {
    this.plainValue = await this.localStorage.get<string>('unencrypted-data') || '';
  }
}
