import { useCallback, useEffect, useState } from "react";
import "./App.css";
import Web3 from "web3";
import detectEthereumProvider from '@metamask/detect-provider'
import { loadContract } from "./utils/load-contract";
import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown'


function App() {
  const [myWeb3Api, setMyWeb3Api] = useState({
    provider: null,
    isProviderLoaded: false,
    web3: null,
    contract: null
  })

  const [balance, setBalance] = useState(null)
  const [account, setAccount] = useState(null)
  const [shouldReload, reload] = useState(false)
  const [workflowStatus, setWorkflowStatus] = useState(null)

  const canConnectToContract = account && myWeb3Api.contract
  const reloadEffect = useCallback(() => reload(!shouldReload), [shouldReload])

  const setAccountListener = provider => {
    provider.on("accountsChanged", _ => window.location.reload())
    provider.on("chainChanged", _ => window.location.reload())
  }

  useEffect(() => {
    const loadProvider = async () => {
      console.log('1- in loadProvider')
      const provider = await detectEthereumProvider()

      if (provider) {
        const contract = await loadContract("Voting_cyril", provider)
        setAccountListener(provider)
        setMyWeb3Api({
          web3: new Web3(provider),
          provider,
          contract,
          isProviderLoaded: true
        })
      } else {
        setMyWeb3Api(api => ({...api, isProviderLoaded: true}))
        console.error("Please, install Metamask.")
      }
    }
    const getAccount = async () => {
        console.log('2- in getAccount')
        const { web3 } = myWeb3Api
        const accounts = await web3.eth.getAccounts()
        const checkSumAddress = web3.utils.toChecksumAddress(accounts[0])
        setAccount(checkSumAddress)
      }
    const loadBalance = async () => {
        console.log('3- in loadBalance')
        console.log('account', account)
        const { web3 } = myWeb3Api
        console.log('web3',web3)
        const balance = await web3.eth.getBalance(account)
        setBalance(web3.utils.fromWei(balance, "ether"))
    }
    const loadWorkflowStatus = async () => {
        const { contract } = myWeb3Api
        console.log('4- in loadWorkflowStatus')
        console.log('contract',contract)
        console.log('owner',await contract.owner())
        const status = await contract.workflowStatus()
        setWorkflowStatus(Number(status))
    }
    

      myWeb3Api.web3 && loadProvider()
      myWeb3Api.web3 && getAccount() 
      myWeb3Api.web3 && loadBalance()
      myWeb3Api.web3 && loadWorkflowStatus()
  }, [myWeb3Api,shouldReload, account])

  // useEffect(() => {
  //   const getAccount = async () => {
  //     console.log('2- in getAccount')
  //     const { web3 } = myWeb3Api
  //     const accounts = await web3.eth.getAccounts()
  //     const checkSumAddress = web3.utils.toChecksumAddress(accounts[0])
  //     setAccount(checkSumAddress)
  //   }

  //   myWeb3Api.web3 && getAccount()
  // }, [myWeb3Api])

//   useEffect(() => {
//     const loadBalance = async () => {
//       console.log('3- in loadBalance')
//       console.log('account', account)
//       const { web3 } = myWeb3Api
//       console.log('web3',web3)
//       const balance = await web3.eth.getBalance(account)
//       setBalance(web3.utils.fromWei(balance, "ether"))
//     }

//     myWeb3Api.web3 && loadBalance()
//   }, [myWeb3Api, shouldReload, account])

//   useEffect(() => {
//     const loadWorkflowStatus = async () => {
//     const { contract } = myWeb3Api
//     console.log('4- in loadWorkflowStatus')
//     console.log('contract',contract)
//     console.log('owner',await contract.owner())
//     const status = await contract.workflowStatus()
//     setWorkflowStatus(Number(status))
//     }
//     loadWorkflowStatus()
//   },[myWeb3Api, shouldReload])

  const currentStatus = (status) => {
    switch (status) {
      case 0:
        return "RegisteringVoters"
      case 1:
        return "ProposalsRegistrationStarted"
      case 2: 
        return "ProposalsRegistrationEnded"
      case 3:
        return "VotingSessionStarted"
      case 4:
        return "VotingSessionEnded"
      case 5:
        return "VotesTallied"
    }
  }

  const updateStatus = async (status) => {
    console.log(myWeb3Api.contract)
    // const owner = await myWeb3Api.contract.owner()
    // switch (status) {
      // case 1: await myWeb3Api.contract.startProposalsRegistering({from: owner})
    // }
  }

  

  const addFunds = useCallback(async () => {
    const { contract, web3 } = myWeb3Api
    await contract.addFunds({
      from: account,
      value: web3.utils.toWei("1", "ether")
    })

    reloadEffect()
  }, [myWeb3Api, account, reloadEffect])

  const withdraw = async () => {
    const { contract, web3 } = myWeb3Api
    const withdrawAmount = web3.utils.toWei("0.1", "ether")
    await contract.withdraw(withdrawAmount, {
      from: account
    })
    reloadEffect()
  }

  return (
    <>
      <div className="faucet-wrapper">
        <div className="faucet">
          { myWeb3Api.isProviderLoaded ?
            <div className="is-flex is-align-items-center">
              <span>
                <strong className="mr-2">Account: </strong>
              </span>
                { account ?
                  <div>{account}</div> :
                  !myWeb3Api.provider ?
                  <>
                    <div className="notification is-warning is-size-6 is-rounded">
                      Wallet is not detected!{` `}
                      <a
                        rel="noreferrer"
                        target="_blank"
                        href="https://docs.metamask.io">
                        Install Metamask
                      </a>
                    </div>
                  </> :
                  <button
                    className="button is-small"
                    onClick={() =>
                      myWeb3Api.provider.request({method: "eth_requestAccounts"}
                    )}
                  >
                    Connect Wallet
                  </button>
                }
            </div> :
            <span>Looking for Web3...</span>
          }
          <div className="balance-view is-size-2 my-4">
            Current Balance: <strong>{balance}</strong> ETH
          </div>
          <div className="workflowStatus-view is-size-2 my-4">
            Ongoing Workflow Status: {workflowStatus}-{currentStatus(workflowStatus)}
          </div>
          <button onClick={updateStatus(1)} className="button is-link mr-2">
            startProposalsRegistering
          </button>
          <DropdownButton id="dropdown-basic-button" title="Dropdown button">
            <Dropdown.Item href="#/action-1">Action</Dropdown.Item>
            <Dropdown.Item href="#/action-2">Another action</Dropdown.Item>
            <Dropdown.Item href="#/action-3">Something else</Dropdown.Item>
          </DropdownButton>
          { !canConnectToContract &&
            <i className="is-block">
              Connect to Ganache
            </i>
          }
          <button
            disabled={!canConnectToContract}
            onClick={addFunds}
            className="button is-link mr-2">
              Donate 1 eth
            </button>
          <button
            disabled={!canConnectToContract}
            onClick={withdraw}
            className="button is-primary">Withdraw 0.1 eth</button>
        </div>
      </div>
    </>
  );
}

export default App;