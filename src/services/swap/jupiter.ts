import { Connection, VersionedTransaction, Keypair } from '@solana/web3.js';
import { createJupiterApiClient } from '@jup-ag/api';

const jupiterApi = createJupiterApiClient();

export interface SwapParams {
  connection: Connection;          
  walletKeypair: Keypair;       
  fromMint: string;                
  toMint: string;                   
  fromAmount: number;             
  slippageBps?: number; 
}

export interface SwapResult {
  success: boolean;
  signature?: string;
  inputAmount?: string;
  outputAmount?: string;
  priceImpactPct?: string;
  explorerUrl?: string;
  error?: string;
}

export async function executeJupiterSwap(params: SwapParams): Promise<SwapResult> {
  const {
    connection,
    walletKeypair,
    fromMint,
    toMint,
    fromAmount,
    slippageBps = 50, 
  } = params;

  try {
    console.log(`Getting quote: ${fromAmount} ${fromMint} → ${toMint}`);
    
    const quoteResponse = await jupiterApi.quoteGet({
      inputMint: fromMint,
      outputMint: toMint,
      amount: fromAmount, 
      slippageBps,
      onlyDirectRoutes: false,
      asLegacyTransaction: false,
    });

    if (!quoteResponse) {
      return {
        success: false,
        error: 'No swap route found for this token pair',
      };
    }

    console.log('Quote received:', {
      in: quoteResponse.inAmount,
      out: quoteResponse.outAmount,
      priceImpact: quoteResponse.priceImpactPct,
    });


    const swapResponse = await jupiterApi.swapPost({
      swapRequest: {
        quoteResponse,
        userPublicKey: walletKeypair.publicKey.toBase58(),
        wrapAndUnwrapSol: true, 
        dynamicComputeUnitLimit: true, 
        dynamicSlippage: true, 
      },
    });
    
    console.log(swapResponse)

    const swapTransactionBuf = Buffer.from(swapResponse.swapTransaction, 'base64');
    const transaction = VersionedTransaction.deserialize(swapTransactionBuf);
    transaction.sign([walletKeypair]);

    console.log('Sending transaction...');
    const signature = await connection.sendTransaction(transaction, {
      maxRetries: 3,
      skipPreflight: true,
    });

    console.log('Waiting for confirmation...');
    const latestBlockHash = await connection.getLatestBlockhash();
    
    await connection.confirmTransaction({
      blockhash: latestBlockHash.blockhash,
      lastValidBlockHeight: latestBlockHash.lastValidBlockHeight,
      signature: signature,
    }, 'confirmed');
    
    
    const isDevnet = connection.rpcEndpoint.includes('devnet');
    const explorerUrl = isDevnet 
      ? `https://explorer.solana.com/tx/${signature}?cluster=devnet`
      : `https://explorer.solana.com/tx/${signature}`;

    return {
      success: true,
      signature,
      inputAmount: quoteResponse.inAmount,
      outputAmount: quoteResponse.outAmount,
      priceImpactPct: quoteResponse.priceImpactPct,
      explorerUrl,
    };

  } catch (error: any) {
    console.error('Swap failed:', error);
    let errorMessage = error.message || 'Unknown error';
    if (errorMessage.includes('insufficient funds')) {
      errorMessage = 'Insufficient balance for this swap';
    } else if (errorMessage.includes('slippage')) {
      errorMessage = 'Price slippage exceeded. Try increasing slippage tolerance';
    } else if (errorMessage.includes('blockhash not found')) {
      errorMessage = 'Transaction expired. Please try again';
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}


export function toRawAmount(amount: number, decimals: number = 9): number {
  return Math.round(amount * Math.pow(10, decimals));
}


export function fromRawAmount(rawAmount: string | number, decimals: number = 9): number {
  return Number(rawAmount) / Math.pow(10, decimals);
}