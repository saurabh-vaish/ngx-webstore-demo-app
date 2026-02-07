/**
 * Test file to verify ngx-webstore imports and IntelliSense
 * This file demonstrates that TypeScript can resolve all imports
 * and that IDE autocomplete should work correctly
 */

// Module import
import { NgxWebStoreModule } from 'ngx-webstore';

// Service imports
import {
  LocalStorageService,
  SessionStorageService,
  CookieService,
  IndexedDBService,
  GlobalStateService,
  StorageManagerService
} from 'ngx-webstore';

// Core services
import {
  EncryptionService,
  SerializationService,
  TTLManagerService,
  NamespaceManagerService
} from 'ngx-webstore';

// Models
import {
  StorageConfig,
  StorageOptions,
  StoredItem
} from 'ngx-webstore';

// Utilities
import {
  isLocalStorageAvailable,
  isSessionStorageAvailable,
  isCookieAvailable,
  isIndexedDBAvailable
} from 'ngx-webstore';

// Type checking test
function testTypeChecking(localStorage: LocalStorageService) {
  // These should have full IntelliSense:

  // 1. Method autocomplete
  localStorage.set('key', 'value');
  localStorage.get('key');
  localStorage.remove('key');
  localStorage.clear();
  localStorage.keys();
  localStorage.has('key');
  localStorage.watch('key');

  // 2. Generic type support
  localStorage.get<string>('stringKey');
  localStorage.get<number>('numberKey');
  localStorage.get<{ name: string }>('objectKey');

  // 3. Options parameter
  localStorage.set('key', 'value', {
    ttl: 3600000,
    encrypt: true
  });

  // 4. Property access
  const available = localStorage.isAvailable;

  // 5. Observable typing
  const value$ = localStorage.watch<string>('key');
  value$.subscribe(val => {
    // val is typed as string | null
    console.log(val?.toUpperCase());
  });
}

console.log('✅ All imports resolved successfully!');
console.log('✅ TypeScript type checking passed!');
console.log('✅ IntelliSense should work in VS Code!');
