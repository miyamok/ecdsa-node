import { useState } from "react";
import server from "./server";

function AddressList({}) {
  const [addressList, setAddressList] = useState([]);

  async function getAddressList() {
    const {
      data: { balances },
    } = await server.get(`balances`);
    setAddressList(balances);
  }

    const rows=[];
    for (const [k, v] of Object.entries(addressList)) {
        rows.push(<span><div>{k}</div>&nbsp;<div>{v}</div></span>)
    }
    return (
        <div className="container list" onLoad={getAddressList} >
          <h1>Address / private key</h1>
          <span><div>c2ec244e93541bdfbc1d &nbsp; / &nbsp; 0a9c0af019f906521f9bc180f511936783d6a9d80bb1ec370898e38dd18e2d7d</div></span>
          <span><div>d677262fcaa0ac5e01ab &nbsp; / &nbsp; 1af7a9af8151a4778b7c6abd3f3fd0c980dc9b22dea66eea3eb88ffc17077aee</div></span>
          <span><div>cb4f30596f080c785de4 &nbsp; / &nbsp; b040eb187a60b7473db7efb7820f2875b32e39e5833761a80787708b00fb3dba</div></span>
          <span><div>9c977f81e8f5e04883fd &nbsp; / &nbsp; 95d7f67323f27577cc61244c3c6b00dfd9e715f6c37cec454d845c5783cf38ab</div></span>
          <span><div>71cfda0a7e33b97e2e5d &nbsp; / &nbsp; 54c93cfc72c546d2ae7715fd31eead0d0e5de3d9199c635dede5090215498542</div></span>
        </div>
      );
    
}

export default AddressList;