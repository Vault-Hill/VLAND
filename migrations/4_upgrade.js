// migrations/4_prepare_upgrade_boxv2.js
const VLAND = artifacts.require ('VLAND');
const VLAND1 = artifacts.require ('VLAND1');

const {deployProxy} = require ('@openzeppelin/truffle-upgrades');

module.exports = async function (deployer) {
  const LAND = await VLAND.deployed ();
  await deployProxy (
    LAND.address,
    '0x13011a6da655818f26e55b5171b5b6b2908cf158',
    {deployer}
  );
};
