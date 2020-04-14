import React, { Component } from "react";
import iToken from "./contracts/iToken.json";
import getWeb3 from "./getWeb3";
import "./App.css";

class App extends Component {
  state = { 
    storageValue: 0, 
    web3: null, 
    accounts: null, 
    contract: null, 
    balance: null, 
    tokenBalance: null,
    amountToSend: 0,
    accountToSend: ""
  };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = iToken.networks[networkId];
      const instance = new web3.eth.Contract(
        iToken.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Set web3, accounts, and contract to the state, and then proceed with an
      // example of interacting with the contract's methods.
      this.setState({ web3, accounts, contract: instance }, this.runExample);
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  runExample = async () => {
    console.log('runExample rendered');
    this.state.web3.eth.getBalance(this.state.accounts[0]).then(result => this.setState({balance: result}))
    this.state.contract.methods.balanceOf(this.state.accounts[0]).call().then(res => this.setState({tokenBalance: res}))

  };

  render() {
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    console.log(this.state)
    return (
      <div className="App">
        <h1>Good to Go!</h1>
        <p>Your Truffle Box is installed and ready.</p>
        <h2>Smart Contract Example</h2>
        <hr />
        account: {this.state.accounts}
        <br />
        balance: {this.state.balance}
        <br />
        tokkens: {this.state.tokenBalance}

        <br />
        Send ether
        <form onSubmit={(e) => {
          e.preventDefault();
          this.state.web3.eth.sendTransaction({
            from: this.state.accounts[0],
            to: this.state.accountToSend,
            value: this.state.web3.utils.toWei(this.state.amountToSend, 'ether')
          })
            .once('transactionHash', function(hash){ console.log(hash , 'hash') })
            .once('receipt', function(receipt){ console.log(receipt, "receipt") })
            .on('confirmation', function(number, receipt){ console.log(number, receipt, "number, receipt") })
            .on('error', function(error){ console.log(error, 'error') })
            .then(function(receipt){  
              console.log('done')  //fired once the receipt is mined});
            })
          }
        }>
          <input 
          type="text" 
          onChange={(e) => this.setState({accountToSend: e.target.value})} 
          value={this.state.accountToSend} 
          placeholder="account to " />
          <input 
          type="number" 
          onChange={(e) => this.setState({amountToSend: e.target.value})} 
          value={this.state.amountToSend} 
          placeholder="amount of ether to send" />
          <button type="submit">send</button>
        </form>
        send iTokens
        <form onSubmit={(e) => {
          e.preventDefault();
          console.log(this.state.contract.methods.transfer(this.state.accountToSend, this.state.amountToSend))
          console.log(this.state.web3)
          
        }
        }>
          <input 
          type="text" 
          onChange={(e) => this.setState({accountToSend: e.target.value})} 
          value={this.state.accountToSend} 
          placeholder="account to " />
          <input 
          type="number" 
          onChange={(e) => this.setState({amountToSend: e.target.value})} 
          value={this.state.amountToSend} 
          placeholder="amount of iToken to send" />
          <button type="submit">send</button>
        </form>
        <br />
        
      </div>
    );
  }
}

export default App;
