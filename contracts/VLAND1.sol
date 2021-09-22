//SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract VLAND1 is ERC721Upgradeable, OwnableUpgradeable  {
    using StringsUpgradeable for uint256;
        
        // Optional mapping for token URIs
        mapping (uint256 => string) private _tokenURIs;
        
        mapping (address => uint256[]) ownerTokens;

        // Base URI
        string private _baseURIextended;
        
        uint256 maxSupply;

    
    function VLAND_init(string memory name_, string memory symbol_, uint256 maxSupply_) initializer public {
        __ERC721_init(name_, symbol_);
        maxSupply = maxSupply_;
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
            require(msg.sender != address(0), "Sender cannot be address 0");
            require(_to != address(0), "_to cannot be address 0");
            require(_tokenID <= maxSupply, "Cannot mint more than max supply");
            
            _mint(_to, _tokenID);
            _setTokenURI(_tokenID, _tokenURI);
            ownerTokens[_to].push(_tokenID);  
        }
        
        function tokensOfOwner(address _owner) public view returns (uint256[] memory) {
            return ownerTokens[_owner];
        }
        
        function version() public pure returns (string memory) {
            // set version
            string memory ver = "v2";

            return ver;
  }
  
  //Burn function 
  function burn(uint256 _tokenId) public onlyOwner {
      require(_tokenId <= maxSupply, "Incorrect NFT ID");
      _burn(_tokenId);
  }
}