const { ethers } = require("hardhat");
// 进行抵押，把 eth 换成 weth
async function getWeth({ getNamedAccounts }) {
	const { deployer } = await getNamedAccounts();
	// 需要调用 weth 合约的 deposit 方法
	// 因此需要合约 abi, address
}
module.exports = { getWeth };
