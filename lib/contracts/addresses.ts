export const CONTRACT_ADDRESSES = {
    // Hardhat local
    31337: {
        pricingDAO: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
        EFT: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
        AaveVault: "0xa513E6E4b8f2a923D98304ec87F64353C4D5C853"
    },
    // Sepolia
    11155111: {
        pricingDAO: "0x...",
        EFT: "0x...",
        AaveVault: "0x..."
    }
} as const;