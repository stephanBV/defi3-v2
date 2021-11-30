
import { useState } from "react";
import DropdownButton from 'react-bootstrap/DropdownButton';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';

function Getter(props) {
    const contract = props.instance;
    const voter = props.voter;
    const workflowStatus = props.workflowStatus;
    const [addrValue, setInputAddr] = useState('');
    const [propIdValue, setInputPropId] = useState('');

    const onChangeAddr = (event) => {
        setInputAddr(event.target.value)
      };

    const onChangePropId = (event) => {
        setInputPropId(event.target.value)
    };

    // custom map function for object from the getter of the countVotes function (previously TallyVotesDraw)
    const map = (obj, fun) =>
        Object.entries(obj).reduce(
            (prev, [key, value]) => ({
                ...prev,
                [key]: fun(key, value)
            }),
        {}
    );

    const getVoter = async () => {
        try{
            const _getVoter = await contract.methods.getVoter(addrValue).call({from: voter})
            alert(`Voter ${addrValue} \n hasVoted: ${_getVoter.hasVoted} \n isRegistered: ${_getVoter.isRegistered} \n voterProposalId: ${_getVoter.votedProposalId}`)
            
        } catch(_) {
            alert("Well that did't go the way you wanted hu?! \nYou're either not registered or the address is messed up! Go figure it out mate!")
        }    
        setInputAddr('')
    }
    const getOneProposal = async () => {
        try {
            const _getOneProposal = await contract.methods.getOneProposal(propIdValue).call()
            alert(`Proposal ID ${propIdValue} is ${_getOneProposal.description}`)
        } catch(_) {
            alert('wrong proposal bruh..')
        }
        setInputPropId('')
    }
    const getResults = async () => {
        const _getWinners = await contract.methods.getWinners().call()
        // take _getWinner object and map content to get only the descriptions
        const _getWObj = map(_getWinners, (_, winner) => winner.description)
        if (Object.keys(_getWObj).length > 1) {
            alert(`==> ${Object.values(_getWObj)} <==`)
        } else {
            alert(`==> ${_getWinners[0][0]} <==`)
        }
    }

    return (
        <>
        <DropdownButton id="dropdown-basic-button" title="Getters">
            <InputGroup className="mb-3">
                <FormControl
                placeholder='Enter Address' value={addrValue || ''}  onChange={onChangeAddr} 
                />
                <Button variant="outline-primary" id="button-addon2" onClick={getVoter}>
                getVoter
                </Button>    
            </InputGroup>
            <InputGroup className="mb-3">
                <FormControl
                placeholder="Enter Proposal Id" value={propIdValue || ''}  onChange={onChangePropId} 
                />
                <Button variant="outline-primary" id="button-addon2" onClick={getOneProposal}>
                getOneProposal
                </Button>
            </InputGroup>
            <InputGroup className="mb-3">
                { workflowStatus !== 5 ?
                    <Button variant="outline-secondary" id="button-addon2" onClick={getResults} disabled>Election Result</Button>
                    : <Button variant="outline-primary" id="button-addon2" onClick={getResults} >Election Result</Button>
                }
            </InputGroup>
        </DropdownButton>
        </>
    )
}

export default Getter;
