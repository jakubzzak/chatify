# Chatify Infra

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Setup cdk

```bash
npm install -g aws-cdk
npx cdk bootstrap # only once per account
```

## Build App

### Server

```bash
make bundle-server
```

### Client

```bash
make bundle-client
```

## Deployment

```bash
npm run build # in case of any changes in the this infra project
npm run cdk:deploy
```
