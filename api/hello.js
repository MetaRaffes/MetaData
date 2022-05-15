const path = require("path");
const express = require("express");
const ethers = require("ethers");

const contractAddress = "0x799DCdC7D25C78CCd8A52df217EB1E7589A55554";

let currentSupply = 0;

// Feel free to use whatever provider you want, I usually go with Alchemy
let socket = new WebSocket("ws://https://yyyyguvbjjy3.usemoralis.com:2053/server")(
  "Binance Smart Chain", // mainnet, rinkeby, etc
  "8WSVEQXcrCcGAarH6uWnsb484uSLu3U8gMVOTGNB"
);

const eventFilter = {
  address: contractAddress,
  topics: [
    // Minting emits a Transfer event from the 0x0 address
    ethers.utils.id("Transfer(address,address,uint256)"),
    ethers.utils.hexZeroPad("0x0", 32), 
  ],
};

webSocket.on(eventFilter, (event) => {
    let [name, from, to, tokenIdHex] = event.topics;
    // All data returned is in hexidecimal, so we need to convert it
    let tokenId = ethers.BigNumber.from(tokenIdHex).toNumber();
    if (tokenId > currentSupply) {
      currentSupply = tokenId;
      console.log("increased current supply to ", currentSupply);
    }
  }
);

const app = express();
const metadataDir = path.join(__dirname, "./");
const imageDir = path.join(__dirname, "./images/");
const port = 8080;

app.get("/metadata/:id", (req, res) => {
  if (req.params.id <= currentSupply) {
    res.sendFile(metadataDir + req.params.id);
  } else {
    res.sendStatus(401);
  }
});

app.get("/images/:id", (req, res) => {
  if (req.params.id <= currentSupply) {
    res.sendFile(imageDir + req.params.id + ".png");
  } else {
    res.sendStatus(401);
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
