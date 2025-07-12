// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HalalSupplyChain {
    struct Product {
        uint256 id;
        string companyName;
        string productType;
        string productName;
        string description;
        string halalStatus;
        string supplierChain;
        string location;
        string batchNumber;
        string expiryDate;
        address addedBy;
        uint256 timestamp;
    }

    mapping(uint256 => Product) public products;
    uint256 public productCount;
    address public owner;

    event ProductAdded(uint256 id, string productName, address addedBy);

    constructor() {
        owner = msg.sender;
        productCount = 0;
    }

    function addProduct(
        string memory _companyName,
        string memory _productType,
        string memory _productName,
        string memory _description,
        string memory _halalStatus,
        string memory _supplierChain,
        string memory _location,
        string memory _batchNumber,
        string memory _expiryDate
    ) public {
        productCount++;
        products[productCount] = Product(
            productCount,
            _companyName,
            _productType,
            _productName,
            _description,
            _halalStatus,
            _supplierChain,
            _location,
            _batchNumber,
            _expiryDate,
            msg.sender,
            block.timestamp
        );

        emit ProductAdded(productCount, _productName, msg.sender);
    }

    function getProduct(uint256 _id) public view returns (Product memory) {
        return products[_id];
    }

    function getProductCount() public view returns (uint256) {
        return productCount;
    }
}