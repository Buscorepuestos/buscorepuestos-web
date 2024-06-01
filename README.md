# Buscorepuesto website

We have decide to change the website to a new one, this time we are going to use Next.js, a React framework that allows
us to create a website with a better performance and SEO.

## Getting Started

We will use pnpm as package manager, you can install it with the following command:
To run the server we will use the following command:

```bash
$ pnpm install
$ pnpm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Technologies

We are going to use the following technologies:

-   Next.js
-   React
-   Tailwind CSS
-   TypeScript
-   ESLint
-   Prettier

## Architecture

About the architecture, we are going to follow the screaming architecture, which is a way to organize the code allow it
to scream what it is and what is use for.

So, for example, something similiar to this structure is what we here below:

```bash
└── src
    ├── assets
    └── modules
        ├── about
        ├── articles
        │   ├── components
        │   ├── design
        │   ├── hooks
        │   ├── lib
        │   ├── services
        │   └── states
        ├── auth
        ├── core
        │   ├── components
        │   ├── design
        │   ├── hooks
        │   ├── lib
        │   ├── services
        │   └── states
        └── payments
```

Also we will follow convention from next.js to keep our structure clean and easy to understand.

## Code Style

We are going to use ESLint and Prettier to keep our code clean and easy to read.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use
the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme)
from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for
more details.
