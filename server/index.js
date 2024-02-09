const express = require("express");
const app = express();
const cors = require("cors");
const { secp256k1 } = require("ethereum-cryptography/secp256k1");
const port = 3042;
const { toHex } = require("ethereum-cryptography/utils");
const { sha256 } = require("ethereum-cryptography/sha256.js");

app.use(cors());
app.use(express.json());

const balances = {
  "71cfda0a7e33b97e2e5d": 100,
  "9c977f81e8f5e04883fd": 50,
  "cb4f30596f080c785de4": 75,
  "d677262fcaa0ac5e01ab": 125,
  "c2ec244e93541bdfbc1d": 48,
};

const knownTokens = [];

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;

  res.send({ balance });
});

app.get("/balances", (req, res) => {
  res.send({ balances });
});

app.post("/send", (req, res) => {
  const { sender, amount, recipient, token, r, s, recovery } = req.body;
  const message = {
    sender,
    amount,
    recipient,
    token
  };
  const signature = new secp256k1.Signature(BigInt(r), BigInt(s), recovery);
  const messageHash = toHex(sha256(Uint8Array.from(message)));
  const publicKey = signature.recoverPublicKey(messageHash).toHex();
  if (knownTokens.includes(token)) {
    res.status(400).send({ message: "Contains an invalid token!" });
  } else {
    knownTokens.push(token);
    if (!secp256k1.verify(signature, messageHash, publicKey)) {
      res.status(400).send({ message: "Invalid signature!" });
    } else {
      setInitialBalance(sender);
      setInitialBalance(recipient);
      if (balances[sender] < amount) {
        res.status(400).send({ message: "Not enough funds!" });
      } else {
        balances[sender] -= amount;
        balances[recipient] += amount;
        res.send({ balance: balances[sender] });
      }
    }
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
