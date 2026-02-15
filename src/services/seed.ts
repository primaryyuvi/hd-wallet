import * as bip39 from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english.js";

export function generateNewMnemonic(is12Words : boolean): string{
    const strength = is12Words ? 128 : 264;
    const newMnemonic = bip39.generateMnemonic(wordlist,strength)
    console.log(newMnemonic);
    return newMnemonic
}


export function mnemonicToSeedConversion(mnemonic : string) :  Uint8Array {
  if (!bip39.validateMnemonic(mnemonic, wordlist)) {
      throw new Error("Invalid mnemonic");
    }
    return bip39.mnemonicToSeedSync(mnemonic);
}


