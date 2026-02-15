import {
  Connection,
  PublicKey,
  Keypair,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
  sendAndConfirmTransaction
} from "@solana/web3.js";


export async function getSolBalance(
  conn : Connection,
  address: string,
): Promise<number> {
  const lamports = await conn.getBalance(new PublicKey(address));
  console.log(lamports)
  return lamports / LAMPORTS_PER_SOL;
}

export async function getSplBalances(
  conn : Connection,
  address: string
) {
  const owner = new PublicKey(address);

  const accounts = await conn.getParsedTokenAccountsByOwner(owner, {
    programId: new PublicKey(
      "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"
    ),
  });

  return accounts.value.map(a => {
    const info: any = a.account.data.parsed.info;
    return {
      mint: info.mint,
      amount: info.tokenAmount.uiAmount,
      decimals: info.tokenAmount.decimals,
      ata: a.pubkey.toBase58(),
    };
  });
}


export async function sendSol(
  conn : Connection,
  fromSecretKey: Uint8Array,
  to: string,
  amountSol: number,
) {
  const sender = Keypair.fromSecretKey(fromSecretKey);
  const { blockhash } =
      await conn.getLatestBlockhash();
  const tx = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: sender.publicKey,
      toPubkey: new PublicKey(to),
      lamports: amountSol * LAMPORTS_PER_SOL,
    })
  );

  tx.feePayer = sender.publicKey;
  tx.recentBlockhash = blockhash;

  tx.sign(sender);
  const sig = await sendAndConfirmTransaction(
    conn,
    tx,
    [sender],
    { commitment: "confirmed" }
  );
  return sig;
}


