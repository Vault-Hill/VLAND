const VLand = artifacts.require ('VLAND');
// const VLAND1 = artifacts.require ('VLAND1');
const {deployProxy} = require ('@openzeppelin/truffle-upgrades');

// const {prepareUpgrade} = require ('@openzeppelin/truffle-upgrades');
// const {upgradeProxy} = require ('@openzeppelin/truffle-upgrades');

module.exports = async function (deployer) {
  const land = await deployProxy (VLand, {deployer, initializer: 'VLAND_init'});
  console.log ('land: ', land.address);
  // await prepareUpgrade (land.address, VLAND2, {deployer});
};

// module.exports = async function (deployer) {
//   const VLandV1 = await VLAND1.deployed ();
//   console.log ('this is for activity reward', VLandV1.address);

// let Vland1 = await deployProxy (VLAND1, {
//   deployer,
//   initializer: 'VLAND_init',
// });
// console.log ('this is for V1', Vland1.address);

// let Vland2 = await upgradeProxy (
//   '0x56f322f9b8618dfed7020acc2248176b516772c7',
//   VLAND1,
//   {deployer}
// );
// console.log ('this is for V2', Vland2.address);
// };

//   //   const instance = await deployProxy (VLAND1, {deployer});
//   //   const upgraded = await upgradeProxy (instance.address, VLAND2, {deployer});
// };
