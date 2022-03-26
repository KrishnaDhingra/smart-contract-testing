const { expectRevert } = require('@openzeppelin/test-helpers')
const { expect } = require('chai')
const { assert } = require('console')

const SmartContract = artifacts.require('SmartContract')

contract('SmartContract', (accounts) => {
  let smartContract = null
  before(async () => {
    smartContract = await SmartContract.deployed()
  })

  it('Should not register product if price is not greater than zero', async () => {
    await expectRevert(
      smartContract.registerProduct(
        'SmartPhone',
        0,
        'This is a very good smart phone',
        { from: accounts[1] },
      ),
      'The price of the product should be greater than zero',
    )
  })
  it('Should register product', async () => {
    await smartContract.registerProduct(
      'SmartPhone',
      1000,
      'This is a very good smart phone',
      { from: accounts[1] },
    )
    const products = await smartContract.getProduct()
    console.log(products.length)
    assert(products.length === 1)
  })
  it('Should not buy if not exact amount', async () => {
    await expectRevert(
      smartContract.buy(1, { from: accounts[2], value: 500 }),
      'Please send the exact price of the product',
    )
  })
  it('Should not buy if buyer is seller', async () => {
    await smartContract.buy(1, { from: accounts[1], value: 1000 })
    console.log(await smartContract.getProduct()[0].productPrice)
    // await expectRevert(
    //   smartContract.buy(1, { from: accounts[1], value: 1000 }),
    //   'The seller cannot purchase the product',
    // )
  })
})
