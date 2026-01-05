# 🎨 Frontend Technical Specification

**Metadata**
- Last Updated: {{DATE}}
- Maintainer: AI-Dev Toolkit
- Related Docs: 01_prd.md, 07_architecture.md, 12_test_plan.md, 19_design_doc.md

> **🎯 Executive Summary**
> A comprehensive frontend technical specification defining the user interface architecture, component library, user experience patterns, and implementation standards. This document serves as the definitive guide for frontend development teams to deliver consistent, accessible, and performant user experiences.

---

## 🚀 1. Frontend Architecture Overview

### 1.1 Architecture Philosophy
**Design Principles:**
- **Component-First Architecture:** Reusable, modular components as building blocks
- **Atomic Design System:** Hierarchical component organization (atoms → molecules → organisms)
- **Performance-Driven:** Optimized for loading speed and runtime performance
- **Accessibility-First:** WCAG 2.1 AA compliance by default
- **Mobile-First Responsive:** Progressive enhancement from mobile to desktop

### 1.2 Technology Stack
| Category | Technology | Version | Justification |
|----------|------------|---------|---------------|
| **Core Framework** | React | 18.2+ | Component ecosystem, performance, community |
| **Build Tool** | Vite | 4.5+ | Fast HMR, optimized builds, ES modules |
| **Language** | TypeScript | 5.0+ | Type safety, developer experience, maintainability |
| **Styling** | Tailwind CSS | 3.3+ | Utility-first, consistent design tokens |
| **State Management** | Zustand | 4.4+ | Simple, lightweight, TypeScript-friendly |
| **Routing** | React Router | 6.15+ | Standard routing solution, nested routes |
| **Testing** | Vitest + RTL | Latest | Fast testing, Jest-compatible API |
| **Linting** | ESLint + Prettier | Latest | Code quality, consistent formatting |

### 1.3 Project Structure
```
src/
├── components/           # Reusable UI components
│   ├── atoms/           # Basic building blocks (Button, Input, etc.)
│   ├── molecules/       # Component combinations (SearchBox, Card, etc.)
│   ├── organisms/       # Complex sections (Header, Sidebar, etc.)
│   └── templates/       # Page layouts and structure
├── pages/               # Route components and page logic
├── hooks/               # Custom React hooks
├── stores/              # State management (Zustand stores)
├── services/            # API calls and external integrations
├── utils/               # Helper functions and utilities
├── types/               # TypeScript type definitions
├── assets/              # Static assets (images, icons, fonts)
├── styles/              # Global styles and Tailwind config
└── tests/               # Test utilities and mocks
```

### 1.4 Performance Targets
| Metric | Target | Measurement Tool | Validation |
|--------|--------|------------------|------------|
| **First Contentful Paint** | <1.5s | Lighthouse | CI/CD checks |
| **Largest Contentful Paint** | <2.5s | Lighthouse | Performance budget |
| **Total Blocking Time** | <300ms | Lighthouse | Core Web Vitals |
| **Cumulative Layout Shift** | <0.1 | Lighthouse | Visual stability |
| **Bundle Size** | <500KB gzipped | Bundle analyzer | Build-time checks |

---

## 📱 2. Target Platforms & Device Support

### 2.1 Device Matrix
| Device Category | Screen Size | Viewport | Priority | Support Level |
|-----------------|-------------|----------|----------|---------------|
| **Mobile Phones** | 320-768px | Portrait/Landscape | Primary | Full support |
| **Tablets** | 768-1024px | Portrait/Landscape | Secondary | Full support |
| **Laptops** | 1024-1440px | Landscape | Primary | Full support |
| **Desktops** | 1440px+ | Landscape | Secondary | Full support |
| **Large Displays** | 1920px+ | Landscape | Tertiary | Basic support |

### 2.2 Browser Support Matrix
| Browser | Version | Market Share | Support Level | Testing Priority |
|---------|---------|--------------|---------------|------------------|
| **Chrome** | Last 2 versions | 65% | Full | Primary |
| **Safari** | Last 2 versions | 20% | Full | Primary |
| **Firefox** | Last 2 versions | 8% | Full | Secondary |
| **Edge** | Last 2 versions | 5% | Full | Secondary |
| **Samsung Internet** | Latest | 2% | Basic | Tertiary |

