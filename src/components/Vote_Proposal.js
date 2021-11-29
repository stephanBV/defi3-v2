import { useState } from "react";
import Button from 'react-bootstrap/Button';

function VoteProposal(props) {
    const voter = props.voter
    const contract = props.instance
    const workflowStatus = props.workflowStatus
    const [inputValue, setInputValue] = useState('');
    const onChangeInput = (event) => {
        setInputValue(event.target.value);
      }
    const onSubmit = () => {
        contract.methods.setVote(inputValue).send({from: voter})
            .on('error', function(){ alert("You clearly did something wrong. Come back later hay?!") })
            .then(contract.events.Voted() 
            .once('data', function(event) {
                alert(`Success! has ${event.event} with voter:\n ${event.returnValues.voter} \n and proposalId: ${event.returnValues.proposalId}`)
            })
        )
        setInputValue('')
    }
    return (
          <>
          { workflowStatus !== 3 ?
            <Button variant="secondary" disabled>Vote For Proposal</Button> :
            <>
            <input placeholder='Enter Proposal ID' value={inputValue || ''} onChange={onChangeInput} />
            <Button variant="success" onClick={onSubmit}>Vote For Proposal</Button>
            </>
          }
         </>
    )
}

export default VoteProposal;