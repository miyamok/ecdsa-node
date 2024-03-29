# Project ECDSA Node

Project Name:
ECDSA Node Project

Project Github URL:
https://github.com/miyamok/ecdsa-node

Project Description:

The objective of this project is to develop a client-server system of a centralized blockchain, which supports asset transfer with signature validation,
extending the prototype by the Alchemy Univeristy.
The provided code already has features of a centralized ledger and an asset transfer mechanism which allows anybody to send money to anybody without any authentication.
I have implemented additional features as below, so that the money transfer requires signature, making use of ECDSA.
- Asset belongs to an account which comes by a public-private key pair.  It is in principle the same as common cryptocurrencies.
- Incresed security for transactions due to signatures.  In order to send money, one has to own a corresponding private key to make a valid signature.
- Particularly preventing an attack to replay a transaction by eavesdropping.  The signed transaction is valid only once, hence even if an intercepter managed to capture the signed transaction data between the client and the server, there is no hope to repeat the same transaction.
- UI displaying a list of accounts and balance.

Here I describe a bit more about the revised message content for money transfer.
The message consists of additional data, token, as well as sender, amount, and recipient, which the provided prototype already had.
A token is a random number generated by the client for each transaction.
The signature is generated from a message which involves a token, hence each message is designed to be unique.
The server keeps a record of already used tokens (cf. knownTokens in server/index.js), and an attack by recycling a transaction message fails.

The message is signed by secp256k1.sign in client/Transfer.jsx .
The return value of it is a signature, which is sent to the server via server.post in client/Transfer.jsx together with data such as the above mentioned message as well as the signature.
A signature consists of fields involving BigInt, which requires string encoding due to a technical reason, that is done in
- Lines 35, 36 in client/Transfer.jsx for encoding
- Line 41 in server/index.js for decoding to retrieve BigInt.

In server/index.js the Signature is manually rebuilt from those three components (line 41) and verified (line 48).

The list of prepared private key and address pairs are found in server/secret.txt .
Also for convenience, the list is displayed in the web app, due to client/src/AddressList.jsx .

Below you find the original content readme.md provided by Alchemy University.

## ECDSA Node

This project is an example of using a client and server to facilitate transfers between different addresses. Since there is just a single server on the back-end handling transfers, this is clearly very centralized. We won't worry about distributed consensus for this project.

However, something that we would like to incoporate is Public Key Cryptography. By using Elliptic Curve Digital Signatures we can make it so the server only allows transfers that have been signed for by the person who owns the associated address.

### Video instructions
For an overview of this project as well as getting started instructions, check out the following video:

https://www.loom.com/share/0d3c74890b8e44a5918c4cacb3f646c4
 
### Client

The client folder contains a [react app](https://reactjs.org/) using [vite](https://vitejs.dev/). To get started, follow these steps:

1. Open up a terminal in the `/client` folder
2. Run `npm install` to install all the depedencies
3. Run `npm run dev` to start the application 
4. Now you should be able to visit the app at http://127.0.0.1:5173/

### Server

The server folder contains a node.js server using [express](https://expressjs.com/). To run the server, follow these steps:

1. Open a terminal within the `/server` folder 
2. Run `npm install` to install all the depedencies 
3. Run `node index` to start the server 

The application should connect to the default server port (3042) automatically! 

_Hint_ - Use [nodemon](https://www.npmjs.com/package/nodemon) instead of `node` to automatically restart the server on any changes.
