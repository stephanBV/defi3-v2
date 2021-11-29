import { useCallback, useEffect, useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

//|::: Libraries for setup :::|
import Web3 from "web3";
import detectEthereumProvider from '@metamask/detect-provider'
import { loadContract } from "./utils/load-contract";

//|::: Components :::|
import AddVoter from './components/Add_Voter';
import UpdateStatus from './components/Update_Status'
import AddProposal from './components/Add_Proposal'
import VoteProposal from './components/Vote_Proposal'
import Getter from './components/Getters'
import TallyVotes from './components/Tally_Votes'

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
  const [admin, setAdmin] = useState(null)
  const currentStatus = {
    0 : "RegisteringVoters",
    1 : "ProposalsRegistrationStarted",
    2 : "ProposalsRegistrationEnded",
    3 : "VotingSessionStarted",
    4 : "VotingSessionEnded",
    5 : "VotesTallied"
    }

  const canConnectToContract = account && myWeb3Api.contract

  const setAccountListener = provider => {
    provider.on("accountsChanged", _ => window.location.reload())
    provider.on("chainChanged", _ => window.location.reload())
  }

  useEffect(() => {
    const loadProvider = async () => {
      const provider = await detectEthereumProvider()

      if (provider) {
        setAccountListener(provider)
        const contract= await loadContract("Voting_cyril", provider)
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

    loadProvider()
  }, [])

  useEffect(() => {
    const getAccount = async () => {
      const _web3  = myWeb3Api.web3
      const accounts = await _web3.eth.getAccounts()
      const checkSumAddress = _web3.utils.toChecksumAddress(accounts[0]) 
      console.assert(_web3.utils.checkAddressChecksum(checkSumAddress), "checksum test failed") //check the address passed the checksum test
      setAccount(checkSumAddress)
    }
    myWeb3Api.web3 && getAccount()
  }, [myWeb3Api.web3])

  useEffect(() => {
    const loadBalance = async () => {
      const _web3  = myWeb3Api.web3
      const balance = await _web3.eth.getBalance(account)
      setBalance(_web3.utils.fromWei(balance, "ether"))
    }
    myWeb3Api.web3 && account && loadBalance()
  }, [myWeb3Api.web3, shouldReload, account])

  useEffect(() => {
    const loadWorkflowStatus = async () => {
    const _contract  = myWeb3Api.contract
    const status = await _contract.methods.workflowStatus().call()
    setWorkflowStatus(Number(status))
    const admin = await _contract.methods.owner().call();
    setAdmin(admin)
    }
    myWeb3Api.contract && loadWorkflowStatus()
  },[myWeb3Api.contract, shouldReload])

  return (
    <>
      <div className="defi3-wrapper" style={{display: 'flex',  justifyContent:'center', alignItems:'center',
        height: '30rem'}}>
        <div className="defi3">
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
          { !canConnectToContract &&
            <i className="is-block">
              Connect to Ganache
            </i>
          }
          <div className="balance-view is-size-2 my-4">
            Current Balance: <strong>{balance}</strong> ETH
          </div>
          <div className="workflowStatus-view is-size-2 my-4">
            Ongoing Workflow Status: {workflowStatus}-{currentStatus[workflowStatus]}
          </div>
          <UpdateStatus  instance={myWeb3Api.contract} admin={admin} setWorkflowStatus={(ws) => setWorkflowStatus(ws)} workflowStatus={workflowStatus}/>
          <div style={{marginBottom: '0.8rem'}}></div>
          <AddVoter instance={myWeb3Api.contract} admin={admin} workflowStatus={workflowStatus}/>
          <AddProposal instance={myWeb3Api.contract} voter={account} workflowStatus={workflowStatus}/>
          <VoteProposal instance={myWeb3Api.contract} voter={account} workflowStatus={workflowStatus}/>
          <TallyVotes instance={myWeb3Api.contract} admin={admin} setWorkflowStatus={(ws) => setWorkflowStatus(ws)} workflowStatus={workflowStatus}/>
          <Getter instance={myWeb3Api.contract} voter={account} workflowStatus={workflowStatus}/>
        </div>
      </div>
    </>
  );
}

export default App;