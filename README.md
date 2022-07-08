# OnWebconvention

Table of contents:

- Setup
- Development Server
- Signaling Backend
- Production
- Deployment


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
npm run dev
```

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

## Deployment

We did use a DigitalOcean droplet for the deployment of the application. This instance was accessible via ssh under "calvin@on-webconvention.de".

Connect to the server and navigate to the folder "/srv/web-engineering". This is the cloned repository which contains this source-code. The file "/srv/.ssh/deploy_key" can be used as a ssh key to pull from our github repository.

Please provide an appropriate .postfix.env and .production.env file which matches the configuration of your server. Additional configuration can be done in `docker-compose.yaml`.

Example .postfix.env:

```
POSTFIX_myhostname=on-webconvention.de
ALLOWED_SENDER_DOMAINS=on-webconvention.de
DKIM_AUTOGENERATE=TRUE
RELAYHOST=[smtp.sendgrid.net]:587
RELAYHOST_USERNAME=apikey
RELAYHOST_PASSWORD=XXXXXX
POSTFIX_smtp_tls_security_level=encrypt
POSTFIX_header_size_limit=4096000
POSTFIX_smtp_sasl_security_options=noanonymous
POSTFIX_smtp_sasl_tls_security_options=noanonymous
```

(Postfix is here used as a bridge between the Node.js backend and the outgoing sendgrid server. You can configure your own custom mailserver which relies on no other services. Please see: https://github.com/bokysan/docker-postfix)

Example .production.env:

```
NODE_ENV=production
BASE_URL="https://on-webconvention.de"
DATABASE_URL="file:/usr/src/storage/db.sql"
SMTP_HOST="postfix"
SMTP_PORT=587
MAIL_HOST=https://on-webconvention.de/
MAIL_FROM_ADDRESS=info@on-webconvention.de
YJS_HOST="wss://on-webconvention.de:1234"
SFU_HOST="wss://on-webconvention.de:7002/ws"
JWT_SECRET=XXX
```

Last required step:

Run `sudo ./deploy.sh` in order to build the application using docker-compose and in order to spin it up. The application is now accessible under the VIRTUAL_HOST specified in your `docker-compose.yaml`.