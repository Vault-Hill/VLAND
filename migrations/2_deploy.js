/**
 * Contract version 1 contract artifact
 */
const VLand = artifacts.require ('VLAND');

// For deploying proxy contract ie: V1
const {deployProxy} = require ('@openzeppelin/truffle-upgrades');

module.exports = async function (deployer) {
  /**
   * deploying V1
   */
  const instance = await deployProxy (VLand, {deployer});
  console.log ('instance: ', instance.address);
};
