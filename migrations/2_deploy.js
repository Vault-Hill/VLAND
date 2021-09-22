// migrations/2_deploy_box.js
const VLAND = artifacts.require ('VLAND');

const {deployProxy} = require ('@openzeppelin/truffle-upgrades');

module.exports = async function (deployer) {
  await deployProxy (VLAND, ['Vault Hill City', 'VLAND'], {
    deployer,
    initializer: 'VLAND_init',
  });
};