### 2.3 Accessibility Standards
#### WCAG 2.1 AA Compliance Requirements
- **Perceivable:** Color contrast 4.5:1, scalable text, alt text for images
- **Operable:** Keyboard navigation, no seizure triggers, sufficient time limits
- **Understandable:** Readable text, predictable functionality, input assistance
- **Robust:** Valid markup, assistive technology compatibility

#### Assistive Technology Support
- **Screen Readers:** NVDA, JAWS, VoiceOver, TalkBack
- **Keyboard Navigation:** Full functionality without mouse
- **Voice Control:** Dragon NaturallySpeaking, voice recognition
- **Magnification:** ZoomText, built-in browser zoom

---

## 🧩 3. Component Library & Design System

### 3.1 Design Token System
#### Color Palette
```typescript
const colors = {
  // Primary brand colors
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',  // Main brand color
    600: '#2563eb',
    900: '#1e3a8a'
  },

  // Semantic colors
  success: { 500: '#10b981', 600: '#059669' },
  warning: { 500: '#f59e0b', 600: '#d97706' },
  error: { 500: '#ef4444', 600: '#dc2626' },

  // Neutral grays
  gray: {
    50: '#f9fafb',
    100: '#f3f4f6',
    500: '#6b7280',
    800: '#1f2937',
    900: '#111827'
  }
};
```

#### Typography Scale
```typescript
const typography = {
  fontFamily: {
    sans: ['Inter', 'system-ui', 'sans-serif'],
    mono: ['JetBrains Mono', 'Menlo', 'monospace']
  },

  fontSize: {
    xs: ['0.75rem', { lineHeight: '1rem' }],
    sm: ['0.875rem', { lineHeight: '1.25rem' }],
    base: ['1rem', { lineHeight: '1.5rem' }],
    lg: ['1.125rem', { lineHeight: '1.75rem' }],
    xl: ['1.25rem', { lineHeight: '1.75rem' }],
    '2xl': ['1.5rem', { lineHeight: '2rem' }],
    '3xl': ['1.875rem', { lineHeight: '2.25rem' }]
  }
};
```

#### Spacing & Layout
```typescript
const spacing = {
  px: '1px',
  0: '0',
  1: '0.25rem',   // 4px
  2: '0.5rem',    // 8px
  4: '1rem',      // 16px
  6: '1.5rem',    // 24px
  8: '2rem',      // 32px
  12: '3rem',     // 48px
  16: '4rem'      // 64px
};
```

### 3.2 Atomic Component Library

#### Atoms (Basic Elements)
**Button Component**
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  children: ReactNode;
  onClick?: () => void;
}

// Usage patterns:
<Button variant="primary" size="md">Save Changes</Button>
<Button variant="outline" icon={<PlusIcon />}>Add Item</Button>
```

**Input Component**
```typescript
interface InputProps {
  type: 'text' | 'email' | 'password' | 'number';
  label: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  value: string;
  onChange: (value: string) => void;
}

// Usage:
<Input
  label="Email Address"
  type="email"
  required
  error={formErrors.email}
  value={email}
  onChange={setEmail}
/>
```

**Badge Component**
```typescript
interface BadgeProps {
  variant: 'default' | 'success' | 'warning' | 'error';
  size: 'sm' | 'md';
  children: ReactNode;
}

// Usage:
<Badge variant="success">Active</Badge>
<Badge variant="warning" size="sm">Pending</Badge>
```

#### Molecules (Component Combinations)
**Search Bar**
```typescript
interface SearchBarProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  onSearch: (query: string) => void;
  suggestions?: string[];
  loading?: boolean;
}

// Features:
// - Real-time search suggestions
// - Keyboard navigation (↑↓ arrows, Enter, Escape)
// - Debounced input for performance
// - Clear button when populated
```

**Form Field**
```typescript
interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: ReactNode;
}

// Combines label, input, error message, and hint text
// Manages ARIA relationships and accessibility
```

**Data Table Cell**
```typescript
interface TableCellProps {
  sortable?: boolean;
  align: 'left' | 'center' | 'right';
  width?: string;
  children: ReactNode;
}

