import { ethers } from 'ethers';

// Oracle contract ABI
export const ORACLE_ABI = [
  "function getPrice(string symbol) view returns (uint256 price, uint256 timestamp)",
  "function updatePrice(string symbol, uint256 price, uint256 timestamp)",
  "function addDataSource(address source)",
  "function removeDataSource(address source)",
  "function getDataSources() view returns (address[])",
  "function isPriceUpdater(address account) view returns (bool)",
  "event PriceUpdated(string indexed symbol, uint256 price, uint256 timestamp, address updater)",
  "event DataSourceAdded(address indexed source)",
  "event DataSourceRemoved(address indexed source)"
];

// ERC20 Token ABI for staking
export const TOKEN_ABI = [
  "function approve(address spender, uint256 amount) returns (bool)",
  "function allowance(address owner, address spender) view returns (uint256)",
  "function balanceOf(address account) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)"
];

export class Web3Service {
  private provider: ethers.BrowserProvider | null = null;
  private signer: ethers.Signer | null = null;
  private oracleContract: ethers.Contract | null = null;

  async connect(): Promise<string> {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('MetaMask is not installed');
    }

    this.provider = new ethers.BrowserProvider(window.ethereum);
    await this.provider.send('eth_requestAccounts', []);
    
    this.signer = await this.provider.getSigner();
    const address = await this.signer.getAddress();

    // Initialize oracle contract
    const oracleAddress = process.env.NEXT_PUBLIC_ORACLE_CONTRACT_ADDRESS!;
    this.oracleContract = new ethers.Contract(oracleAddress, ORACLE_ABI, this.signer);

    return address;
  }

  async disconnect() {
    this.provider = null;
    this.signer = null;
    this.oracleContract = null;
  }

  async getChainId(): Promise<number> {
    if (!this.provider) throw new Error('Not connected');
    const network = await this.provider.getNetwork();
    return Number(network.chainId);
  }

  async switchChain(chainId: number) {
    if (!window.ethereum) throw new Error('MetaMask is not installed');

    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: `0x${chainId.toString(16)}` }],
      });
    } catch (error: any) {
      // Chain not added to MetaMask
      if (error.code === 4902) {
        throw new Error('Please add this chain to MetaMask');
      }
      throw error;
    }
  }

  async getPrice(symbol: string): Promise<{ price: number; timestamp: number }> {
    if (!this.oracleContract) throw new Error('Not connected');

    const [price, timestamp] = await this.oracleContract.getPrice(symbol);
    
    return {
      price: Number(ethers.formatUnits(price, 8)), // Assuming 8 decimals
      timestamp: Number(timestamp),
    };
  }

  async updatePrice(symbol: string, price: number): Promise<string> {
    if (!this.oracleContract) throw new Error('Not connected');

    const priceInUnits = ethers.parseUnits(price.toString(), 8);
    const timestamp = Math.floor(Date.now() / 1000);

    const tx = await this.oracleContract.updatePrice(symbol, priceInUnits, timestamp);
    const receipt = await tx.wait();

    return receipt.hash;
  }

  async isPriceUpdater(address: string): Promise<boolean> {
    if (!this.oracleContract) throw new Error('Not connected');
    return await this.oracleContract.isPriceUpdater(address);
  }

  async listenToPriceUpdates(
    symbol: string,
    callback: (price: number, timestamp: number, updater: string) => void
  ) {
    if (!this.oracleContract) throw new Error('Not connected');

    const filter = this.oracleContract.filters.PriceUpdated(symbol);
    
    this.oracleContract.on(filter, (symbol, price, timestamp, updater) => {
      callback(
        Number(ethers.formatUnits(price, 8)),
        Number(timestamp),
        updater
      );
    });
  }

  async stakeTokens(nodeAddress: string, amount: number, tokenAddress: string): Promise<string> {
    if (!this.signer) throw new Error('Not connected');

    const tokenContract = new ethers.Contract(tokenAddress, TOKEN_ABI, this.signer);
    
    // First approve the oracle contract to spend tokens
    const amountInUnits = ethers.parseUnits(amount.toString(), 18);
    const approveTx = await tokenContract.approve(nodeAddress, amountInUnits);
    await approveTx.wait();

    // Then stake (this would be implemented in the node contract)
    // For now, just return the approval tx hash
    return approveTx.hash;
  }
}

export const web3Service = new Web3Service();