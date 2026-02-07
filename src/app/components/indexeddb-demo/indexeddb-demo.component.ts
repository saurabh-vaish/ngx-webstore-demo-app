import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IndexedDBService } from 'ngx-webstore';

interface Product {
  id: number;
  name: string;
  price: number;
  category: string;
}

@Component({
  selector: 'app-indexeddb-demo',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="demo-container fade-in">
      <div class="demo-header">
        <div>
          <h1>🗄️ IndexedDB Demo</h1>
          <p class="text-muted">Large data storage for offline-first applications</p>
        </div>
        <span class="badge" [class.badge-success]="isAvailable" [class.badge-error]="!isAvailable">
          {{ isAvailable ? '✓ Available' : '✗ Not Available' }}
        </span>
      </div>

      <section class="section">
        <div class="card">
          <div class="card-header">
            <h3>🚀 Quick Start - Large Dataset</h3>
          </div>
          <div class="card-body">
            <p>Generate and store a large product catalog:</p>
            <div class="button-group">
              <button class="btn btn-primary" (click)="generateLargeDataset(100)">
                Generate 100 Products
              </button>
              <button class="btn btn-primary" (click)="generateLargeDataset(1000)">
                Generate 1,000 Products
              </button>
              <button class="btn btn-secondary" (click)="loadProducts()">
                Load Products
              </button>
            </div>
            <div *ngIf="loadTime" class="metric">
              <strong>Load Time:</strong> {{ loadTime }}ms
            </div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="card">
          <div class="card-header">
            <h3>📊 Stored Products ({{ products.length }})</h3>
          </div>
          <div class="card-body">
            <div *ngIf="products.length === 0" class="empty-state">
              <p>No products stored. Generate a dataset to get started!</p>
            </div>
            <div *ngIf="products.length > 0">
              <div class="stats-grid">
                <div class="stat-card">
                  <div class="stat-value">{{ products.length }}</div>
                  <div class="stat-label">Total Products</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value">{{ categories.length }}</div>
                  <div class="stat-label">Categories</div>
                </div>
                <div class="stat-card">
                  <div class="stat-value">\${{ avgPrice.toFixed(2) }}</div>
                  <div class="stat-label">Avg Price</div>
                </div>
              </div>
              
              <h4 class="mt-3 mb-2">Sample Products (first 10)</h4>
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let product of products.slice(0, 10)">
                    <td>{{ product.id }}</td>
                    <td>{{ product.name }}</td>
                    <td><span class="badge badge-info">{{ product.category }}</span></td>
                    <td>\${{ product.price.toFixed(2) }}</td>
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
              <li>Offline-first web applications</li>
              <li>Caching large API responses</li>
              <li>Storing binary data (images, files)</li>
              <li>Client-side databases</li>
              <li>Progressive Web Apps (PWAs)</li>
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
              <pre>import {{ '{' }} IndexedDBService {{ '}' }} from 'ngx-webstore';

constructor(private indexedDB: IndexedDBService) {{ '{' }}{{ '}' }}

// Store large dataset
await this.indexedDB.set('products', largeProductArray);

// Retrieve data
const products = await this.indexedDB.get&lt;Product[]&gt;('products');

// With TTL (cache for 1 hour)
await this.indexedDB.set('catalog', data, {{ '{' }} ttl: 3600000 {{ '}' }});</pre>
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
    .button-group { display: flex; gap: 1rem; flex-wrap: wrap; margin-top: 1rem; }
    .metric { margin-top: 1rem; padding: 1rem; background: var(--bg-tertiary); border-radius: var(--border-radius); }
    .empty-state { text-align: center; padding: 3rem 1rem; color: var(--text-muted); }
    .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
    .stat-card { background: var(--bg-tertiary); padding: 1.5rem; border-radius: var(--border-radius); text-align: center; }
    .stat-value { font-size: 2rem; font-weight: 700; color: var(--text-primary); margin-bottom: 0.5rem; }
    .stat-label { color: var(--text-muted); font-size: 0.9rem; }
    ul { padding-left: 1.5rem; line-height: 2; }
    ul li { color: var(--text-secondary); }
  `]
})
export class IndexedDBDemoComponent implements OnInit {
  products: Product[] = [];
  isAvailable = false;
  loadTime: number | null = null;
  
  get categories(): string[] {
    return [...new Set(this.products.map(p => p.category))];
  }
  
  get avgPrice(): number {
    if (this.products.length === 0) return 0;
    return this.products.reduce((sum, p) => sum + p.price, 0) / this.products.length;
  }

  constructor(private indexedDB: IndexedDBService) {}

  async ngOnInit() {
    this.isAvailable = this.indexedDB.isAvailable;
    const exists = await this.indexedDB.has('products');
    if (exists) {
      await this.loadProducts();
    }
  }

  async generateLargeDataset(count: number) {
    const categories = ['Electronics', 'Clothing', 'Books', 'Home & Garden', 'Sports', 'Toys'];
    const products: Product[] = [];
    
    for (let i = 1; i <= count; i++) {
      products.push({
        id: i,
        name: `Product ${i}`,
        price: Math.random() * 100 + 10,
        category: categories[Math.floor(Math.random() * categories.length)]
      });
    }

    await this.indexedDB.set('products', products);
    await this.loadProducts();
  }

  async loadProducts() {
    const start = performance.now();
    this.products = await this.indexedDB.get<Product[]>('products') || [];
    const end = performance.now();
    this.loadTime = Math.round(end - start);
  }
}