// Features:
// - Sortable headers with visual indicators
// - Responsive column hiding
// - Cell content truncation with tooltips
```

#### Organisms (Complex Sections)
**Navigation Header**
```typescript
interface HeaderProps {
  user?: UserProfile;
  navigation: NavigationItem[];
  searchEnabled?: boolean;
  notificationsEnabled?: boolean;
}

// Features:
// - Responsive navigation (hamburger menu on mobile)
// - User profile dropdown
// - Global search functionality
// - Notification center integration
// - Breadcrumb support
```

**Data Table**
```typescript
interface DataTableProps<T> {
  data: T[];
  columns: ColumnDefinition<T>[];
  pagination?: PaginationConfig;
  sorting?: SortingConfig;
  filtering?: FilterConfig;
  loading?: boolean;
  emptyState?: ReactNode;
}

// Features:
// - Server-side and client-side pagination
// - Multi-column sorting
// - Advanced filtering with facets
// - Row selection and bulk actions
// - Virtualization for large datasets
```

### 3.3 Component Development Standards

#### Component Template
```typescript
// ComponentName.tsx
import React from 'react';
import { cn } from '@/utils/classNames';

interface ComponentNameProps {
  /** Required prop description */
  requiredProp: string;
  /** Optional prop with default */
  optionalProp?: boolean;
  /** Event handler */
  onEvent?: (data: EventData) => void;
  /** Additional CSS classes */
  className?: string;
  /** Children elements */
  children?: React.ReactNode;
}

/**
 * ComponentName - Brief description of component purpose
 *
 * @example
 * <ComponentName requiredProp="value">
 *   Content here
 * </ComponentName>
 */
export const ComponentName: React.FC<ComponentNameProps> = ({
  requiredProp,
  optionalProp = false,
  onEvent,
  className,
  children,
  ...props
}) => {
  // Component logic here

  return (
    <div
      className={cn('base-styles', className)}
      {...props}
    >
      {children}
    </div>
  );
};

ComponentName.displayName = 'ComponentName';
```

#### Testing Requirements
```typescript
// ComponentName.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  it('renders with required props', () => {
    render(<ComponentName requiredProp="test" />);
    expect(screen.getByRole('component')).toBeInTheDocument();
  });

  it('handles events correctly', () => {
    const handleEvent = jest.fn();
    render(<ComponentName requiredProp="test" onEvent={handleEvent} />);

    fireEvent.click(screen.getByRole('button'));
    expect(handleEvent).toHaveBeenCalledWith(expectedData);
  });

  it('meets accessibility standards', async () => {
    const { container } = render(<ComponentName requiredProp="test" />);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});
```

---

## 🎨 4. User Experience Patterns & Guidelines

### 4.1 Interaction Patterns

#### Loading States
```typescript
// Progressive loading patterns
const LoadingStates = {
  // Skeleton screens for content areas
  skeleton: <SkeletonLoader />,

  // Spinners for actions
  spinner: <Spinner size="sm" />,

  // Progress bars for uploads/downloads
  progress: <ProgressBar value={progress} max={100} />,

  // Shimmer effect for images
  shimmer: <ImageShimmer />
};

// Implementation guidelines:
// - Show skeletons immediately (<100ms)
// - Display progress for operations >2 seconds
// - Provide cancel options for long operations
// - Show success/error feedback after completion
```

#### Error Handling
```typescript
interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

// Error display patterns:
// 1. Inline errors for form validation
// 2. Toast notifications for temporary issues
// 3. Error pages for critical failures
// 4. Retry mechanisms for network errors

const ErrorPatterns = {
  validation: <InlineError message="Email is required" />,
  network: <Toast type="error" retry={retryAction} />,
  critical: <ErrorPage code={500} />,
  notFound: <NotFoundPage />
};
```

#### Form Interactions
```typescript
// Form UX patterns and validation
const FormPatterns = {
  // Real-time validation for critical fields
  realtimeValidation: ['email', 'password', 'username'],

  // Validation timing
  validateOnBlur: true,
  validateOnSubmit: true,
  showErrorsAfterFirstSubmit: true,

  // Success patterns
  successFeedback: 'toast', // 'toast' | 'inline' | 'redirect'

  // Auto-save for long forms
  autoSave: {
    enabled: true,
    interval: 30000, // 30 seconds
    indicator: <AutoSaveIndicator />
  }
};
```

### 4.2 Navigation Patterns

#### Page Navigation
```typescript
interface NavigationConfig {
  // Breadcrumb navigation
  breadcrumbs: {
    enabled: boolean;
    maxItems: number;
    showHome: boolean;
  };

