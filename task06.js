require("dotenv").config();
const readline = require("readline");
const Client = require("bitcoin-core");

const client = new Client({
  host: `http://${process.env.HOST}:${process.env.PORT}`,
  username: process.env.USER,
  password: process.env.PASS,
});

const main = async () => {
  const mempool = await client.getRawMempool();
  //console.log(`Mempool size: ${mempool}`)

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question("Enter block height: ", async (input) => {
    rl.close();
    const blockTxNum = await client.getBlockStats(Number(input.trim()));
    console.log(`blockTxNum ${blockTxNum["txs"]}`);
  });
};

main().catch((error) => console.log("Error:", error));
