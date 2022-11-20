# KrakenFlex Backend Test

## Introduction
This repo contains the solution to KrakenFlex's backend test. This readme briefly explains the problem, my approach to the solution and instructions on how to run tests and the program.

## The Problem

This problem required me to write a program that did the following:

1. Retrieves all outages from a `GET /outages` endpoint
2. Retrieves information from a `GET /site-info/{siteId}` endpoint for the site with the ID `norwich-pear-tree`
3. Filters out any outages that began before `2022-01-01T00:00:00.000Z` or don't have an ID that is in the list of devices in the site information
4. For the remaining outages, it should attach the display name of the device in the site information to each appropriate outage
5. Sends this list of outages to `POST /site-outages/{siteId}` for the site with the ID `norwich-pear-tree`

An extra requirement was to write a program that was resilient to 500 error codes from the API.

## My Solution

I imagined that this problem would be related to a wider problem where outages have to be collected for a collection of sites. With this in mind I tried to make my solution adaptaple and wrote some generic functions that could be reused.

My solution is written in typescript and makes user of 3 external libraries: zod, jest and axios. Zod is a parsing library that is useful for giving type safety when receiving data from APIs or other external sources. I have jest to write a collection of unit tests that cover common scenarios such as the api returning an error response or an unexpected payload.

My solution implements a generic retry function which can be configured by the user to an appropriate number of retires. All of the API calls are then wrapped in this. This means that if the function fails on the final API call it doesn't have to start from the beginning but instead it can retry that single call.

## Usage instructions

1. Fork and clone the repo and then run the following to install dependencies:
```bash
npm install
```
2. To run the unit tests run the folowing:
```bash
npm test
```
3. The program relies on a valid API key being available as an environment variable. Run the following command to set this up and run the program:
```bash
export API_KEY=<API_KEY>
npm run process
```