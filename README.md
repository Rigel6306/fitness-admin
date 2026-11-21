# Fitness Admin

Fitness Admin is a Next.js administration dashboard for managing gym members, memberships, workout schedules, analytics, and payments.

The application combines real-time Firebase/Firestore data with AI-generated workout and meal plans, plus PayHere payment notifications and cash-at-desk payment recording.

## Features

- Real-time member roster with name, phone, email, and membership-number search
- Active/inactive member filtering
- Member registration and profile editing
- Membership package and status management
- Member detail views with overview, workout, and analytics tabs
- AI-assisted workout plan generation
- AI-assisted personalized meal plan generation
- Gemini models with OpenAI fallback for AI-generated plans
- Payment transaction records and status filtering
- PayHere server-to-server payment notification handling
- Cash-at-desk payment recording
- Responsive dashboard, analytics, and payment views
- Animated, glass-style interface components

## Tech Stack

- [Next.js 16](https://nextjs.org/) with the App Router
- [React 19](https://react.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Firebase](https://firebase.google.com/) and Cloud Firestore
- [Tailwind CSS 4](https://tailwindcss.com/)
- [Recharts](https://recharts.org/) for charts
- [Motion](https://motion.dev/) for animations
- [Zod](https://zod.dev/) for form validation
- [Google Gemini](https://ai.google.dev/) and [OpenAI](https://platform.openai.com/) APIs
- [PayHere](https://www.payhere.lk/) for online payment notifications
- [ZXing](https://github.com/zxing-js/browser) and HTML5 QR Code for payment-related scanning

## Project Structure

```text
src/app/
  page.tsx                 # Dashboard
  members/                 # Member list and member detail pages
  payment/                 # Revenue and payment management
  api/
    ai-suggessions/        # Workout plan generation
    ai-meal-suggession/    # Meal plan generation
    payment/               # PayHere payment callback

src/components/
  home/                    # Dashboard widgets
  members/                 # Member, workout, and analytics components
  payment/                 # Payment panels and QR/cash workflows
  ui/                      # Shared UI and visual effect components

src/context/               # Shared member data context
src/hooks/                 # Firestore and analytical hooks
services/firebase.ts       # Firebase initialization
util/                      # Firestore CRUD and analytics utilities
public/                    # Images and static assets
```

## Prerequisites

- Node.js 20 or newer
- npm, pnpm, yarn, or Bun
- A Firebase project with Firestore enabled
- Google Gemini API credentials
- An OpenAI API key for AI fallbacks
- A PayHere account and merchant secret if payment notifications are enabled

## Environment Variables

Create a `.env.local` file in the project root:

```dotenv
# OpenAI fallback for workout and meal plan generation
OPEN_AI_API_KEY=your_openai_api_key

# Gemini API credentials
# The Google Gen AI SDK is configured to read credentials from the environment.
GEMINI_API_KEY=your_gemini_api_key

# PayHere server-side notification secret
PAYHERE_MERCHANT_SECRET=your_payhere_merchant_secret
```

Never commit real API keys or merchant secrets. Restart the development server after changing environment variables.

### Firebase Setup

Firebase is initialized in `services/firebase.ts`. The project currently uses a project-specific Firebase web configuration.

For deployment or a separate environment, replace that configuration with the values for the target Firebase project or move the values to `NEXT_PUBLIC_*` environment variables. Enable Firestore and configure authentication and Firestore security rules for your production users.

The application expects these Firestore collections:

- `users` - Member profiles and membership details
- `schedule` - Member workout schedules
- `payment` - Online and cash payment records
- `analyticalData` - Member analytics

## Getting Started

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create a production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |

## API Routes

### Workout Plans

`POST /api/ai-suggessions`

Generates a workout plan from member measurements, goals, experience level, and optional existing schedule/admin instructions.

Supported request fields include:

- `height`
- `weight`
- `goals`
- `experienceLevel`
- `promptType`
- `customPrompt`
- `scheduleData`
- `type` (`gemini` or `openAi`)

### Meal Plans

`POST /api/ai-meal-suggession`

Generates Sri Lankan-oriented meal plans based on body measurements, fasting protocol, target weight, and weekly weight-change pace.

Gemini is tried first, with Gemini Flash Lite and OpenAI fallbacks.

### Payment Callback

`POST /api/payment`

Receives PayHere payment notifications, verifies the PayHere MD5 signature, records successful payments in Firestore, and updates the member's membership status and validity period.

Configure this route as the PayHere notification URL and set `PAYHERE_MERCHANT_SECRET`.

## Development Notes

- Firestore queries are live-subscribed in several client components.
- AI routes return structured JSON for use in the member management UI.
- The PayHere callback uses server-side signature verification and should not be called as a normal browser route.
- Firebase configuration and access rules should be reviewed before deploying publicly.
- Placeholder dashboard values may appear in some analytical cards; connect them to live calculations before using the dashboard for production reporting.

## Build

```bash
npm run build
npm run start
```

The production build can be deployed to platforms that support Next.js, such as Vercel or a Node.js server.
