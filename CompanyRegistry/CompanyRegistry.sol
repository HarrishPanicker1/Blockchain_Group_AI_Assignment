// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract CompanyRegistry {
    uint256 public companyCount = 0;

    struct Company {
        uint256 id;
        string name;
        string companyType;
        string location; // can store as "lat,long" string or separate fields
        string description;
        address owner;
    }

    mapping(uint256 => Company) public companies;
    mapping(address => uint256) public ownerToCompanyId;

    event CompanyAdded(
        uint256 indexed companyId,
        string name,
        string companyType,
        string location,
        string description,
        address indexed owner
    );

    modifier onlyUnregistered() {
        require(ownerToCompanyId[msg.sender] == 0, "Company already registered for this address");
        _;
    }

    function addCompany(
        string memory _name,
        string memory _companyType,
        string memory _location,
        string memory _description
    ) public onlyUnregistered {
        companyCount++;
        companies[companyCount] = Company({
            id: companyCount,
            name: _name,
            companyType: _companyType,
            location: _location,
            description: _description,
            owner: msg.sender
        });
        ownerToCompanyId[msg.sender] = companyCount;

        emit CompanyAdded(companyCount, _name, _companyType, _location, _description, msg.sender);
    }

    function getCompany(uint256 _companyId) public view returns (Company memory) {
        return companies[_companyId];
    }
}