
# Workdistro

**Workdistro** is a modern, cross-platform task outsourcing and hiring platform built with [Expo](https://expo.dev), [React Native](https://reactnative.dev/), and [TypeScript](https://www.typescriptlang.org/).  
It connects clients with skilled workers, enabling seamless task posting, bidding, hiring, and real-time communication.

---

## Table of Contents

- Features
- Project Structure
- Getting Started
- Development Workflow
- Environment Variables
- Routing & Navigation
- State Management
- WebSocket Integration
- Testing
- Code Quality
- Contributing
- License

---

## Features

- **User Registration & Authentication** (with OTP verification)
- **Role-based Access** (Client/Worker, with easy switching)
- **Task Posting & Bidding**
- **Hiring Workflow** (real-time job offers, accept/decline with timer)
- **Wallet & Identity Verification** (BVN/NIN, phone, etc.)
- **In-app Notifications** (WebSocket-powered)
- **Profile Management**
- **Responsive UI** with custom theming and reusable components

---

## Project Structure

```
Workdistro/
├── app/                # App entry, screens, and routing
│   ├── (auth)/         # Authentication flows (login, register, OTP)
│   ├── (tabs)/         # Main tabbed navigation (home, wallet, profile, etc.)
│   ├── features/       # Feature-specific screens (e.g., hire)
│   ├── onboarding/     # Onboarding and role selection
│   └── _layout.tsx     # Root layout and providers
├── assets/             # Images, fonts, icons
├── components/         # Reusable UI components
├── constants/          # Theme, colors, spacing, typography
├── lib/                # API instance (axios), utilities
├── services/           # API service modules (auth, hire, wallet, etc.)
├── shared/             # Shared hooks, stores (zustand), and types
├── package.json
├── tsconfig.json
└── README.md
```

---

## Getting Started

### 1. **Clone the Repository**

```bash
git clone https://github.com/your-org/workdistro.git
cd workdistro
```

### 2. **Install Dependencies**

```bash
npm install
# or
yarn install
```

### 3. **Start the Development Server**

```bash
npx expo start
```

- Use the Expo Go app or an emulator to preview the app.

---

## Development Workflow

- **File-based Routing:**  
  Uses [Expo Router](https://docs.expo.dev/router/introduction/) for navigation.  
  Screens and layouts are auto-registered based on the `app/` directory structure.

- **State Management:**  
  Uses [Zustand](https://docs.pmnd.rs/zustand/getting-started/introduction) for global state (auth, role, services, etc.).

- **API Communication:**  
  Uses [Axios](https://axios-http.com/) with a custom instance in `lib/api.ts`.  
  Auth tokens are automatically attached except for login/register endpoints.

- **WebSocket Integration:**  
  Real-time features (job offers, notifications) are powered by a WebSocket store and custom hooks.

- **UI Components:**  
  All UI elements are modular and themed via `constants/theme`.

---

## Environment Variables

Create a `.env` file in the root directory for sensitive configs (API base URL, etc.):

```
API_BASE_URL=https://workdistro-backend-1.onrender.com/api/
```

> **Note:** The current API base URL is set in `lib/api.ts`.  
> For production, update this as needed.

---

## Routing & Navigation

- **Auth Flows:**  
  Located in `app/(auth)/` (e.g., `/login`, `/register`, `/verifyOtp`).

- **Main App:**  
  Tabbed navigation in `app/(tabs)/` (e.g., `/home`, `/wallet`, `/profile`).

- **Onboarding:**  
  Role selection and intro in `app/onboarding/`.

- **Dynamic Modals:**  
  Global modals (e.g., job offer sheet) are rendered in _layout.tsx and triggered via WebSocket events.

---

## State Management

- **Auth Store:**  
  `shared/stores/useAuthStore.ts`  
  Handles user authentication, tokens, and user info.

- **Role Store:**  
  `shared/stores/useRoleStore.ts`  
  Manages current user role (`client` or `worker`).

- **WebSocket Store:**  
  `shared/stores/useWebSocketStore.ts`  
  Manages socket connection and event listeners.

- **Service Store:**  
  `shared/stores/useServiceStore.ts`  
  Caches available services for workers.

---

## WebSocket Integration

- **Real-time Events:**  
  - Job offers (`job_offer`)
  - Notifications
  - Status updates

- **Usage:**  
  Use the `useWebSocketEvents` hook to listen for events and trigger UI updates (e.g., show `JobOfferSheet`).

---

## Testing

- **Unit Tests:**  
  Write tests in `__tests__/` or alongside components/services.
- **Run Tests:**
  ```bash
  npm test
  # or
  yarn test
  ```

---

## Code Quality

- **Linting:**  
  Uses ESLint with Expo config.
  ```bash
  npm run lint
  ```
- **Type Checking:**  
  Uses TypeScript strict mode for type safety.

- **Formatting:**  
  Follow the existing code style and use Prettier if configured.

---

## Contributing

1. Fork the repo and create your branch:  
   `git checkout -b feature/your-feature`
2. Commit your changes:  
   `git commit -am 'Add new feature'`
3. Push to the branch:  
   `git push origin feature/your-feature`
4. Create a Pull Request

**Please follow the code style and add tests for new features.**

---

## License

This project is licensed under the MIT License.

---

## Contact

For questions, issues, or feature requests, please open an issue or contact the maintainers.

---

**Happy coding! 🚀**

---

Let me know if you want to add more sections (e.g., deployment, FAQ, API docs) or tailor this for your team!