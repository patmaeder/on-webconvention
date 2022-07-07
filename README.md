# Nuxt 3 Minimal Starter

Look at the [nuxt 3 documentation](https://v3.nuxtjs.org) to learn more.

## Setup

Make sure to install the dependencies:

```bash
# npm
npm install
```

Populate the environment inside `.env` with the JWT_SECRET which can be generated with the bash command `openssl rand -base64 12`.

#### Setup and migrate Prisma ORM

This project comes with a pre-configured SQLite database (/storage/db.sql) managed by the Prisma ORM. To migrate this database, run the following command **after** installing the project dependencies:

````bash
npx prisma migrate develop
````

The Prisma-Studio Dashboard for database-administration can then be accessed by running:

````bash
npx prisma studio
````

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

## Signaling Backend

This project uses the [Ion-SFU selective forwarding unit by Pion](https://github.com/pion/ion-sfu) to handle WebRTC Peers. To provide the signaling backend for this service, proceed with the following steps.

Clone the Pion Ion-SFU repository
```bash
git clone git@github.com:pion/ion-sfu.git
```
To start using the SFU with json-rpc signaling, switch to the Ion-SFU directory and start the signaling service using GoLang or Docker.

**Using golang environment**
```bash
go build ./cmd/signal/json-rpc/main.go && ./main -c config.toml
```

**Using Docker**
```bash
docker run -p 7000:7000 -p 5000-5200:5000-5200/udp pionwebrtc/ion-sfu:latest-jsonrpc
```

*Please note that the setup of the **Ion-SFU json-rpc signaling is essential for the web-meetings** to function. For development purposes or the usage of this app without the web-meeting capabilities, this step can be skipped.*

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
