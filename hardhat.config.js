import "@nomicfoundation/hardhat-toolbox";
import "dotenv/config";

export default {
  solidity: "0.8.20",
  networks: {
    base: {
      url: "https://mainnet.base.org",
      accounts: [process.env.PRIVATE_KEY].filter(Boolean),
    }
  }
};