  // Tab navigation
  tabs: {
    scrollable: boolean;
    persistState: boolean;
    lazyLoad: boolean;
  };

  // Sidebar navigation
  sidebar: {
    collapsible: boolean;
    persistState: boolean;
    mobileOverlay: boolean;
  };
}

// Navigation hierarchy:
// Level 1: Main navigation (header)
// Level 2: Section navigation (sidebar)
// Level 3: Page navigation (tabs)
// Level 4: Content navigation (breadcrumbs)
```

#### Modal & Overlay Patterns
```typescript
interface ModalPatterns {
  // Modal sizing
  sizes: 'sm' | 'md' | 'lg' | 'xl' | 'full';

  // Interaction patterns
  closeOnOverlayClick: boolean;
  closeOnEscape: boolean;
  trapFocus: boolean;

  // Animation preferences
  animationType: 'fade' | 'slide' | 'scale';
  duration: number;
}

// Modal usage guidelines:
// - Use sparingly, prefer inline editing
// - Always provide clear close affordances
// - Maintain focus management
// - Support keyboard navigation
```

### 4.3 Data Visualization Patterns

#### Table Interactions
```typescript
interface TableUXPatterns {
  // Selection patterns
  selection: {
    type: 'single' | 'multiple' | 'none';
    showCheckboxes: boolean;
    selectOnRowClick: boolean;
  };

  // Sorting and filtering
  sorting: {
    multiColumn: boolean;
    persistState: boolean;
    showIndicators: boolean;
  };

  // Pagination
  pagination: {
    type: 'numbered' | 'loadMore' | 'infinite';
    pageSize: number;
    showSizeSelector: boolean;
  };
}
```

#### Chart and Graph Guidelines
```typescript
interface ChartPatterns {
  // Accessibility
  accessibility: {
    altText: string;
    dataTable: boolean; // Provide table alternative
    keyboardNavigation: boolean;
  };

  // Responsive behavior
  responsive: {
    minHeight: number;
    aspectRatio: string;
    hideElementsOnMobile: string[];
  };

  // Color and styling
  colorPalette: 'categorical' | 'sequential' | 'diverging';
  colorBlindSafe: boolean;
}
```

---

## 🔧 5. State Management Architecture

### 5.1 State Organization Strategy
```typescript
// Global state structure using Zustand
interface AppState {
  // User authentication and profile
  auth: AuthState;

  // Application-wide UI state
  ui: UIState;

  // Feature-specific state stores
  features: {
    dashboard: DashboardState;
    settings: SettingsState;
    notifications: NotificationState;
  };
}

// State management principles:
// 1. Keep state as local as possible
// 2. Use global state for truly shared data
// 3. Separate UI state from business logic
// 4. Implement optimistic updates where appropriate
```

### 5.2 Store Patterns
```typescript
// Authentication store example
interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  updateProfile: (updates: ProfileUpdates) => Promise<void>;
}

