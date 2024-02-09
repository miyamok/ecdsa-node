import { useState } from "react";
import server from "./server";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";
import { sha256 } from "ethereum-cryptography/sha256.js";


function Transfer({ address, setBalance, privateKey }) {
  const [sendAmount, setSendAmount] = useState("");
  const [recipient, setRecipient] = useState("");

  const setValue = (setter) => (evt) => setter(evt.target.value);

  async function transfer(evt) {
    evt.preventDefault();

    const array = new Uint32Array(1);
    self.crypto.getRandomValues(array);
    const randomToken = array[0].toString();
    const message = {
      sender: address,
      amount: parseInt(sendAmount),
      recipient,
      token: randomToken,
    }
    const messageHash = toHex(sha256(Uint8Array.from(message)));
    const signature = secp256k1.sign(messageHash, privateKey);
    const {
      data: { balance },
    } = await server.post(`send`, {
      sender: address,
      amount: parseInt(sendAmount),
      recipient,
      token: randomToken,
      r: signature.r.toString(),
      s: signature.s.toString(),
      recovery: signature.recovery },
    );
    if (balance === undefined) {
      alert(ex.response.data.message);
    }
    setBalance(balance);
  }

  return (
    <form className="container transfer" onSubmit={transfer}>
      <h1>Send Transaction</h1>

      <label>
        Send Amount
        <input
          placeholder="1, 2, 3..."
          value={sendAmount}
          onChange={setValue(setSendAmount)}
        ></input>
      </label>

      <label>
        Recipient's address
        <input
          placeholder="Type an address, for example: 0x2"
          value={recipient}
          onChange={setValue(setRecipient)}
        ></input>
      </label>

      <input type="submit" className="button" value="Transfer" />
    </form>
  );
}

export default Transfer;
