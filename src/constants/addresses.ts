import { NetworkId } from "src/constants";

export type AddressMap = Partial<Record<NetworkId, string>>;

export const MILK_ADDRESSES = {
  [NetworkId.TESTNET_GOERLI]: "0x38d54A4060F14686eD6a07baEa3AECb4AeCE98FB",
  [NetworkId.BASE]: "0x117908E5fbC5F77DAF07D4263bA79eE810b092f4",
};

export const ETH_FEED_ADDRESS = {
  [NetworkId.TESTNET_GOERLI]: "0x38d54A4060F14686eD6a07baEa3AECb4AeCE98FB",
  [NetworkId.BASE]: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
  [NetworkId.MAINNET]: "0x5f4eC3Df9cbd43714FE2740f5E3616155c5b8419",
};

export const NODE_MANAGER = {
  [NetworkId.TESTNET_GOERLI]: "0x46CA1d921f9c92501D582E39f63b0E35027e62ed",
  [NetworkId.BASE]: "0x51403ED41C73174effc541Cc7bBF783B6602D2ca",
};

export const MILK_ETH_LP_ADDRESSES = {
  [NetworkId.TESTNET_GOERLI]: "0x935770eBE6E046c7775A0CAa06E45Bc6a3aF367b",
  [NetworkId.BASE]: "0x3cd93aa08f1a67d4e5f17011eb0d749596292d71",
};

export const BUY_LINK = {
  [NetworkId.TESTNET_GOERLI]: "https://app.uniswap.org/#/swap?inputCurrency=ETH&outputCurrency=",
  [NetworkId.BASE]: "https://baseswap.fi/basicswap?inputCurrency=ETH&outputCurrency=",
};

export const MULTICALL_ADDRESS = {
  [NetworkId.TESTNET_GOERLI]: "0x5BA1e12693Dc8F9c48aAD8770482f4739bEeD696",
  [NetworkId.BASE]: "0x53e5228054875Ecd43e5B9ecDDA0E992A169c89e",
};

export const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

export const RPC_URL = "https://rpc.cryptotigernode.club/v1/mainnet";

export const WETH_ADDRESSES = {
  [NetworkId.BASE]: "0x4200000000000000000000000000000000000006",
};