const useAuthStore = create<AuthState & AuthActions>((set, get) => ({
  // Initial state
  user: null,
  token: localStorage.getItem('token'),
  isLoading: false,
  error: null,

  // Actions
  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await authAPI.login(credentials);
      set({
        user: response.user,
        token: response.token,
        isLoading: false
      });
      localStorage.setItem('token', response.token);
    } catch (error) {
      set({
        error: error.message,
        isLoading: false
      });
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, error: null });
  }
}));
```

### 5.3 Data Fetching Patterns
```typescript
// React Query integration for server state
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// Query patterns
const useUsers = (filters?: UserFilters) => {
  return useQuery({
    queryKey: ['users', filters],
    queryFn: () => userAPI.getUsers(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Mutation patterns with optimistic updates
const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userAPI.updateUser,
    onMutate: async (updatedUser) => {
      // Optimistic update
      await queryClient.cancelQueries(['users']);
      const previousUsers = queryClient.getQueryData(['users']);

      queryClient.setQueryData(['users'], (old: User[]) =>
        old.map(user =>
          user.id === updatedUser.id ? { ...user, ...updatedUser } : user
        )
      );

      return { previousUsers };
    },
    onError: (err, updatedUser, context) => {
      // Rollback on error
      queryClient.setQueryData(['users'], context?.previousUsers);
    },
    onSettled: () => {
      // Refetch to ensure consistency
      queryClient.invalidateQueries(['users']);
    }
  });
};
```

---

## 🎯 6. Performance Optimization Strategy

### 6.1 Bundle Optimization
```typescript
// Vite configuration for optimal bundling
export default defineConfig({
  build: {
    // Code splitting strategy
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          vendor: ['react', 'react-dom'],
          ui: ['@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu'],

          // Feature-based chunks
          dashboard: ['./src/pages/Dashboard'],
          settings: ['./src/pages/Settings'],
        }
      }
    },

    // Compression and minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  },

  // Development optimizations
  server: {
    hmr: {
      overlay: false // Disable error overlay in dev
    }
  }
});
```

### 6.2 Runtime Performance Patterns
```typescript
// React performance optimization patterns

// 1. Memoization
const ExpensiveComponent = React.memo(({ data, onUpdate }) => {
  const processedData = useMemo(() => {
    return heavyDataProcessing(data);
  }, [data]);

  const handleUpdate = useCallback((id: string) => {
    onUpdate(id);
  }, [onUpdate]);

  return <div>{/* render logic */}</div>;
});

// 2. Virtual scrolling for large lists
import { FixedSizeList as List } from 'react-window';

const VirtualizedTable = ({ items }) => (
  <List
    height={600}
    itemCount={items.length}
    itemSize={50}
    itemData={items}
  >
    {({ index, style, data }) => (
      <div style={style}>
        <TableRow data={data[index]} />
      </div>
    )}
  </List>
);

// 3. Lazy loading with Suspense
const LazyDashboard = lazy(() => import('./Dashboard'));

const App = () => (
  <Suspense fallback={<PageSkeleton />}>
    <Routes>
      <Route path="/dashboard" element={<LazyDashboard />} />
    </Routes>
  </Suspense>
);
```

### 6.3 Image and Asset Optimization
```typescript
// Image optimization strategies
const OptimizedImage = ({ src, alt, ...props }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div className="relative">
      {!isLoaded && <ImageSkeleton />}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        className={cn(
          'transition-opacity duration-300',
          isLoaded ? 'opacity-100' : 'opacity-0'
        )}
        {...props}
      />
    </div>
  );
};

