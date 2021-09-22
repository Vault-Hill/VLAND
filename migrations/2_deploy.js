/**
 * Contract version 1 contract artifact
 */
const VLand = artifacts.require ('VLAND');

/**
 * Contract version 2 contract artifact 
 */
const VLand1 = artifacts.require ('VLAND1');

// For deploying proxy contract ie: V1
const {deployProxy} = require ('@openzeppelin/truffle-upgrades');

// for upgrading proxy contract ie: V2
// const {upgradeProxy} = require ('@openzeppelin/truffle-upgrades');

module.exports = async function (deployer) {
  /**
   * deploying V1
   */
  const instance = await deployProxy (VLand, {deployer});
  console.log ('instance: ', instance.address);

  /**
   * upgrading V1 to V2
   * 0x5b6b8841bde6e15f74b331219b080e85081c479b ---- Address of TransparentUpgradeableProxy
   */
  //   const upgraded = await upgradeProxy (
  //   '0x5b6b8841bde6e15f74b331219b080e85081c479b',
  //   VLand1,
  //   {deployer}
  // );
};
