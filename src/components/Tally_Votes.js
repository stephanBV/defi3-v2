import Button from 'react-bootstrap/Button';

function TallyVotes(props) {
    const contract = props.instance
    const admin = props.admin
    const workflowStatus = props.workflowStatus
    const WorkflowStatus = {
        4: 'VotingSessionEnded',
        5: 'VotesTallied'
    }
    const setWorkflowStatus = props.setWorkflowStatus

    const onSubmit = () => {
        contract.methods.countVotes().send({from: admin})
            .on('error', function(){ alert("You clearly did something wrong. try again boii!") })
            .then(contract.events.WorkflowStatusChange()
            .once('data', function(event) {
                alert(`Event successful! ${event.event} \n from: ${WorkflowStatus[event.returnValues.previousStatus]} \n to: ${WorkflowStatus[event.returnValues.newStatus]}`)
            })
        )
        setWorkflowStatus(5)
    }
    return (
          <>
          { workflowStatus !== 4  ?
            <Button variant="secondary" onClick={onSubmit} disabled>Tally Votes</Button> :
            workflowStatus === 5 ?
            <Button variant="secondary" onClick={onSubmit} disabled>Tally Votes</Button> :
            <Button variant="success" onClick={onSubmit}>Tally Votes</Button> 
          }
         </>
    )
}

export default TallyVotes;