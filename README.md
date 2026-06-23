# AALIA Membership Campaign Portal

A minimal, responsive frontend application for the AALIA (Alumni Association) Membership Campaign Portal. Built with a modern React stack, this portal allows users to register, manage their membership status, and download their generated membership posters upon approval. Batch admins and super admins have a dashboard to manage members, batches, and approvals.

## Features

- **Role-Based Access Control**: Separate views and permissions for Members, Batch Admins, and Super Admins.
- **Member Dashboard**: Track registration progress (Registration → Payment → Approval → Poster), view profile, and download membership poster.
- **Admin Dashboard**: KPI stats, recent registrations, and pending approvals.
- **Member Management**: Data tables with search and filters, approve/reject workflows, and payment tracking.
- **Batch Management**: Create, edit, and manage batches. Generate join links for specific batches.
- **Modern UI/UX**: Dark/Light mode, Framer Motion animations, responsive layouts, and a clean, premium design aesthetic.

## Tech Stack

- **Framework**: React 19 + Vite
- **Styling**: Tailwind CSS v4
- **Routing**: React Router DOM
- **State & Data Fetching**: TanStack Query (React Query)
- **API Client**: Axios (with interceptors for token management)
- **Forms & Validation**: React Hook Form + Zod
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Notifications**: React Hot Toast

## Project Structure

```
src/
├── api/          # Axios client and mock API services
├── components/   # Reusable UI components, layout components, and data tables
├── context/      # React Context for Auth and Theme
├── constants/    # Global constants (roles, statuses, districts)
├── lib/          # Zod validation schemas and mock data
├── pages/        # Application pages (Auth, Dashboards, Management)
├── routes/       # Protected and Guest route wrappers
└── utils/        # Helper functions
```

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/Jouhar54/membership-front.git
   cd membership-front
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## Demo Accounts

The application is currently configured with a mock API layer for demonstration purposes. You can use the following credentials to test the different roles:

| Role | Email | Password |
| :--- | :--- | :--- |
| **Admin** | `admin@aalia.org` | Any 6+ characters |
| **Batch Admin** | `batchadmin@aalia.org` | Any 6+ characters |
| **Member** | *Any other email* | Any 6+ characters |

## License

This project is licensed under the MIT License.
