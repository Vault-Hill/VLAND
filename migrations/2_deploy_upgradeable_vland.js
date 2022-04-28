/**
 * Contract version 1 contract artifact
 */
const VLAND = artifacts.require ('VLAND');

// For deploying proxy contract ie: V1
const {deployProxy} = require ('@openzeppelin/truffle-upgrades');

module.exports = async function (deployer, admin) {
  /**
   * Deploy upgradeable VLAND token contract
   * 
   * This will deploy the VLAND implementation contract,
   * deploy the ProxyAdmin contract (admin for our proxy),
   * deploy the proxy contract and run the initializer function.
   * 
   * For deployment testing purposes, pass admin address in as
   * a parameter to the truffle migrate command.
   */
  const argv = require('minimist')(process.argv.slice(2), { string: ['admin'] });
  console.log('migration admin argument: ', argv['admin']);

  const instance = await deployProxy(
    VLAND,
    [
      argv['admin'],
      'Vault Hill Land',
      'VLAND',
      process.env.BASE_URI,
      +process.env.VLAND_AMOUNT
    ],
    { deployer, initializer: 'initialize' }
  );
  console.log ('instance: ', instance.address);
};
