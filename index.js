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

app.post("/webhook", async (req, res) => {
  const commit = req.body.head_commit;
  if (!commit) {
    console.log("❌ No se encontró 'head_commit' en el push.");
    return res.status(400).send("No se encontró el commit principal");
  }

  const hash = commit.id;
  const mensaje = commit.message;
  const fecha = Math.floor(new Date(commit.timestamp).getTime() / 1000);

  const posiblesEjercicios = ["Fibonacci", "Factorial", "Conversor"];
  const nombreEjercicio = posiblesEjercicios.find(e => mensaje.includes(e)) || "Fibonacci";

  const esTester = false; // O lógica para cambiar si lo deseas

  // 🟢 Mostrar en consola los datos que se enviarán
  console.log("📤 Enviando datos al contrato:");
  console.log("  ▶️ esTester:", esTester);
  console.log("  ▶️ nombreEjercicio:", nombreEjercicio);
  console.log("  ▶️ hash:", hash);
  console.log("  ▶️ mensaje:", mensaje);
  console.log("  ▶️ fechaCommit:", fecha);

  try {
    const tx = await contrato.registrarCommit(
      esTester,
      nombreEjercicio,
      hash,
      mensaje,
      fecha
    );
    console.log("⏳ Transacción enviada. Esperando confirmación...");
    await tx.wait();
    console.log("✅ Commit registrado correctamente.");
    res.status(200).send("Commit registrado correctamente");
  } catch (err) {
    console.error("❌ Error al registrar commit:", err);
    res.status(500).send("Error al registrar el commit");
  }
});

const PORT = 10000 || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Webhook server corriendo en http://localhost:${PORT}`);
});
