# Moltin & Algolia integration

## Status
- Functional

## Base functionality:
Adds moltin products to a third party search index.

Every 24 hours, updates those products and adds new products.

## Requirements:
1. Moltin account, [sign up here](https://accounts.moltin.com/register)
2. Serverless account, [sign up here](https://dashboard.serverless.com/)

Add in your Algolia or elastic search values to start sending data
Rename `.example.env` to `.env` and fill in the required values`

## Deploying
Built to be deployed using the serverless framework, configured for AWS.

To deploy, make sure you have your AWS creds configured https://serverless.com/framework/docs/providers/aws/guide/credentials#amazon-web-services

Ensure `serverless.yml` is set up as you want it.

`cd` to project root and run `serverless deploy`.
