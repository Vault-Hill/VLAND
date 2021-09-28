//SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.4;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

contract VLAND is ERC721Upgradeable, AccessControlUpgradeable  {
    using StringsUpgradeable for uint256;

    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
        
    mapping (uint256 => string) private _tokenURIs;
    mapping (address => uint256[]) ownerTokens;

    string private _baseURIextended;
        
    uint256 maxSupply;

    
    function VLAND_init(address admin, string memory name_, string memory symbol_, uint256 maxSupply_) initializer public {
        __ERC721_init(name_, symbol_);
        maxSupply = maxSupply_;
        _setupRole(DEFAULT_ADMIN_ROLE, admin);
    }
    
    function _setTokenURI(uint256 tokenId, string memory _tokenURI) internal virtual {
        require(_exists(tokenId), "ERC721Metadata: URI set of nonexistent token");
        _tokenURIs[tokenId] = _tokenURI;
    }
        
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseURIextended;
    }
        
    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");

        string memory _tokenURI = _tokenURIs[tokenId];
        string memory base = _baseURI();
            
        // If there is no base URI, return the token URI.
        if (bytes(base).length == 0) {
            return _tokenURI;
        }
        // If both are set, concatenate the baseURI and tokenURI (via abi.encodePacked).
        if (bytes(_tokenURI).length > 0) {
            return string(abi.encodePacked(base, _tokenURI));
        }
        // If there is a baseURI but no tokenURI, concatenate the tokenID to the baseURI.
        return string(abi.encodePacked(base, tokenId.toString()));
    }
        
    // mint Non-Fungile Function
    function mintLAND(
        uint256 _tokenID,
        address _to,
        string memory _tokenURI
    ) public {
        require(hasRole(MINTER_ROLE, msg.sender), "Acess denied: Caller does not have the minter role");
        require(msg.sender != address(0), "Sender cannot be address 0");
        require(_to != address(0), "_to cannot be address 0");
        require(_tokenID <= maxSupply, "Cannot mint more than max supply");
        require(!_exists(_tokenID), "Token with specified ID already exists");
            
        _mint(_to, _tokenID);
        _setTokenURI(_tokenID, _tokenURI);
        ownerTokens[_to].push(_tokenID);  
    }
        
    function tokensOfOwner(address _owner) public view returns (uint256[] memory) {
        return ownerTokens[_owner];
    }

    function supportsInterface(bytes4 interfaceId) public view virtual override(ERC721Upgradeable, AccessControlUpgradeable) returns (bool) {
        return super.supportsInterface(interfaceId);
    }
}