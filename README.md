# Blockchain Nanodegree - Project 2 - Web API to Private Blockchain

A Web API implemented in Expressjs to access a private blockchain persisted with leveldb.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites and Install
Ensure the following packages are installed with nodejs "npm install":  
level  
express  
body-parser  
crypto-js  

### Executing
Web API is implemented in Expressjs  
Run app.js will initialise a web server at port 8000

### API Endpoints

1) GET Endpoint to retrieve a block by index, url: "/api/block/:index"  
  Returns block JSON as a string  

2) POST Endpoint to add a new Block, url: "/api/block"  
  Adds block to the chain and returns this block JSON as a string  