// Asset preloading for critical resources
const preloadCriticalAssets = () => {
  const link = document.createElement('link');
  link.rel = 'preload';
  link.as = 'font';
  link.href = '/fonts/inter-var.woff2';
  link.crossOrigin = 'anonymous';
  document.head.appendChild(link);
};
```

---

## ♿ 7. Accessibility Implementation

### 7.1 Semantic HTML Structure
```typescript
// Proper semantic structure
const AccessibleForm = () => (
  <form>
    <fieldset>
      <legend>Personal Information</legend>

      <div className="form-group">
        <label htmlFor="firstName">
          First Name <span aria-label="required">*</span>
        </label>
        <input
          id="firstName"
          type="text"
          required
          aria-describedby="firstName-error"
          aria-invalid={hasError}
        />
        {hasError && (
          <div id="firstName-error" role="alert">
            First name is required
          </div>
        )}
      </div>
    </fieldset>
  </form>
);
```

### 7.2 ARIA Implementation Patterns
```typescript
// Common ARIA patterns
const AccessibleModal = ({ isOpen, onClose, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  // Focus management
  useEffect(() => {
    if (isOpen) {
      modalRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <div
      ref={modalRef}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
      tabIndex={-1}
    >
      <h2 id="modal-title">Modal Title</h2>
      <div id="modal-description">
        {children}
      </div>
      <button onClick={onClose} aria-label="Close modal">
        ×
      </button>
    </div>
  );
};

// Accessible data table
const AccessibleTable = ({ data, columns }) => (
  <table role="table" aria-label="User data">
    <thead>
      <tr>
        {columns.map(column => (
          <th
            key={column.key}
            scope="col"
            aria-sort={getSortDirection(column.key)}
          >
            {column.label}
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {data.map((row, index) => (
        <tr key={row.id}>
          {columns.map(column => (
            <td key={column.key}>
              {row[column.key]}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);
```

### 7.3 Keyboard Navigation
```typescript
// Keyboard navigation implementation
const useKeyboardNavigation = (items: NavItem[]) => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        setActiveIndex(prev => (prev + 1) % items.length);
        break;

      case 'ArrowUp':
        event.preventDefault();
        setActiveIndex(prev => (prev - 1 + items.length) % items.length);
        break;

      case 'Enter':
      case ' ':
        event.preventDefault();
        items[activeIndex].onClick();
        break;

      case 'Escape':
        event.preventDefault();
        // Close menu or modal
        break;
    }
  }, [items, activeIndex]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return { activeIndex };
};
```

---

## 🧪 8. Testing Strategy & Implementation

### 8.1 Testing Pyramid Structure
```typescript
// Unit tests (70% of tests)
// Component testing with React Testing Library
describe('Button Component', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button')).toHaveTextContent('Click me');
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByRole('button'));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is accessible', async () => {
    const { container } = render(<Button>Click me</Button>);
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });
});

// Integration tests (20% of tests)
// Testing component interactions
describe('Search Functionality', () => {
  it('searches and displays results', async () => {
    const mockSearch = jest.fn().mockResolvedValue(['result1', 'result2']);

    render(<SearchPage onSearch={mockSearch} />);

    const searchInput = screen.getByLabelText('Search');
    fireEvent.change(searchInput, { target: { value: 'test query' } });
    fireEvent.click(screen.getByRole('button', { name: 'Search' }));

    await waitFor(() => {
      expect(screen.getByText('result1')).toBeInTheDocument();
    });
  });
});

// E2E tests (10% of tests)
// Critical user journeys with Playwright
test('User can complete signup flow', async ({ page }) => {
  await page.goto('/signup');

  await page.fill('[data-testid="email"]', 'user@example.com');
  await page.fill('[data-testid="password"]', 'SecurePassword123');
  await page.click('[data-testid="submit"]');

  await expect(page).toHaveURL('/dashboard');
  await expect(page.getByText('Welcome')).toBeVisible();
});
```

### 8.2 Visual Regression Testing
```typescript
// Storybook integration for visual testing
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component: 'Primary button component for user actions.'
      }
    }
  }
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary Button'
  }
};

export const Loading: Story = {
  args: {
    variant: 'primary',
    loading: true,
    children: 'Loading...'
  }
};

// Visual regression with Chromatic
// Automatically captures screenshots of all stories
// Compares against baseline images
// Flags visual changes for review
```

### 8.3 Performance Testing
```typescript
// Performance testing with testing-library
import { render } from '@testing-library/react';
import { profiler } from '@testing-library/react-hooks';

describe('Performance Tests', () => {
  it('renders large list efficiently', () => {
    const largeDataset = Array.from({ length: 1000 }, (_, i) => ({
      id: i,
      name: `Item ${i}`
    }));

    const startTime = performance.now();
    render(<LargeList data={largeDataset} />);
    const endTime = performance.now();

    expect(endTime - startTime).toBeLessThan(100); // 100ms threshold
  });

  it('handles rapid state updates', async () => {
    const { rerender } = render(<Counter initialValue={0} />);

    const startTime = performance.now();
    for (let i = 0; i < 100; i++) {
      rerender(<Counter initialValue={i} />);
    }
    const endTime = performance.now();

    expect(endTime - startTime).toBeLessThan(50);
  });
});
```

---

## 🚀 9. Build & Deployment Pipeline

### 9.1 Development Workflow
```yaml
# .github/workflows/frontend-ci.yml
name: Frontend CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linting
        run: npm run lint

      - name: Run type checking
        run: npm run type-check

      - name: Run tests
        run: npm run test:coverage

      - name: Run accessibility tests
        run: npm run test:a11y

      - name: Build application
        run: npm run build

      - name: Run Lighthouse CI
        run: npm run lighthouse:ci

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - name: Deploy to staging
        run: npm run deploy:staging

      - name: Run E2E tests
        run: npm run test:e2e

      - name: Deploy to production
        run: npm run deploy:production
