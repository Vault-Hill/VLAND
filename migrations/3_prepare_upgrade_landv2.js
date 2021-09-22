// migrations/4_prepare_upgrade_boxv2.js
const VLAND = artifacts.require ('VLAND');
const VLAND1 = artifacts.require ('VLAND1');

const {prepareUpgrade} = require ('@openzeppelin/truffle-upgrades');

module.exports = async function (deployer) {
  const LAND = await VLAND.deployed ();
  await prepareUpgrade (LAND.address, VLAND1, {deployer});
};
