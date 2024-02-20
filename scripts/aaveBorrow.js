const { duration } = require("@nomicfoundation/hardhat-network-helpers/dist/src/helpers/time");
const { getWeth, AMOUNT } = require("../scripts/getWeth");
const { ethers, network } = require("hardhat");
const BORROW_MODE = 2; // Variable borrow mode. Stable was disabled.

async function main() {
	await getWeth();
	const signer = await ethers.provider.getSigner();
	// 获取可交互借贷池合约
	const lendingPool = await getLendingPool(signer);
	const lendingPoolAddress = await lendingPool.getAddress();
	const wethAddress = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2";
	const daiAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
	// Approve 批准借贷池可以转移代币
	await approveErc20(wethAddress, lendingPoolAddress, AMOUNT, signer);
	// Deposit 把这些代币作为抵押品存入借贷池
	console.log("Deposit...");
	await lendingPool.deposit(wethAddress, AMOUNT, signer, 0);
	console.log("Deposit success!");

	let { availableBorrowsETH, totalDebtETH } = await getBorrowUserData(lendingPool, signer);
	const daiPrice = await getDAIPrice();
	const amountDaiToBorrow = (Number(availableBorrowsETH) * 0.95) / Number(daiPrice);
	console.log(`You can borrow ${amountDaiToBorrow} DAI.`);
	const amountDaiWei = ethers.parseEther(amountDaiToBorrow.toString());
	// Borrow 借贷
	await borrowDai(daiAddress, lendingPool, amountDaiWei, signer);
	await getBorrowUserData(lendingPool, signer);

	// Repay 还款
	await repayDai(daiAddress, lendingPool, amountDaiWei, signer);
	await getBorrowUserData(lendingPool, signer);
}

async function repayDai(daiAddress, lendingPool, amountDaiToRepay, account) {
	const lendingPoolAddress = await lendingPool.getAddress();
	await approveErc20(daiAddress, lendingPoolAddress, amountDaiToRepay, account);
	const repayTx = await lendingPool.repay(daiAddress, amountDaiToRepay, BORROW_MODE, account);
	await repayTx.wait(1);
	console.log("You've repaid!");
}

// 借贷 DAI
async function borrowDai(daiAddress, lendingPool, amountDaiToBorrow, account) {
	const borrowTx = await lendingPool.borrow(daiAddress, amountDaiToBorrow, BORROW_MODE, 0, account);
	await borrowTx.wait(1);
	console.log("You've borrowed!");
}

// 为了知道可以借多少DAI, 需要知道DAI的价格
async function getDAIPrice() {
	const daiEthPriceFeed = await ethers.getContractAt("AggregatorV3Interface", "0x773616E4d11A78F511299002da57A0a94577F1f4");
	const daiEthPrice = (await daiEthPriceFeed.latestRoundData())[1];
	console.log(`DAI/ETH price: ${daiEthPrice}`);
	return daiEthPrice;
}

// 从借贷池获取用户数据，包括有多少抵押品，多少债务，还能借多少
async function getBorrowUserData(lendingPool, account) {
	const { totalCollateralETH, totalDebtETH, availableBorrowsETH } = await lendingPool.getUserAccountData(account);
	console.log(`You have ${totalCollateralETH} worth of ETH deposited.`);
	console.log(`You have ${totalDebtETH} worth of ETH borrowed.`);
	console.log(`You can borrow ${availableBorrowsETH} worth of ETH.`);
	return { availableBorrowsETH, totalDebtETH };
}

async function approveErc20(erc20Address, spenderAddress, amount, signer) {
	const erc20Token = await ethers.getContractAt("IERC20", erc20Address, signer);
	txResponse = await erc20Token.approve(spenderAddress, amount);
	await txResponse.wait(1);
	console.log(`Approve ${amount} of ${erc20Address} to ${spenderAddress} success!`);
}

async function getLendingPool(account) {
	const lendingPoolAddressesProvider = await ethers.getContractAt(
		"ILendingPoolAddressesProvider",
		"0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5",
		account,
	);
	const lendingPoolAddress = await lendingPoolAddressesProvider.getLendingPool();
	const lendingPool = await ethers.getContractAt("ILendingPool", lendingPoolAddress, account);
	return lendingPool;
}
main()
	.then(() => process.exit(0))
	.catch((error) => {
		console.error(error);
		process.exit(1);
	});
