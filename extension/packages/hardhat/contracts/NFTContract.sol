// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

/**
 * @title NFTContract
 * @dev A simple ERC-721 contract example with SVG support
 */
contract NFTContract is ERC721Enumerable {
    uint256 public nextTokenId;

    constructor() ERC721("smileNFT", "SNFT") {}

    /**
     * @dev Mints a new token to the specified address
     * @param to The address to mint the token to
     */
    function mint(address to) external {
        _mint(to, nextTokenId);
        nextTokenId++;
    }

    /**
     * @dev Returns an array of token IDs owned by the given address
     * @param owner The address to query
     * @return uint256[] List of token IDs owned by the address
     */
    function tokensOfOwner(address owner) external view returns (uint256[] memory) {
        uint256 tokenCount = balanceOf(owner);
        uint256[] memory tokenIds = new uint256[](tokenCount);
        for (uint256 i = 0; i < tokenCount; i++) {
            tokenIds[i] = tokenOfOwnerByIndex(owner, i);
        }
        return tokenIds;
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
                '{"name": "Smiley face NFT", "description": "A simple smiley face SVG NFT", "image": "',
                svg,
                '"}'
            )
        );
        return json;  // Return the plain JSON string instead of a data URI
    }

    /**
     * @dev Generates the SVG for the cat
     * @return The SVG string
     */
    function generateSVG() internal pure returns (string memory) {
        return 
            string(abi.encodePacked(
                '<svg xmlns=\\"http://www.w3.org/2000/svg\\" viewBox=\\"0 0 100 100\\">',
                '<circle cx=\\"50\\" cy=\\"50\\" r=\\"50\\" fill=\\"gray\\" />',
                '<circle cx=\\"35\\" cy=\\"35\\" r=\\"5\\" fill=\\"black\\" />',
                '<circle cx=\\"65\\" cy=\\"35\\" r=\\"5\\" fill=\\"black\\" />',
                '<path d=\\"M 35 65 Q 50 80 65 65\\" stroke=\\"black\\" stroke-width=\\"5\\" fill=\\"none\\" />',
                '</svg>'
            ));
    }
}
