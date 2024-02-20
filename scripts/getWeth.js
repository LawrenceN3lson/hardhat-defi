const { getNamedAccounts, ethers, network } = require("hardhat");
const { networkConfig } = require("../helper-hardhat-config");
const AMOUNT = ethers.parseEther("0.01");
// 进行抵押，把 eth 换成 weth
async function getWeth() {
	const { deployer } = await getNamedAccounts();
	const { chainId } = network.config;
	const signer = await ethers.provider.getSigner();
	// 需要调用 weth 合约的 deposit 方法
	// 因此需要合约 abi, address
	const iWeth = await ethers.getContractAt("IWeth", networkConfig[chainId].wethToken, signer);
	const tx = await iWeth.deposit({ value: AMOUNT });
	await tx.wait();
	const wethBalance = await iWeth.balanceOf(deployer);
	console.log("wethBalance: ", wethBalance.toString());
}
module.exports = { getWeth, AMOUNT };
