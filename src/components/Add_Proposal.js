import { useState } from "react";
import Button from 'react-bootstrap/Button';

function AddProposal(props) {
    const voter = props.voter
    const [inputValue, setInputValue] = useState('');
    const onChangeInput = (event) => {
        setInputValue(event.target.value);
      }
    const onSubmit = () => {
        const contract = props.instance;
        contract.methods.addProposal(inputValue).send({from: voter})
            .on('error', function(){ alert("You clearly did something wrong. Do it again!") })
            .then(contract.events.ProposalRegistered()
            .once('data', function(event) {
                alert(`Your proposal has been registered!  \n proposal ID: ${event.returnValues.proposalId}`)
            })
        )
        setInputValue('')
    }
    return (
          <>
          { props.workflowStatus !== 1 ?
            <Button variant="secondary" disabled>Register Proposal</Button> :
            <>
            <input placeholder='Enter proposal' value={inputValue || ''} onChange={onChangeInput} />
            <Button variant="success" onClick={onSubmit}>Register Proposal</Button>
            </>
          }
         </>
    )
}

export default AddProposal;