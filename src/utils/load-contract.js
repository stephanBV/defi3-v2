import contract from "@truffle/contract"

export const loadContract = async (name, provider) => {
  const res = await fetch(`/contracts/${name}.json`)
  const Artifact = await res.json()

  const _contractTruffle = contract(Artifact)
  _contractTruffle.setProvider(provider)

  const deployedContract = await _contractTruffle.deployed()


  var Contract = require('web3-eth-contract');
  Contract.setProvider(provider);
  var web3Contract = await new Contract(Artifact.abi, deployedContract.address);

  // return deployedContract
  return web3Contract
}