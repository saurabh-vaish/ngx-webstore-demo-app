# ngx-webstore Demo App

A comprehensive Angular application demonstrating the capabilities of the `ngx-webstore` library, a unified storage management solution for Angular applications.

## Overview

This project serves as a practical example and reference implementation for integrating `ngx-webstore` into your Angular projects. It showcases how to interact with various browser storage mechanisms through a consistent, type-safe API, including advanced features like encryption, cross-tab synchronization, and state management.

## Features Demonstrated

The application provides interactive examples for the following `ngx-webstore` features:

- **Local Storage:** Persistent key-value storage across browser sessions.
- **Session Storage:** Temporary storage for a single browser tab session.
- **Cookies:** HTTP cookie management with secure attributes.
- **IndexedDB:** Asynchronous storage for larger structured data.
- **Global State Management:** Reactive state sharing across components using the library's state management capabilities.
- **Storage Manager:** A unified interface to access all storage types dynamically.
- **Encryption:** Secure data storage using AES encryption (configurable).
- **Time-to-Live (TTL):** Automatic expiration of stored items.
- **Cross-Tab Synchronization:** Real-time state updates across multiple browser tabs.

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- **Node.js:** v18 or higher is recommended.
- **npm:** usually comes with Node.js.
- **Angular CLI:** `npm install -g @angular/cli` (if not already installed).

### Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/your-username/ngx-webstore-demo-app.git
    cd ngx-webstore-demo-app
    ```

2.  Install dependencies:
    ```bash
    npm install
    ```

### Running the Application

Run the development server:

```bash
npm start
```

Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Configuration

The `ngx-webstore` library is initialized in `src/app/app.config.ts`. This configuration demonstrates how to set up default storage, encryption, and other options.

```typescript
// src/app/app.config.ts
import { NgxWebStoreModule } from 'ngx-webstore';

export const appConfig: ApplicationConfig = {
  providers: [
    // ...
    importProvidersFrom(
      NgxWebStoreModule.forRoot({
        namespace: 'demo-app',
        defaultStorage: 'localStorage',
        encryption: {
          enabled: true,
          secret: 'demo-secret-key-change-in-production-!@#$%',
          keyDerivationIterations: 100000
        },
        indexedDB: {
          dbName: 'demo-app-db',
          storeName: 'demo-storage',
          version: 1
        },
        cookie: {
          path: '/',
          secure: true,
          sameSite: 'Lax'
        }
      })
    )
  ]
};
```

## Building regarding Production

To build the project for production:

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Running Tests

Run the unit tests via [Karma](https://karma-runner.github.io):

```bash
npm test
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
