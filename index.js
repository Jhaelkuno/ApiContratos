require("dotenv").config();
const express = require("express");
const { ethers } = require("ethers");

const app = express();
app.use(express.json());

const RPC_URL = 'https://sepolia.infura.io/v3/30f0d0513a644d3ea2ac6b57613448da';
const PRIVATE_KEY = 'b53f16b50d1cf103bd38378d44dc0b05bbbdfe094828297350a433fbc8620671';
const CONTRATO_ADDRESS = '0x2437266E70E770bf0851aAE3886aAE0DE6E15519';

const abi = [
  "function registrarCommit(bool esTester, string nombreEjercicio, string hash, string mensaje, uint fechaCommit) public"
];

const provider = new ethers.JsonRpcProvider(RPC_URL);
const wallet = new ethers.Wallet(PRIVATE_KEY, provider);
const contrato = new ethers.Contract(CONTRATO_ADDRESS, abi, wallet);

app.post("/webhook", (req, res) => {
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);

  // Siempre responde 200 para que GitHub no marque error
  res.status(200).send("Recibido");
});

const PORT = 10000 || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Webhook server corriendo en http://localhost:${PORT}`);
});