```

### 9.2 Environment Configuration
```typescript
// Environment-specific configurations
interface EnvironmentConfig {
  apiBaseUrl: string;
  cdnUrl: string;
  analytics: {
    googleAnalytics?: string;
    mixpanel?: string;
  };
  features: {
    enableBetaFeatures: boolean;
    enableAnalytics: boolean;
    enableErrorReporting: boolean;
  };
  performance: {
    enableServiceWorker: boolean;
    enableCodeSplitting: boolean;
  };
}

const configs: Record<string, EnvironmentConfig> = {
  development: {
    apiBaseUrl: 'http://localhost:3000/api',
    cdnUrl: 'http://localhost:3000',
    analytics: {},
    features: {
      enableBetaFeatures: true,
      enableAnalytics: false,
      enableErrorReporting: false
    },
    performance: {
      enableServiceWorker: false,
      enableCodeSplitting: false
    }
  },

  production: {
    apiBaseUrl: 'https://api.example.com',
    cdnUrl: 'https://cdn.example.com',
    analytics: {
      googleAnalytics: 'GA_TRACKING_ID',
      mixpanel: 'MIXPANEL_TOKEN'
    },
    features: {
      enableBetaFeatures: false,
      enableAnalytics: true,
      enableErrorReporting: true
    },
    performance: {
      enableServiceWorker: true,
      enableCodeSplitting: true
    }
  }
};
```

### 9.3 Monitoring & Analytics
```typescript
// Error monitoring setup
import * as Sentry from '@sentry/react';

Sentry.init({
  dsn: process.env.VITE_SENTRY_DSN,
  environment: process.env.NODE_ENV,
  integrations: [
    new Sentry.BrowserTracing(),
    new Sentry.Replay()
  ],
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0
});

// Performance monitoring
const performanceObserver = new PerformanceObserver((list) => {
  list.getEntries().forEach((entry) => {
    if (entry.entryType === 'largest-contentful-paint') {
      analytics.track('performance.lcp', {
        value: entry.startTime,
        page: window.location.pathname
      });
    }
  });
});

performanceObserver.observe({ entryTypes: ['largest-contentful-paint'] });
```

---

## 📚 10. Documentation & Style Guide

### 10.1 Component Documentation Standards
```typescript
/**
 * Button component for user interactions
 *
 * @example
 * ```tsx
 * <Button variant="primary" onClick={handleClick}>
 *   Save Changes
 * </Button>
 * ```
 *
 * @example
 * ```tsx
 * <Button variant="outline" loading={isLoading}>
 *   Submit
 * </Button>
 * ```
 */
export interface ButtonProps {
  /** Visual style variant */
  variant: 'primary' | 'secondary' | 'outline' | 'ghost';

  /** Size of the button */
  size: 'sm' | 'md' | 'lg';

  /** Whether button is disabled */
  disabled?: boolean;

  /** Shows loading spinner and disables interaction */
  loading?: boolean;

  /** Icon to display alongside text */
  icon?: ReactNode;

  /** Button content */
  children: ReactNode;

  /** Click event handler */
  onClick?: (event: MouseEvent<HTMLButtonElement>) => void;

  /** Additional CSS classes */
  className?: string;
}
```

### 10.2 Code Style Guidelines
```typescript
// ESLint configuration
module.exports = {
  extends: [
    '@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended'
  ],
  rules: {
    // Enforce consistent naming
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'interface',
        format: ['PascalCase'],
        suffix: ['Props', 'State', 'Config']
      },
      {
        selector: 'typeAlias',
        format: ['PascalCase']
      },
      {
        selector: 'function',
        format: ['camelCase', 'PascalCase']
      }
    ],

    // React-specific rules
    'react/prop-types': 'off',
    'react/react-in-jsx-scope': 'off',
    'react/display-name': 'error',

    // Accessibility rules
    'jsx-a11y/no-autofocus': 'warn',
    'jsx-a11y/click-events-have-key-events': 'error'
  }
};

