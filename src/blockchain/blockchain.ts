import * as crypto from 'crypto';

// Transfer of funds between two wallets
export class Transaction {
  constructor(
    public amount: number,
    public payer: string, // public key
    public payee: string, // public key
  ) {}

  toString() {
    return JSON.stringify(this);
  }
}

// Individual block on the chain
export class Block {
  public nonce = Math.round(Math.random() * 999999999);

  constructor(
    public prevHash: string,
    public transaction: Transaction,
    public ts = Date.now(),
  ) {}

  get hash(): string {
    const str = JSON.stringify(this);
    const hash = crypto.createHash('SHA256');
    hash.update(str).end();
    return hash.digest('hex');
  }
}

// The blockchain
export class Chain {
  // Singleton instance
  public static instance = new Chain();

  chain: Block[];

  constructor() {
    this.chain = [
      // Genesis block
      new Block('', new Transaction(100, 'satoshi', 'ivan')),
    ];
  }

  // Most recent block
  get lastBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  // Proof of work system
  public mine(nonce: number): number {
    let solution = 1;
    console.log('⛏️  mining...');

    while (true) {
      const hash = crypto.createHash('MD5');
      hash.update((nonce + solution).toString()).end();

      const attempt = hash.digest('hex');

      if (attempt.substr(0, 4) === '0000') {
        console.log(`Solved: ${solution}`);
        return solution;
      }

      solution += 1;
    }
  }

  // Add a new block to the chain if valid signature & proof of work is complete
  public addBlock(
    transaction: Transaction,
    senderPublicKey: string,
    signature: Buffer,
  ): void {
    const verify = crypto.createVerify('SHA256');
    verify.update(transaction.toString());

    const isValid = verify.verify(senderPublicKey, signature);

    if (isValid) {
      const newBlock = new Block(this.lastBlock.hash, transaction);
      this.mine(newBlock.nonce);
      this.chain.push(newBlock);
    }
  }
}

// Wallet gives a user a public/private keypair
export class Wallet {
  public publicKey: string;
  public privateKey: string;

  constructor() {
    const keypair = crypto.generateKeyPairSync('rsa', {
      modulusLength: 2048,
      publicKeyEncoding: { type: 'spki', format: 'pem' },
      privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });

    this.privateKey = keypair.privateKey;
    this.publicKey = keypair.publicKey;
  }

  public sendMoney(amount: number, payeePublicKey: string): void {
    const transaction = new Transaction(amount, this.publicKey, payeePublicKey);

    const sign = crypto.createSign('SHA256');
    sign.update(transaction.toString()).end();

    const signature = sign.sign(this.privateKey);
    Chain.instance.addBlock(transaction, this.publicKey, signature);
  }
}

// Users
export const owner = new Wallet();
export const user = new Wallet();
