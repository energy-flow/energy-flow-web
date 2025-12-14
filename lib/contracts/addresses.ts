export const CONTRACT_ADDRESSES = {
    // Hardhat local
    31337: {
        pricingDAO: "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9",
        EFT: "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
        AaveVault: "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318",
        EURC: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512", // MockEURC - update after deployment
        stablecoinDecimals: 6, // EURC has 6 decimals
    },
    // Sepolia
    11155111: {
        pricingDAO: "0x5325677B41090e00067807465B927B5cB13580Ce",
        EFT: "0xBEeb8a8b5a3F1C206b47907432c82Ecec9d99A84",
        AaveVault: "0x41c131B337c57bf08eBeb384bc498E40E3351A79",
        EURC: "0x6d906e526a4e2Ca02097BA9d0caA3c382F52278E", // EURS on Sepolia
        stablecoinDecimals: 2, // EURS has 2 decimals
    }
} as const;