// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

/**
 * @title NFTContract
 * @dev A simple ERC-721 contract example with SVG support
 */
contract NFTContract is ERC721Enumerable {
    uint256 public nextTokenId;

    constructor() ERC721("edaNFT", "ENFT") {}

    /**
     * @dev Mints a new token to the specified address
     * @param to The address to mint the token to
     */
    function mint(address to) external {
        _mint(to, nextTokenId);
        nextTokenId++;
    }

    /**
     * @dev Returns the token URI for a given token ID
     * @param tokenId The token ID
     * @return The token URI
     */
    function tokenURI(uint256 tokenId) public view override returns (string memory) {
        string memory svg = generateSVG();
        string memory json = string(
            abi.encodePacked(
                '{"name": "Cat NFT", "description": "A simple cat SVG NFT", "image": "data:image/svg+xml;utf8,',
                svg,
                '"}'
            )
        );
        return string(abi.encodePacked("data:application/json;utf8,", json));
    }

    /**
     * @dev Generates the SVG for the cat
     * @return The SVG string
     */
    function generateSVG() internal pure returns (string memory) {
        return 
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">'
            '<circle cx="50" cy="50" r="50" fill="gray" />'
            '<circle cx="35" cy="35" r="5" fill="black" />'
            '<circle cx="65" cy="35" r="5" fill="black" />'
            '<path d="M 35 65 Q 50 80 65 65" stroke="black" stroke-width="5" fill="none" />'
            '<path d="M 40 50 Q 50 60 60 50" stroke="black" stroke-width="2" fill="none" />'
            '</svg>';
    }
}
