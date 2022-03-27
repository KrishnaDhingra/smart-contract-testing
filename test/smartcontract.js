const { expectRevert } = require('@openzeppelin/test-helpers')
const { expect } = require('chai')
const { assert } = require('console')

const SmartContract = artifacts.require('SmartContract')

contract('SmartContract', (accounts) => {
  let smartContract = null
  before(async () => {
    smartContract = await SmartContract.deployed()
  })

  // it('Should not register product if price is not greater than zero', async () => {
  //   await expectRevert(
  //     smartContract.registerProduct(
  //       'SmartPhone',
  //       0,
  //       'This is a very good smart phone',
  //       { from: accounts[1] },
  //     ),
  //     'The price of the product should be greater than zero',
  //   )
  // })
  it('Should register product', async () => {
    await smartContract.registerProduct(
      'SmartPhone',
      1000,
      'This is a very good smart phone',
      { from: accounts[1] },
    )
    const products = await smartContract.getProduct()
    assert(products.length === 1)
  })
  it('Should not buy if buyer is seller', async () => {
    await expectRevert(
      smartContract.buy(1, { from: accounts[1], value: 1000 }),
      'The seller cannot purchase the product',
    )
  })
  it('Should not buy if not exact amount', async () => {
    await expectRevert(
      smartContract.buy(1, { from: accounts[2], value: 500 }),
      'Please send the exact price of the product',
    )
  })
  it('Should buy the product', async () => {
    await smartContract.buy(1, { from: accounts[2], value: 1000 })
    let product = await smartContract.getProduct()
    assert(product[0].buyer === accounts[2])
  })
  it('Should not deliver it not buyer', async () => {
    await expectRevert(
      smartContract.deliver(1, { from: accounts[3] }),
      'Only buyer can confirm',
    )
  })
  it('Should deliver product', async () => {
    const sellerBeforeBalance = await web3.eth.getBalance(accounts[1])
    await smartContract.deliver(1, { from: accounts[2] })
    const sellerAfterBalance = await web3.eth.getBalance(accounts[1])
    beforeBalance = web3.utils.toBN(sellerBeforeBalance)
    afterBalance = web3.utils.toBN(sellerAfterBalance)
    assert(afterBalance.sub(beforeBalance).toNumber() === 1000)
  })
  it('Should not destroy if not manager', async () => {
    await expectRevert(
      smartContract.destroy({ from: accounts[4] }),
      'Only the manager can run this command',
    )
  })
  it('Should destroy the smart contract', async () => {
    await smartContract.destroy({ from: accounts[0] })
    let destroy = await smartContract.destroyed()
    assert(destroy) // it should be true
  })
  // it('Should check the fallback function', async () => {
  //   const sellerBeforeBalance = await web3.eth.getBalance(accounts[1])
  //   smartContract.buy(1, { from: accounts[2], value: 1000 })
  //   const sellerAfterBalance = await web3.eth.getBalance(accounts[1])
  //   beforeBalance = web3.utils.toBN(sellerBeforeBalance)
  //   afterBalance = web3.utils.toBN(sellerAfterBalance)
  //   assert(afterBalance.sub(beforeBalance).toNumber() === 0)
  // })
})
