//SPDX-License-Identifier: Unlicensed
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

contract VLAND is ERC721Upgradeable, OwnableUpgradeable  {
    using StringsUpgradeable for uint256;
        
        // Optional mapping for token URIs
        mapping (uint256 => string) private _tokenURIs;
        
        mapping (address => uint256[]) ownerTokens;

        // Base URI
        string private _baseURIextended;

    
    function VLAND_init(string memory name_, string memory symbol_) initializer public {
        __ERC721_init(name_, symbol_);
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
            uint256 tokenID,
            address _to,
            string memory tokenURI_
        ) public {
            _mint(_to, tokenID);
            _setTokenURI(tokenID, tokenURI_);
            ownerTokens[_to].push(tokenID);  
        }
        
        function tokensOfOwner(address _owner) public view returns (uint256[] memory) {
            return ownerTokens[_owner];
        }
        
        function version() public pure returns (string memory) {
            // set version
            string memory ver = "v1";

            return ver;
  }
}