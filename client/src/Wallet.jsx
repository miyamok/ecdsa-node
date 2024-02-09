import server from "./server";
import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";

function Wallet({ address, setAddress, privateKey, setPrivateKey, balance, setBalance }) {
  async function onChangePrivateKey(evt) {
    const privateKey = evt.target.value;
    // console.log(privateKey);
    setPrivateKey(privateKey);
    if (privateKey) {
      const publicKey = privateKeyToUncompressedPublicKey(privateKey);
      const address = uncompressedPublicKeyToAddress(publicKey);
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setAddress(address);
      setBalance(balance);
    } else {
      setAddress("");
      setBalance(0);
    }
  }

  function privateKeyToUncompressedPublicKey(privateKey) {
    const publicKey = secp256k1.getPublicKey(privateKey, false);
    return publicKey;
  }

  function uncompressedPublicKeyToAddress(publicKey) {
    return toHex(publicKey).slice(-20);
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input placeholder="Type a private key" value={privateKey} onChange={onChangePrivateKey}></input>
      </label>

      <div><span>Address:&nbsp;{address}</span></div>
      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
