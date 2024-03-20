import "@rainbow-me/rainbowkit/styles.css";

import { connectorsForWallets } from "@rainbow-me/rainbowkit";
import {
  braveWallet,
  coinbaseWallet,
  injectedWallet,
  metaMaskWallet,
  okxWallet,
  rabbyWallet,
  rainbowWallet,
  walletConnectWallet,
} from "@rainbow-me/rainbowkit/wallets";
import { Environment } from "src/helpers/environment/Environment/Environment";
import { configureChains, createClient } from "wagmi";
import { arbitrum, arbitrumGoerli, avalanche, boba, fantom, goerli, mainnet, bscTestnet } from "wagmi/chains";
import { alchemyProvider } from "wagmi/providers/alchemy";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import { publicProvider } from "wagmi/providers/public";
import BaseETHIcon from "src/assets/icons/base.png";

export const { chains, provider, webSocketProvider } = configureChains(
  [
    // {
    //   id: 8453,
    //   network: "base",
    //   name: "Base",
    //   iconUrl: BaseETHIcon,
    //   nativeCurrency: { name: "Base", symbol: "ETH", decimals: 18 },
    //   rpcUrls: {
    //     default: {
    //       http: ["https://base.blockpi.network/v1/rpc/public"],
    //     },
    //     public: {
    //       http: ["https://base.blockpi.network/v1/rpc/public"],
    //     },
    //   },
    //   blockExplorers: {
    //     blockscout: {
    //       name: "Basescout",
    //       url: "https://base.blockscout.com",
    //     },
    //     default: {
    //       name: "Basescan",
    //       url: "https://basescan.org",
    //     },
    //     etherscan: {
    //       name: "Basescan",
    //       url: "https://basescan.org",
    //     },
    //   },
    //   contracts: {
    //     multicall3: {
    //       address: "0xca11bde05977b3631167028862be2a173976ca11",
    //       blockCreated: 5022,
    //     },
    //   },
    // },
    mainnet,
    // bscTestnet
    // goerli,
  ],
  [
    // jsonRpcProvider({ rpc: chain => ({ http: chain.rpcUrls.default }) }),
    jsonRpcProvider({ rpc: chain => ({ http: chain.rpcUrls.default.http[0] }) }),
    alchemyProvider({ apiKey: import.meta.env.VITE_ALCHEMY_ID }),
    publicProvider(),
  ],
);

const needsInjectedWalletFallback =
  typeof window !== "undefined" && window.ethereum && !window.ethereum.isMetaMask && !window.ethereum.isCoinbaseWallet;

const walletConnectProjectId = Environment.getWalletConnectProjectId() as string;

const connectors = connectorsForWallets([
  {
    groupName: "Recommended",
    wallets: [
      metaMaskWallet({ projectId: walletConnectProjectId, chains, shimDisconnect: true }),
      braveWallet({ chains, shimDisconnect: true }),
      rainbowWallet({ projectId: walletConnectProjectId, chains }),
      walletConnectWallet({ projectId: walletConnectProjectId, chains }),
      coinbaseWallet({ appName: "NodeSynapse", chains }),
      rabbyWallet({ chains, shimDisconnect: true }),
      okxWallet({ projectId: walletConnectProjectId, chains }),
      ...(needsInjectedWalletFallback ? [injectedWallet({ chains, shimDisconnect: true })] : []),
    ],
  },
]);

export const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
});
