/**
 * @type import('hardhat/config').HardhatUserConfig
 */
require('hardhat-docgen');
module.exports = {
  solidity: "0.7.3",
  docgen: {
    path: './docs',
    clear: true,
    runOnCompile: true,
    only:['/contracts/voting_cyril.sol']
  }
  
};
