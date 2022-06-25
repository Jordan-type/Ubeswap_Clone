import React, { Component } from 'react'
import celoLogo from '../assets/images/celo_logo.png'

const ERC20_DECIMALS = 18
 
class Main extends Component {

render() {
  return (
    <div className='mt-3'>
      <table className='table table-borderless text-muted text-center'>
        <thead>
          <tr>
            <th scope='col'>Staking Balance</th>
            <th scope='col'>Reward Balance</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{( this.props.stakingBalance)}</td>
            <td>{( this.props.mubeswapTokenBalance )}</td>
          </tr>
        </tbody>
      </table>
      <div className='card mb-4'>
        <div className='card-body'>
          <form className="mB-3"
             onSubmit={(event) => { event.preventDefault()
              let _amount;
              _amount = this.input.value.toString()
              this.props.stakeTokens(_amount)}}>
            <div>
              <label className='float-left'>Stake tokens</label>
              <span className='float-right text-muted'>Balance: {( this.props.mcusdTokenBalance )}</span>
            </div>
            <div className='input-group mb-4'>
              <input type='text' ref={(input) => {this.input = input}} className='form-control form-control-lg'/>
              <div className='input-group-append'>
                <img src={celoLogo} height='40' alt=''/>
                &nbsp;&nbsp;&nbsp; cUSD
              </div>
            </div>
            <button type='submit' className='btn btn-primary btn-block btn-lg'>STAKE</button>
          </form>
          <button type="submit" className="btn btn-link btn-block btn-sm">UN-STAKE</button>
        </div>
      </div>
    </div>
  )
}
}

export default Main
