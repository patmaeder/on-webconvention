# Nuxt 3 Minimal Starter

Look at the [nuxt 3 documentation](https://v3.nuxtjs.org) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install
```

Populate the environment inside `.env` with the JWT_SECRET which can be generated with the bash command `openssl rand -base64 12`.

## Development Server

#### Option 1:

Start the development server on http://localhost:3000

```bash
npm run dev -- -o
```

#### Option 2:

If you want to setup the application with ddev, make sure to install docker and ddev on your machine: https://ddev.readthedocs.io/en/stable/#installation

Then execute the following commands:

```bash
# setup ddev container and start the project, this makes the application accessible behind a nginx proxy with added ssl and some development tools
ddev start
npm run dev
```

Your application is now accessible under: https://web-engineering.ddev.site/

Mailhog is accessible via https://web-engineering.ddev.site:8026/

_Please note that the **development setup** with ddev is **optional**. You can omit these steps and just run the command at the top of this section._

## Production

Build the application for production:

```bash
npm run build
```

Locally preview production build:

```bash
npm run preview
```

Checkout the [deployment documentation](https://v3.nuxtjs.org/docs/deployment) for more information.
