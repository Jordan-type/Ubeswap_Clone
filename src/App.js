import React, { useState, useEffect } from 'react'
import Web3 from "web3"
import { newKitFromWeb3,  } from "@celo/contractkit"
import BigNumber from "bignumber.js"

// contract ABIs
import MockCeloDollar from "./abis/MockCeloDollar.json"
import MockUbeswap from "./abis/MockUbeswap.json"
import YieldFarm from "./abis/YieldFarm.json"


// components 
import Navbar from './components/Navbar'
import Main from './components/Main'
import './App.css'

const ERC20_DECIMALS = 18

function App() {

  const [account, setAccount ] = useState('0x..');
  const [celoBalance, setCeloBalance] = useState(0);
  const [cUSDBalance, setcUSDBalance] = useState(0);
  const [mcusdToken, setMCusdToken] = useState({});
  const [mubeswapToken, setMUbeswapToken] = useState({});
  const [yieldFarm, setYieldFarm] = useState({});
  const [mcusdTokenBalance, setMcusdTokenBalance] = useState(0);
  const [mubeswapTokenBalance, setMubeswapTokenBalance] = useState(0);
  const [stakingBalance, setStakingBalance] = useState(0);
  const [kit, setKit] = useState(null);

  // connect to celo extension wallet 
  const loadWeb3wallet = async () => {
    if(window.celo) {
      window.alert("Ubeswap Clone would like to connect to your wallet please approve Ubeswap to use celo web wallet")
      try {
        await window.celo.enable()
      } catch(error) {
        window.alert(error)
      }
    } else {
      window.alert( 'please install the celo extension wallet')
    }
  }

  // load network Id || wallet address || balances || smart contract data
  const loadBlockchainData = async () => {
    const web3 = new Web3(window.celo)
    let kit = newKitFromWeb3(web3)

    // select account and setAccount
    const accounts = await kit.web3.eth.getAccounts()
    const account = accounts[0]
    console.log(account)

    // select network Id
    const networkId = await web3.eth.net.getId()

    // load mock celo dollar smart contract
    const mcusdTokenData = MockCeloDollar.networks[networkId]
    // load mock ubeswap smart contract
    const mubeswapTokenData = MockUbeswap.networks[networkId]
    // load yieldfarm smart contract
    const yieldFarmData = YieldFarm.networks[networkId]

    // check if the mock celo dollar contract is deployed in the network selected
    if(mcusdTokenData) {
      const mcusdToken = new kit.web3.eth.Contract(MockCeloDollar.abi, mcusdTokenData.address)
      console.log("Mock cUSD", mcusdToken)
      setMCusdToken(mcusdToken)

      // load mock token  balance
      let TokenBalancemcusd = await mcusdToken.methods.balanceOf(account).call()
      const mcusdTokenBalance = TokenBalancemcusd.toString(2)
      console.log("Mock Token balance", mcusdTokenBalance)
      setMcusdTokenBalance(mcusdTokenBalance)
    } else {
      window.alert("Mock cUSD Token contract not deployed on the selected network")
    }

    // check if the mock ubeswap contract is deployed in the network selected
    if(mubeswapTokenData) {
      const mubeswapToken = new kit.web3.eth.Contract(MockUbeswap.abi, mubeswapTokenData.address)
      console.log("Mock UBC", mubeswapToken)
      setMUbeswapToken(mubeswapToken)

      // load mock token balance
      let TokenBalancemubeswap = await mubeswapToken.methods.balanceOf(account).call()
      const mubeswapTokenBalance = TokenBalancemubeswap.toString(2)
      console.log("Mock Token balance", mubeswapTokenBalance)
      setMubeswapTokenBalance(mubeswapTokenBalance)
    } else {
      window.alert("Mock Ubeswap Token contract not deployed on the selected network")
    }

    // check if the yieldfarm contract is deployed in the network selected
    if(yieldFarmData) {
      const yieldFarm = new kit.web3.eth.Contract(YieldFarm.abi, yieldFarmData.address)
      console.log('yield farm', yieldFarm)
      setYieldFarm(yieldFarm)

      let BalanceStaking = await yieldFarm.methods.stakingBalance(account).call()
      const stakingBalance = BalanceStaking.toString(2)
      setStakingBalance(stakingBalance)
    } else {
       window.alert('YieldFarm contract not deployed to the select network.')
    }

    

    setAccount(account)
    setKit(kit)
  }

  // get the default celo tokens balance
  const getBalance = async () => {
    const balance = await kit.getTotalBalance(account)
    const celoBalance = balance.CELO.shiftedBy(-ERC20_DECIMALS).toFixed(2)
    const cUSDBalance = balance.cUSD.shiftedBy(-ERC20_DECIMALS).toFixed(2)
    // const cEUROBalance = balance.cEURO.shiftedBy(-ERC20_DECIMALS).toFixed(2)

    setCeloBalance(celoBalance)
    setcUSDBalance(cUSDBalance)
  }
  // console.log("mcusd address", mcusdToken._address)
  // stake tokens
  const stakeTokens = async (_amount) => {
    try {
      const stabletoken = await kit.contracts.getStableToken()
      // const amountIn = new BigNumber(_amount).shiftedBy(ERC20_DECIMALS).toString()
      const amountIn = kit.web3.utils.toWei(_amount, 'ether')
      console.log("amount to stake", amountIn)
      await mcusdToken.methods.approve(mcusdToken._address, amountIn).send({from: account})
      await yieldFarm.methods.stakeTokens(amountIn).send({ from: account, feeCurrency: stabletoken.address })
      
      // await mcusdToken.methods.approve(mcusdToken._address, amountIn).send({from: account}).on('transactionHash', (hash) => {
      //   yieldFarm.methods.stakeTokens(amountIn).send({ from: account, feeCurrency: stabletoken.address }).on('transactionHash', (hash) => {

      //   })
      // })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    loadWeb3wallet()
    loadBlockchainData()
  }, [])

  useEffect(() => {
    if (kit && account) {
      return getBalance();
    } else {
      console.log("no kit or address")
    }

  }, [kit, account]);



    return (
      <div>
        <Navbar celoBalance={celoBalance} cUSDBalance={cUSDBalance} account={account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                <a
                  href="https://app.ubeswap.org"
                  target="_blank"
                  rel="noopener noreferrer">
                </a>

               <Main stakeTokens={stakeTokens} mcusdTokenBalance={mcusdTokenBalance} stakingBalance={stakingBalance} mubeswapTokenBalance={mubeswapTokenBalance} />

              </div>
            </main>
          </div>
        </div>
      </div>
    );
}

export default App;
