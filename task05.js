require("dotenv").config();
const Client = require("bitcoin-core");

const client = new Client({
  host: `http://${process.env.HOST}:${process.env.PORT}`,
  username: process.env.USER,
  password: process.env.PASS,
});

const main = async () => {
  const mempool = await client.getRawMempool();
  //console.log(`Mempool size: ${mempool}`);
  console.log(`Mempool size: ${mempool.length}`);
  console.log(`Mempool size: ${await client.getBlockCount()}`);

  const firstTxId = mempool[0];
  //console.log(`First transaction ID: ${firstTxId}`);

  const firstTxRaw = await client.getRawTransaction(firstTxId, true);
  //console.log("firstTxRaw:", firstTxRaw);

  //const txSize = firstTxRaw.size;
  //console.log(`txSize: ${txSize}`);

  const firstTxHex = firstTxRaw.hex;
  console.log(`firstTxHex: ${firstTxHex}`);

  const outputs = firstTxRaw.vout;
  console.log("outputs:", outputs);

  const firstOutput = outputs[0];
  console.log("firstOutput:", firstOutput);

  console.log("value:", firstOutput.value);

  const script = firstOutput.scriptPubKey;
  console.log("script:", script);
};

main().catch((error) => console.error("Error:", error));

const listScriptTypes = async (limit = 100) => {
  const scriptTypes = new Map();
  let cnt = 0;

  const mempool = await client.getRawMempool();

  for (const txId of mempool) {
    console.log(`Parsing scripts from mempool transaction #${cnt++}`);

    try {
      const tx = await client.getRawTransaction(txId, true);

      if (Array.isArray(tx.vout)) {
        for (const out of tx.vout) {
          const scr = out.scriptPubKey;
          if (!scr) continue;
          if (!scriptTypes.has(scr.type)) {
            scriptTypes.set(scr.type, scr);
          }
        }
      }
    } catch (err) {}
    if (cnt >= limit) break;
  }
  console.log("\n*** POPIS SKRIPTI ***");
  for (const [type, scr] of scriptTypes.entries()) {
    console.log("\nVrsta skripte: " + type);
    console.log("Detalji:       " + JSON.stringify(scr, null, 2));
  }
};

//listScriptTypes().catch((err) => console.error("Error:", err));
