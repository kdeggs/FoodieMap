# Replit.md

## Overview

This is a full-stack restaurant discovery and tracking application built with a modern tech stack. The app allows users to discover, organize, and track restaurants using Google Places API. Key features include restaurant search, custom lists, check-ins, location mapping, and personal statistics tracking.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Map Integration**: Leaflet for interactive maps showing restaurant locations

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **API Design**: RESTful API with JSON responses
- **Development Server**: Custom Vite integration for hot reloading
- **Data Storage**: In-memory storage implementation with interface for future database integration
- **Restaurant Search**: Google Places API integration for real restaurant data
- **Validation**: Zod schemas for request/response validation

### Database Schema Design
- **ORM**: Drizzle ORM configured for PostgreSQL
- **Schema Structure**:
  - `restaurants`: Core restaurant data with location, ratings, and metadata
  - `restaurant_lists`: User-created categorized lists
  - `list_restaurants`: Many-to-many relationship between lists and restaurants
  - `check_ins`: Visit history with ratings and notes
- **Data Types**: UUID primary keys, decimal coordinates, timestamps, and JSONB for flexible data

### Authentication & Authorization
- Session-based authentication framework ready (connect-pg-simple for session storage)
- Currently operating without authentication for development

### Mobile-First Design
- Responsive design optimized for mobile devices
- Touch-friendly interface with floating action buttons and bottom navigation
- Progressive Web App capabilities through Vite configuration
- Simplified navigation without top tabs for cleaner mobile experience

## External Dependencies

### Core Framework Dependencies
- **React Ecosystem**: React 18 with TypeScript, React Query for state management
- **Build Tools**: Vite with React plugin, ESBuild for production builds
- **UI Framework**: Radix UI components with shadcn/ui, Tailwind CSS for styling

### Database & Backend
- **Database**: Neon Database (PostgreSQL) with Drizzle ORM
- **Server**: Express.js with TypeScript support via tsx
- **Session Management**: connect-pg-simple for PostgreSQL session storage

### Map & Location Services
- **Mapping**: Leaflet with react-leaflet for interactive maps
- **Geolocation**: Browser Geolocation API for location detection

### Development Tools
- **Replit Integration**: Cartographer plugin for development environment
- **Error Handling**: Runtime error overlay for development
- **Code Quality**: TypeScript strict mode, ESLint configuration ready

### UI & UX Libraries
- **Form Handling**: React Hook Form with Hookform resolvers
- **Date Handling**: date-fns for date manipulation
- **Icons**: Lucide React for consistent iconography
- **Carousel**: Embla Carousel for image/content sliding
- **Utility**: clsx and class-variance-authority for conditional styling

### Future Integrations Ready
- **Authentication**: OAuth providers and JWT tokens
- **Cloud Storage**: Asset management for restaurant photos
- **Push Notifications**: Service worker registration configured
- **Analytics**: Event tracking and user behavior analysis