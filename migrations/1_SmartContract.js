const SmartContract = artifacts.require('SmartContract')

module.exports = function (deployer, _network, accounts) {
  deployer.deploy(SmartContract, accounts[0])
}
