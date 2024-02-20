const networkConfig = {
	31337: {
		name: "localhost",
		wethToken: "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
		lendingPoolAddressesProvider: "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5",
		daiEthPriceFeed: "0x773616E4d11A78F511299002da57A0a94577F1f4",
		daiToken: "0x6b175474e89094c44da98b954eedeac495271d0f",
	},
	11155111: {
		name: "sepolia",
		ethUsdPriceFeed: "0x694AA1769357215DE4FAC081bf1f309aDC325306",
		wethToken: "0x5b071b590a59395fE4025A0Ccc1FcC931AAc1830",
		lendingPoolAddressesProvider: "0x88757f2f99175387aB4C6a4b3067c77A695b0349",
		daiEthPriceFeed: "0x14866185B1962B63C3Ea9E03Bc1da838bab34C19",
		daiToken: "0xFf795577d9AC8bD7D90Ee22b6C1703490b6512FD",
	},
};

const developmentChains = ["hardhat", "localhost"];

module.exports = {
	networkConfig,
	developmentChains,
};
