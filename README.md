# Bristol Common

Bristol Common is a Next.js 16 community storytelling platform for residents, local groups, and moderators. Members can register, verify their email, sign in, and create, edit, and delete their own community stories. Moderators can publish submissions and manage all content.

## Stack

- Next.js 16 App Router, TypeScript, Tailwind CSS
- MongoDB with Mongoose
- httpOnly, signed JWT cookie sessions
- bcrypt password hashing and Nodemailer email verification
- Vercel-ready deployment

## Local setup

1. Copy `.env.example` to `.env.local`.
2. Add a MongoDB connection string, a random `JWT_SECRET` of at least 32 characters, and optional Gmail SMTP app-password credentials.
3. Run `npm install` and `npm run dev`.

Email verification is required before login. For production, use a dedicated transactional email provider and configure MongoDB network access for the deployment platform.

## Deployment

Deploy the repository to Vercel, configure the variables from `.env.example` in the project settings, and set `NEXT_PUBLIC_APP_URL` to the production URL.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
