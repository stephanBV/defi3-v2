import DropdownButton from 'react-bootstrap/DropdownButton';
import Dropdown from 'react-bootstrap/Dropdown'
import 'bootstrap/dist/css/bootstrap.min.css';

function UpdateStatus(props) {
      const WorkflowStatus = {
        0: 'RegisteringVoters',
        1: 'ProposalsRegistrationStarted',
        2: 'ProposalsRegistrationEnded',
        3: 'VotingSessionStarted',
        4: 'VotingSessionEnded',
        5: 'VotesTallied'
    }
    const updateStatus = (statusNumber) => {
        const contract = props.instance;
        const admin = props.admin;
        const setWorkflowStatus = props.setWorkflowStatus
        switch (statusNumber) {
          case 1: 
            contract.methods.startProposalsRegistering().send({from: admin})
            .on('error', function(){ alert("That status has previously been selected!") })
            .then(contract.events.WorkflowStatusChange()
              .once('data', function(event) {
                alert(`${event.event} from ${WorkflowStatus[event.returnValues.previousStatus]} to ${WorkflowStatus[event.returnValues.newStatus]}`)
                setWorkflowStatus(Number(event.returnValues.newStatus))
              })
            )
            break;
          case 2: 
            contract.methods.endProposalsRegistering().send({from: admin})
            .on('error', function(){ alert("That status has previously been selected!") })
            .then(contract.events.WorkflowStatusChange()
              .once('data', function(event) {
                alert(`${event.event} from ${WorkflowStatus[event.returnValues.previousStatus]} to ${WorkflowStatus[event.returnValues.newStatus]}`)
                setWorkflowStatus(Number(event.returnValues.newStatus))
              })
            )
            break;
          case 3: 
            contract.methods.startVotingSession().send({from: admin})
            .on('error', function(){ alert("You clearly did something wrong. Try again mate!") })
            .then(contract.events.WorkflowStatusChange()
              .once('data', function(event) {
                alert(`${event.event} from ${WorkflowStatus[event.returnValues.previousStatus]} to ${WorkflowStatus[event.returnValues.newStatus]}`)
                setWorkflowStatus(Number(event.returnValues.newStatus))
              })
            )
            break;
          case 4:
            contract.methods.endVotingSession().send({from: admin})
            .on('error', function(){ alert("Transaction denied!") })
            .then(contract.events.WorkflowStatusChange()
              .once('data', function(event) {
                setWorkflowStatus(Number(event.returnValues.newStatus))
                alert(`${event.event} from ${WorkflowStatus[event.returnValues.previousStatus]} to ${WorkflowStatus[event.returnValues.newStatus]}`)
              })
            )
            break;
          default:
            alert("wrong status")
        }
      }
      return (
          <>
          <DropdownButton id="dropdown-basic-button" title="Update Voting Status">
            { props.workflowStatus !== 0 ?
                <Dropdown.Item  onClick={() => updateStatus(1)} disabled>Start Proposals Registering</Dropdown.Item> :
                <Dropdown.Item  onClick={() => updateStatus(1)} >Start Proposals Registering</Dropdown.Item>
            }
            { props.workflowStatus !== 1 ?
                <Dropdown.Item  onClick={() => updateStatus(2)} disabled>End Proposals Registering</Dropdown.Item> :
                <Dropdown.Item  onClick={() => updateStatus(2)}>End Proposals Registering</Dropdown.Item>
            }
            { props.workflowStatus !== 2 ?
            <Dropdown.Item  onClick={() => updateStatus(3)} disabled>Start Voting Session</Dropdown.Item> :
            <Dropdown.Item  onClick={() => updateStatus(3)}>Start Voting Session</Dropdown.Item>
            }
           { props.workflowStatus !== 3 ?
            <Dropdown.Item  onClick={() => updateStatus(4)} disabled>End Voting Session</Dropdown.Item> :
            <Dropdown.Item  onClick={() => updateStatus(4)}>End Voting Session</Dropdown.Item>
           }
          </DropdownButton>
          </>
      )
}

export default UpdateStatus;