// Prettier configuration
module.exports = {
  semi: true,
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 80,
  tabWidth: 2,
  useTabs: false
};
```

### 10.3 Design System Documentation
```markdown
# Design System Guidelines

## Color Usage
- Primary colors for main actions and branding
- Semantic colors (success, warning, error) for status indication
- Neutral grays for text and backgrounds
- Ensure 4.5:1 contrast ratio for accessibility

## Typography Hierarchy
- H1: Page titles (32px, font-weight: 700)
- H2: Section headings (24px, font-weight: 600)
- H3: Subsection headings (20px, font-weight: 600)
- Body: Regular text (16px, font-weight: 400)
- Caption: Secondary text (14px, font-weight: 400)

## Spacing System
- Use consistent spacing units (4px base)
- Component padding: 16px, 24px, 32px
- Section margins: 32px, 48px, 64px
- Maintain visual rhythm and alignment
```

---

## 📋 11. Maintenance & Support Guidelines

### 11.1 Dependency Management
```json
{
  "scripts": {
    "deps:check": "npm outdated",
    "deps:update": "npm update",
    "deps:audit": "npm audit",
    "deps:fix": "npm audit fix"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  }
}
```

### 11.2 Browser Support Updates
```typescript
// Browser support matrix review process
const browserSupportReview = {
  frequency: 'quarterly',
  metrics: [
    'browser usage analytics',
    'support ticket volume',
    'feature compatibility',
    'performance impact'
  ],
  decisionCriteria: {
    dropSupport: 'usage < 1% for 6 months',
    addSupport: 'usage > 5% or critical users',
    maintainSupport: 'usage > 1% or business requirement'
  }
};
```

### 11.3 Component Library Versioning
```typescript
// Semantic versioning for component library
interface ComponentVersion {
  major: number; // Breaking changes
  minor: number; // New features, backward compatible
  patch: number; // Bug fixes, backward compatible
}

// Breaking change examples:
// - Removing props or changing prop types
// - Changing component behavior significantly
// - Removing components

// Minor change examples:
// - Adding new optional props
// - Adding new components
// - Enhancing existing functionality

// Patch change examples:
// - Bug fixes
// - Performance improvements
// - Documentation updates
```

---

## 📞 12. Team Contacts & Resources

### Frontend Team Structure
| Role | Name | Email | Phone | Specialization |
|------|------|-------|-------|---------------|
| **Frontend Architect** | _[Name]_ | _[Email]_ | _[Phone]_ | Architecture, performance, standards |
| **Senior Frontend Developer** | _[Name]_ | _[Email]_ | _[Phone]_ | Component library, React expertise |
| **UI/UX Developer** | _[Name]_ | _[Email]_ | _[Phone]_ | Design systems, accessibility |
| **Frontend DevOps** | _[Name]_ | _[Email]_ | _[Phone]_ | Build tools, deployment, monitoring |

### External Resources
- **Design System Consultants:** _[Contact for design system expertise]_
- **Accessibility Auditors:** _[Contact for WCAG compliance reviews]_
- **Performance Specialists:** _[Contact for performance optimization]_
- **Security Reviewers:** _[Contact for frontend security assessment]_

### Development Tools & Platforms
- **Code Repository:** GitHub - _[Repository URL]_
- **Design System:** Storybook - _[Storybook URL]_
- **Performance Monitoring:** Lighthouse CI, Core Web Vitals
- **Error Tracking:** Sentry - _[Sentry project URL]_
- **Analytics:** Google Analytics, Mixpanel
- **Documentation:** _[Documentation platform URL]_

---

**Document Control:**
- **Version:** 1.0
- **Last Review:** 2025-09-16
- **Next Review:** _[Date + 30 days]_
- **Approval Status:** Draft/Under Review/Approved
- **Digital Signature:** _[Electronic signature block]_

**Template Usage Notes:**
- Replace all placeholders marked with _[brackets]_
- Update 2025-09-16 with current date
- Customize technology stack based on project requirements
- Scale component library complexity based on application size
- Regular updates ensure alignment with modern frontend practices
- Maintain compatibility with accessibility standards and performance benchmarks
