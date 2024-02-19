const { getNamedAccounts, ethers } = require("hardhat");
const AMOUNT = ethers.parseEther("0.02");
// 进行抵押，把 eth 换成 weth
async function getWeth() {
	const { deployer } = await getNamedAccounts();
	const signer = await ethers.provider.getSigner();
	// 需要调用 weth 合约的 deposit 方法
	// 因此需要合约 abi, address
	const iWeth = await ethers.getContractAt("IWeth", "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2", signer);
	const tx = await iWeth.deposit({ value: AMOUNT });
	await tx.wait();
	const wethBalance = await iWeth.balanceOf(deployer);
	console.log("wethBalance: ", wethBalance.toString());
}
module.exports = { getWeth };
