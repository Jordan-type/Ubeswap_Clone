const MockCeloDollar = artifacts.require("MockCeloDollar");
const MockUbeswap = artifacts.require("MockUbeswap");
const YieldFarm = artifacts.require("yieldFarm");

module.exports = async function(deployer, network, accounts) {

    //  deploy mock celo dollar 
    await deployer.deploy(MockCeloDollar)
    const mcusdToken = await MockCeloDollar.deployed()

    //  deploy mock ubeswap
    await deployer.deploy(MockUbeswap)
    const mubeswapToken = await MockUbeswap.deployed()

    await deployer.deploy(YieldFarm, mcusdToken.address, mubeswapToken.address)
    const yieldFarm = await YieldFarm.deployed()

    await mubeswapToken.transfer(yieldFarm.address, '1000000000000000000000000')
    await mcusdToken.transfer('0x909B0DFE4267F7e2037807a71a9E06Eca8ea23dC', '100000000000000000000000')
}