//SPDX-License-Identifier: UNLICENSED

pragma solidity >=0.5.0 < 0.9.0;

struct Product{
    string productName;
    uint productPrice;
    string description;
    address payable seller;
    address buyer;
    uint productId;
    bool delivered;
}
contract smartContract{
    Product[] public products;
    address payable public manager;
    bool destroyed = false;
    uint counter = 1;

    constructor(address _manager){
        manager = payable(_manager);
    }
    modifier checkDestroyed{
        require(!destroyed);
        _;
    }

    function registerProduct(string memory _productName, uint _productPrice, string memory _description) public checkDestroyed{
        require(_productPrice > 0, "The price of the product should be greater than zero");
        Product memory product;
        product.productName=_productName;
        product.productPrice=_productPrice * 10 ** 18;
        product.description=_description;
        product.seller=payable(msg.sender);
        product.productId=counter;
        counter++;
        products.push(product);
    }
    function getProduct() public view checkDestroyed returns(Product[] memory){
        return products;
    }
    function buy(uint _productId) public payable checkDestroyed{
        require(msg.value == products[_productId - 1].productPrice,  "Please send the exact price of the product");
        require(msg.sender != products[_productId - 1].seller, "The seller cannot purchase the product");
        products[_productId - 1].buyer = msg.sender;
    }
    function contractBal() public view checkDestroyed returns(uint){
        return address(this).balance;
    }
    function deliver(uint _productId) public payable checkDestroyed{
        require(msg.sender == products[_productId - 1].buyer, "Only buyer can confirm");
        products[_productId - 1].seller.transfer(products[_productId - 1].productPrice);
        products[_productId - 1].delivered=true;
    }
    function destroy() public checkDestroyed{
        require(msg.sender == manager, "Only the manager can run this command");
        manager.transfer(address(this).balance);
        destroyed=true;
    }
    receive() payable external{
        payable(msg.sender).transfer(msg.value);
    }
}
