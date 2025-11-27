import { createConfig, http } from 'wagmi'
import {hardhat, sepolia} from 'wagmi/chains'
import { connectorsForWallets } from '@rainbow-me/rainbowkit'
import { injectedWallet } from '@rainbow-me/rainbowkit/wallets'

const connectors = connectorsForWallets(
    [
        {
            groupName: 'Recommended',
            wallets: [injectedWallet],
        },
    ],
    {
        appName: 'EnergyFlow',
        projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!,
    }
);

const target = process.env.NEXT_PUBLIC_CHAIN === 'sepolia' ? sepolia : hardhat

export const config = createConfig({
    chains: [target],
    transports: {
        [hardhat.id]: http(process.env.NEXT_PUBLIC_RPC_URL),
        [sepolia.id]: http(process.env.NEXT_PUBLIC_SEPOLIA_RPC_URL),
    },
    connectors,
    ssr: true
})
