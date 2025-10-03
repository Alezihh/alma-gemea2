# Overview

Alma Gêmea is a soul mate matching application that combines a React frontend with a Flask backend. The application allows users to submit personal information through an interactive multi-step form, view personalized messages about the reading, and then be redirected to a payment page. The system features a mystical, vibrant aesthetic with deep purples, vibrant magentas, and golden accents that evoke love and mystery. The app is in Portuguese and includes a sequential messaging experience before payment.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **React SPA**: Built with Vite and TypeScript for modern development experience
- **Component Library**: Uses shadcn/ui components built on Radix UI primitives for consistent, accessible UI
- **Styling**: Tailwind CSS with custom romantic color scheme and animations
- **State Management**: React Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation for type-safe form management

## Backend Architecture
- **Proxy Setup**: Express.js server acts as a proxy to a Flask backend service
- **API Integration**: All `/api/*` requests are forwarded to Flask backend at configurable URL
- **Development Support**: Vite integration for hot module replacement and development tooling

## Data Flow
- **Form Submission**: 7-step multi-step form collects user data (name, birthdate, city, zodiac sign, height, email, and 3 tarot cards)
- **Tarot Selection**: Interactive tarot card flip animation where cards start face-down and reveal when selected
- **Tarot Transition Modal**: 6-second animated modal with mystical messaging
- **Loading Modal**: Shows "Analisando sua essência..." while API processes the request
- **API Processing**: Data is sent to Flask backend which returns a matched profile and unique token
- **Messages Modal (NEW)**: Sequential display of 5 messages explaining the service value (R$ 19,90) and building trust, each appearing with 3-second intervals
- **Payment Redirect**: After user confirms trust by clicking button, redirect to Kirvano payment page (https://pay.kirvano.com/e4c41901-7afa-47a8-a3ea-160341cc2d01)

## UI/UX Design Patterns
- **Progressive Disclosure**: Multi-step form breaks complex data collection into digestible steps
- **Tarot Card Selection**: 8-card organized grid layout (reduced from 16 scattered cards) with mystical purple/magenta backgrounds, golden borders, and glow effects. Cards show moon 🌙 symbol and "TAROT" text on face-down state.
- **Loading States**: Animated loading modal with mystical messaging during processing, including special tarot transition screen with love-gradient effects
- **Responsive Design**: Mobile-first approach with glass morphism effects, floating animations, and mystical pulse animations
- **Accessibility**: Built on Radix UI primitives ensuring WCAG compliance

## Design System (Updated: October 2025)
**Mystical Vibrant Color Palette:**
- **Background**: Deep mystical purple `hsl(270 40% 12%)` with gradient overlay
- **Primary**: Vibrant magenta `hsl(330 85% 55%)` - used for main CTAs and highlights
- **Secondary**: Purple `hsl(270 70% 55%)` - used for supporting elements
- **Accent**: Golden/orange `hsl(35 100% 60%)` - used for borders, icons, and emphasis
- **Foreground**: Light golden `hsl(45 100% 95%)` - primary text color

**Key Visual Effects:**
- **love-gradient**: Magenta → Purple → Golden gradient for primary buttons
- **mystic-gradient**: Purple shades gradient for card backgrounds
- **mystic-glow**: Multi-color glow effect (magenta, purple, golden halos)
- **text-gradient**: Animated shimmer gradient for headings
- **animate-mystical-pulse**: Pulsing glow animation on interactive elements
- **animate-shimmer**: Horizontal shimmer effect on gradients
- **glass-effect**: Purple-tinted semi-transparent backgrounds with blur

**Typography:**
- **Primary Serif**: Cinzel (mystical, elegant feel for headings and important text)
- **Secondary Serif**: Playfair Display (fallback)
- **Sans Serif**: Inter (body text and UI elements)

## Error Handling
- **Form Validation**: Client-side validation with Zod schemas and user-friendly error messages
- **API Error Recovery**: Graceful handling of backend connectivity issues with user feedback
- **404 Handling**: Custom not found page for invalid routes or tokens

# Recent Changes (October 2025)

## Facebook Pixel Integration (October 2, 2025)
- Integrated Facebook Pixel conversion tracking via Conversions API
- Added `/api/track-conversion/:token` endpoint that tracks Purchase events before payment redirect
- User email is hashed with SHA256 for privacy compliance
- Conversion event includes: event_name="Purchase", currency="BRL", value=19.90
- Fixed Express routing issue by explicitly setting Content-Type headers to prevent Vite middleware interference
- Backend uses environment variables: FACEBOOK_PIXEL_ID and FACEBOOK_ACCESS_TOKEN

## Messages Modal Implementation
- Added MessagesModal component that displays 5 sequential messages before payment redirect
- Messages explain the R$ 19,90 symbolic value and build trust with the user
- Each message appears with smooth fade-in animation and 3-second delay
- Final message prompts user confirmation before proceeding to payment
- Button text: "Sim, Pode Confiar!"
- Frontend calls `/api/track-conversion/:token` when user clicks confirmation button

## Video Sound Fix
- Changed YouTube embed parameter from `mute=1` to `mute=0` to enable audio
- Note: Browser autoplay policies may still require user interaction for sound

## Z-Index and Overlay Fixes
- Fixed text overlap issues by adjusting modal z-indexes
- TarotTransitionModal and LoadingModal: z-[150]
- MultiStepForm: z-[100], hides (opacity-0) when transition modal is active
- MessagesModal: z-[150] for proper layering

## Backend Proxy Improvements
- Replaced http-proxy-middleware with manual fetch()-based routing for better reliability
- Fixed PostgreSQL SSL connection issues by adding pool_pre_ping=True and pool_recycle=300
- Express proxy successfully forwards requests to Flask backend
- Fixed email validation using z.union() for clearer logic

# External Dependencies

## Frontend Dependencies
- **UI Framework**: React 18 with TypeScript for type safety
- **Build Tool**: Vite for fast development and optimized production builds
- **Component System**: Radix UI primitives with shadcn/ui for consistent design system
- **Styling**: Tailwind CSS with PostCSS for utility-first styling
- **Form Management**: React Hook Form with Hookform Resolvers for validation integration
- **Data Fetching**: TanStack React Query for server state management
- **Validation**: Zod for runtime type checking and form validation
- **Routing**: Wouter for lightweight client-side routing
- **Date Handling**: date-fns for date manipulation and formatting

## Backend Integration
- **Express.js**: Serves as proxy layer to Flask backend
- **HTTP Proxy Middleware**: Routes API requests to Flask service
- **Flask Backend**: Expected to run on configurable URL (default: localhost:8000)

## Development Tools
- **TypeScript**: Full type safety across the application
- **ESBuild**: Fast bundling for production builds
- **Replit Integration**: Custom plugins for Replit development environment
- **Development Server**: Vite dev server with HMR and error overlay

## Database Configuration
- **Drizzle ORM**: Configured for PostgreSQL with Neon Database serverless driver
- **Schema Location**: Shared schema definitions in `/shared/schema.ts`
- **Migration Support**: Drizzle Kit for database schema migrations

## External Services
- **Neon Database**: Serverless PostgreSQL database service
- **Unsplash**: Image hosting for profile pictures (based on sample data)
- **Font Services**: Google Fonts for typography (Playfair Display, Inter)

## Environment Variables
- **DATABASE_URL**: PostgreSQL connection string for database access
- **FLASK_URL**: Configurable Flask backend service URL
- **NODE_ENV**: Environment configuration for development/production modes
- **FACEBOOK_PIXEL_ID**: Facebook Pixel ID for conversion tracking
- **FACEBOOK_ACCESS_TOKEN**: Facebook Graph API access token for Conversions API