import { useState } from "react";
import Button from 'react-bootstrap/Button';

function AddVoter(props) {
    const [inputValue, setInputValue] = useState('');
    const onChangeInput = (event) => {
        setInputValue(event.target.value);
      }
    
    const onSubmit = () => {
        const contract = props.instance;
        contract.methods.addVoter(inputValue).send({from: props.admin})
            .on('error', function(){ alert("Voter is already registered") })
            .then(contract.events.VoterRegistered()
            .once('data', function(event) {
                alert(`Event successful! ${event.event} with voterAddress:\n ${event.returnValues.voterAddress}`)
            })
        )
        setInputValue('')
    }
    return (
          <>
          { props.workflowStatus > 0 ?
            <Button variant="secondary" disabled>Register Voter</Button> :
            <>
              <input placeholder='Enter Address' value={inputValue || ''} onChange={onChangeInput} />
              <Button variant="success" onClick={onSubmit}>Register Voter</Button>
            </>
          }
         </>
    )
}

export default AddVoter;