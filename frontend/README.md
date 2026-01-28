# TechCorp Dashboard - Internal Tools Management

A comprehensive SaaS tools management dashboard built with Angular 19, featuring real-time analytics, advanced filtering, and complete CRUD operations.

## Table of Contents

- [Getting Started](#getting-started)
- [Project Architecture](#project-architecture)
- [Technical Stack](#technical-stack)
- [Features by Day](#features-by-day)
- [Design System](#design-system)
- [API Integration](#api-integration)
- [Development Guidelines](#development-guidelines)

---

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Angular CLI 19+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd frontend

# Install dependencies
npm install

# Start development server
ng serve

# Navigate to
http://localhost:4200
```

The application will automatically reload when you make changes to the source files.

### Build for Production

```bash
ng build --configuration production
```

Build artifacts will be stored in the `dist/` directory.

---

## Project Architecture

### Directory Structure

```
src/app/
├── core/
│   ├── models/
│   │   └── interfaces.ts          # TypeScript interfaces (Tool, Analytics, KpiCard)
│   └── services/
│       ├── theme.service.ts       # Dark/Light theme management
│       └── apiService.ts          # HTTP client service with CRUD operations
├── pages/
│   ├── dashboard/
│   │   ├── dashboard.component.ts # Day 6: Dashboard page
│   │   └── dashboard.html
│   └── tools/
│       ├── tools.component.ts     # Day 7: Tools management page
│       ├── tools.html
│       └── components/
│           ├── tools-filters/     # Advanced filtering component
│           └── tool-modal/        # Add/Edit tool modal
├── shared/
│   └── components/
│       ├── header/                # Global navigation header
│       ├── kpi-card/              # Reusable KPI card component
│       └── tool-table/            # Tools data table with actions
├── app.component.ts               # Root component with router-outlet
├── app.routes.ts                  # Application routing configuration
└── app.config.ts                  # Application providers configuration
```

### Key Design Patterns

#### Signal-based State Management

All components use Angular Signals for reactive state management:

```typescript
// State
allTools = signal<Tool[]>([]);
isLoading = signal<boolean>(true);

// Computed values
filteredTools = computed(() => {
  // Filtering logic
});
```

Benefits:
- Fine-grained reactivity
- Better performance than Zone.js
- Clearer data flow

#### Standalone Components

All components are standalone (no NgModules):

```typescript
@Component({
  selector: 'app-tools',
  standalone: true,
  imports: [CommonModule, HeaderComponent, ...],
  // ...
})
```

#### Output Events for Component Communication

Child components emit events to parent:

```typescript
// Child component
editTool = output<Tool>();

// Parent component template
<app-tools-table (editTool)="openEditModal($event)" />
```

---

## Technical Stack

### Core Technologies

| Technology | Version | Purpose |
|------------|---------|---------|
| Angular | 19.x | Frontend framework |
| TypeScript | 5.x | Type-safe JavaScript |
| Tailwind CSS | 3.4.17 | Utility-first CSS framework |
| RxJS | 7.x | Reactive programming |

### Why These Choices

#### Angular 19 with Signals

- Modern reactive primitives (Signals)
- Improved performance with zoneless change detection
- Standalone components reduce bundle size
- Built-in form validation and routing

#### Tailwind CSS 3.x (Not 4.x)

**Critical Decision**: Downgraded from Tailwind 4 beta to 3.4.17

Reason: Tailwind 4 beta has compatibility issues with Angular's build system:
- `@import "tailwindcss"` syntax not supported
- Plugin architecture conflicts with Angular compiler
- Stable production build requires Tailwind 3.x

Configuration:
```javascript
// tailwind.config.js
module.exports = {
  darkMode: 'class',
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        // Custom color palette
      }
    }
  }
}
```

Styles import:
```scss
// styles.scss
@tailwind base;
@tailwind components;
@tailwind utilities;
```

#### Signal-based Theme Service

Custom implementation using Signals:

```typescript
export class ThemeService {
  theme = signal<'light' | 'dark'>('dark');
  
  toggleTheme(): void {
    const newTheme = this.theme() === 'dark' ? 'light' : 'dark';
    this.theme.set(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark');
  }
}
```

Benefits:
- Persistence with localStorage
- Reactive across all components
- No external dependencies

---

## Features by Day

### Day 6: Dashboard (Foundation)

**Status**: Complete

Deliverables:
- Header with navigation, search, theme toggle, and user avatar
- 4 KPI cards with metrics and trends:
  - Monthly Budget (with progress bar)
  - Active Tools (with trend indicator)
  - Departments count
  - Cost per User
- Recent Tools table (8 most recently updated)
- Real tool logos via Clearbit API
- Status badges (Active, Expiring, Unused)
- Dark/Light theme toggle with persistence

Design Reference: Pixel-perfect implementation of provided mockup

Key Components:
- `HeaderComponent`: Global navigation
- `KpiCardComponent`: Reusable metric cards with icons and trends
- `ToolsTableComponent`: Data table with sorting and pagination
- `DashboardComponent`: Main page orchestration

API Endpoints Used:
- `GET /analytics`: KPI metrics
- `GET /tools?_sort=updated_at&_order=desc&_limit=8`: Recent tools

### Day 7: Tools Management (Autonomous Consistency)

**Status**: Complete

Challenge: Maintain design consistency without mockup reference

Deliverables:
- Complete tools catalog page (24 tools)
- 3 mini KPI cards (Total Tools, Active, Monthly Cost)
- Advanced filtering system:
  - Department filter (dropdown)
  - Status filter (dropdown)
  - Category filter (dropdown)
  - Cost Range filter (min/max inputs)
  - Active filters display with individual removal
  - Reset all filters button
- Add/Edit Tool modal:
  - Multi-step form with validation
  - All fields: name, description, category, department, cost, users, status, icon URL
  - Pre-populated in edit mode
- Full CRUD operations:
  - Create: Add new tool
  - Read: Display all tools with filtering
  - Update: Edit existing tool
  - Delete: Remove tool with confirmation
- Edit/Delete action buttons in table rows
- Search functionality in header
- Bulk operations support (code present, UI optional)

Key Components:
- `ToolsComponent`: Main page with state management
- `ToolsFiltersComponent`: Multi-criteria filtering
- `ToolModalComponent`: Add/Edit form modal
- Enhanced `ToolsTableComponent`: Added Edit/Delete actions

API Endpoints Used:
- `GET /tools`: All tools
- `POST /tools`: Create tool
- `PUT /tools/:id`: Update tool
- `DELETE /tools/:id`: Delete tool

Design Decisions:
- Reused all color variables from Day 6
- Maintained identical card styling (rounded-2xl, borders, shadows)
- Consistent button styles and hover states
- Same loading/error state designs
- Matching typography and spacing

---

## Design System

### Color Palette

#### Light Mode
```
Page Background: #f9fafb (gray-50)
Card Background: #ffffff (white)
Text Primary: #111827 (gray-900)
Text Secondary: #6b7280 (gray-600)
Borders: #e5e7eb (gray-200)
```

#### Dark Mode
```
Page Background: #0a0a0a
Card Background: #1a1a1a
Text Primary: #ffffff (white)
Text Secondary: #9ca3af (gray-400)
Borders: #1f2937 (gray-800)
```

#### Accent Colors
```
Emerald: #10b981 (Budget KPI, Active status)
Indigo: #6366f1 (Tools KPI, primary actions)
Orange: #f97316 (Departments KPI, Expiring status)
Pink: #ec4899 (Cost/User KPI)
Rose: #f43f5e (Unused status)
```

### Typography

- Font Family: System fonts (Inter fallback)
- Headers: font-bold, text-4xl/2xl/xl
- Body: text-base/sm
- Labels: text-xs uppercase tracking-wider

### Component Patterns

#### Cards
```html
<div class="bg-white dark:bg-[#1a1a1a] rounded-2xl p-5 border border-gray-100 dark:border-gray-800">
  <!-- Content -->
</div>
```

#### Buttons (Primary)
```html
<button class="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors">
  Action
</button>
```

#### Inputs
```html
<input class="w-full px-4 py-2.5 bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 
              rounded-xl text-gray-900 dark:text-white
              focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all">
```

#### Status Badges (SOLID backgrounds)
```html
<!-- Active -->
<span class="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500 text-white">Active</span>

<!-- Expiring -->
<span class="px-3 py-1 rounded-full text-xs font-bold bg-orange-500 text-white">Expiring</span>

<!-- Unused -->
<span class="px-3 py-1 rounded-full text-xs font-bold bg-rose-500 text-white">Unused</span>
```

Critical: Status badges must have SOLID backgrounds (bg-emerald-500), not transparent (bg-emerald-500/10).

### Transitions

All interactive elements use smooth transitions:
```css
transition-colors duration-300
```

---

## API Integration

### Base URL

```
https://tt-jsonserver-01.alt-tools.tech
```

### Endpoints

#### Analytics
```
GET /analytics
Response: {
  budget_overview: { monthly_limit, current_month_total, trend_percentage, ... },
  kpi_trends: { budget_change, tools_change, departments_change, ... },
  cost_analytics: { cost_per_user, active_users, ... }
}
```

#### Tools
```
GET /tools
GET /tools/:id
POST /tools
PUT /tools/:id
DELETE /tools/:id

Query Parameters:
- _sort: Field to sort by (e.g., "updated_at", "monthly_cost")
- _order: "asc" or "desc"
- _limit: Number of results
- status: Filter by status ("active", "expiring", "unused")
- name_like: Search by name
```

#### Tool Data Structure
```typescript
interface Tool {
  id: number;
  name: string;
  description: string;
  vendor: string;
  category: string;
  monthly_cost: number;
  previous_month_cost: number;
  owner_department: string;
  status: "active" | "unused" | "expiring";
  website_url: string;
  active_users_count: number;
  icon_url: string;
  created_at: string;
  updated_at: string;
}
```

### API Service Architecture

```typescript
@Injectable({ providedIn: 'root' })
export class ApiService {
  private API_URL = 'https://tt-jsonserver-01.alt-tools.tech';
  
  // State
  isLoading = signal<boolean>(false);
  error = signal<string | null>(null);
  
  // CRUD Methods
  getAllTools(): Observable<Tool[]> { /* ... */ }
  createTool(tool: Partial<Tool>): Observable<Tool> { /* ... */ }
  updateTool(id: number, tool: Partial<Tool>): Observable<Tool> { /* ... */ }
  deleteTool(id: number): Observable<void> { /* ... */ }
  
  // Error handling
  private handleError<T>(operation: string, result?: T) { /* ... */ }
}
```

Error Handling Strategy:
- All errors caught and logged
- User-friendly error messages
- Loading states managed via signals
- Graceful degradation (empty states)

### Tool Logos Integration

Uses Clearbit Logo API for real tool logos:

```typescript
getToolImageUrl(tool: Tool): string {
  if (tool.icon_url) return tool.icon_url;
  
  const clearbitMap: Record<string, string> = {
    'Slack': 'https://logo.clearbit.com/slack.com',
    'Figma': 'https://logo.clearbit.com/figma.com',
    'GitHub': 'https://logo.clearbit.com/github.com',
    // ...
  };
  
  return clearbitMap[tool.name] || '';
}
```

Fallback: SVG placeholder on image load error.

---

## Development Guidelines

### Code Style

- Use Signals for reactive state
- Prefer `computed()` over manual calculations
- Use `output()` for component events (not `@Output()`)
- Use `input()` for component inputs (not `@Input()`)
- Always type API responses
- Handle loading and error states explicitly

### Component Creation

```bash
# Create standalone component
ng generate component pages/example --standalone --skip-tests

# Create with inline template/styles
ng g c pages/example --standalone --skip-tests --inline-template --inline-style
```

### State Management Pattern

```typescript
export class ExampleComponent {
  // Input
  data = input.required<Type>();
  
  // Output
  dataChanged = output<Type>();
  
  // State
  localState = signal<Type>(initialValue);
  
  // Computed
  derived = computed(() => this.localState() * 2);
  
  // Methods
  handleAction(): void {
    this.localState.update(val => val + 1);
    this.dataChanged.emit(this.localState());
  }
}
```

### API Call Pattern

```typescript
ngOnInit(): void {
  this.isLoading.set(true);
  
  this.apiService.getData().subscribe({
    next: (data: Type) => {
      this.data.set(data);
      this.isLoading.set(false);
    },
    error: (err: any) => {
      this.error.set('Error message');
      this.isLoading.set(false);
      console.error('Operation failed:', err);
    }
  });
}
```

### Styling Best Practices

1. Use Tailwind utility classes
2. Group related utilities logically
3. Use `@apply` sparingly (only for repeated patterns)
4. Always include dark mode variants
5. Maintain consistent spacing (gap-4, gap-5, gap-6)
6. Use semantic color names (emerald, indigo, not green-500)

### Testing Checklist

Before committing:
- [ ] Dark mode works correctly
- [ ] Light mode works correctly
- [ ] All buttons are clickable and functional
- [ ] Forms validate correctly
- [ ] API calls handle errors gracefully
- [ ] Loading states display appropriately
- [ ] Empty states display when no data
- [ ] Responsive design works on mobile/tablet/desktop
- [ ] No console errors
- [ ] Theme toggle persists across page refreshes

---

## Known Issues and Decisions

### Tailwind 4 Incompatibility

Issue: Angular build system conflicts with Tailwind 4 beta syntax.

Solution: Using Tailwind 3.4.17 with traditional `@tailwind` directives.

Migration Path: When Tailwind 4 stable is released and Angular compatibility is confirmed, upgrade by:
1. Updating `tailwindcss` to 4.x
2. Updating styles.scss to use `@import "tailwindcss"`
3. Testing all components

### Signal Two-Way Binding in Forms

Issue: `[(ngModel)]` with Signals requires calling the signal as a function.

```html
<!-- Correct -->
<input [(ngModel)]="formData().name" />

<!-- Incorrect -->
<input [(ngModel)]="formData.name" />
```

### Router Active Link Detection

Issue: `routerLink` requires proper imports in standalone components.

```typescript
imports: [RouterLink, RouterLinkActive]  // Required
```

Not importing these will result in non-functional navigation links.

---

## Future Enhancements (Day 8 and Beyond)

### Day 8: Analytics Page (Planned)

- Cost evolution charts (line chart)
- Department breakdown (pie/donut chart)
- Top expensive tools (bar chart)
- Usage analytics and trends
- Time range picker (30d, 90d, 1y)
- Chart library integration (Recharts or Chart.js)

### Additional Improvements

- Unit tests for all components
- E2E tests for critical user flows
- Accessibility improvements (ARIA labels, keyboard navigation)
- Performance optimization (lazy loading, virtual scrolling)
- Internationalization (i18n)
- Advanced search with multiple criteria
- Export functionality (CSV, PDF)
- Real-time updates with WebSockets
- User permissions and role-based access

---

## Contributing

When contributing to this project:

1. Follow the existing code style and patterns
2. Maintain design consistency (colors, spacing, typography)
3. Test in both light and dark modes
4. Ensure responsive design works
5. Add TypeScript types for all new interfaces
6. Document any new architectural decisions
7. Update this README if adding new features or patterns

---

## Support

For questions or issues:
- Review the project architecture section
- Check known issues and decisions
- Examine existing component implementations as examples
- Refer to Angular 19 documentation for Signals and standalone components
- Consult Tailwind CSS 3.x documentation for styling

---

## License

This project is part of a technical assessment for Alt Employabilite.
