// SPDX-License-Identifier: MIT
// IISOTOP version 0.10
// Creator: Dr. Zu team

pragma solidity ^0.8.4;

/**
 * @dev Interface of ISOTOP1014 跨链转移智能合约

测试用的baseURI json 文件：
https://bafybeigtb3tt4a2eyurd4vk7jrjuiwnetufyfy7evmf4e2nwljatrcsdhq.ipfs.nftstorage.link/

主要测试功能：
*） 给NFT加持内容：setBaseURI
*） 铸造NFT：mint
*） 安全铸造NFT（检查是否可以被合约地址拥有）：safeMint
*） 租借：setUser
*） 检查租借用户，有效期： userOf
*） 销毁：burn
*） 可查询接口：tokenByIndex, tokenOfOwnerByIndex
*） 转移：transferFrom
*)  跨链转移：transferFrom

测试要点：
1） 测试跨链转移功能

 */
interface IISOTOP1014 {
    event baseURIChanged(string uri);
    event detailsURIChanged(string uri);
    event gasLoaded(address gasManager);

    /// @dev 新增接口

    event transferTokenAcrossChain(
        address from,
        uint256 chainId,
        address to,
        uint256 tokenId,
        uint256 totalSupply,
        string baseURI
    );
    event tokenAcrossChainTransfered(
        uint256 chainFromId,
        address from,
        uint256 chainToId,
        address to,
        uint256 tokenId
    );

    function transferFrom(
        address from,
        address to,
        uint256 tokenId,
        uint256 chainId
    ) external;

    function transferAcrossChain(
        uint256 chainId,
        address from,
        address to,
        uint256 tokenId,
        uint256 totalSupply
    ) external;

    /// @dev  标准接口
    function init(
        string memory name_,
        string memory symbol_,
        string memory base_,
        string memory details_
    ) external;

    function name() external view returns (string memory);

    function symbol() external view returns (string memory);

    function contractName() external returns (string memory);

    function setBaseURI(string memory base_) external;

    function setDetailsURI(string memory uri_) external;

    function setTGas(address _tgas) external;

    function getTGas() external view returns (address);

    function transferOwnership(address newOwner) external;

    function mint(address _to, uint256 quantity) external;

    function safeMint(address _to, uint256 quantity) external;

    function supportsInterface(bytes4 interfaceId) external view returns (bool);

    function approve(address to, uint256 tokenId) external;

    function getApproved(uint256 tokenId) external view returns (address);

    function setApprovalForAll(address operator, bool approved) external;

    function isApprovedForAll(address owner, address operator)
        external
        view
        returns (bool);

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external;

    function safeTransferFrom(
        address from,
        address to,
        uint256 tokenId,
        bytes memory _data
    ) external;

    function totalSupply() external view returns (uint256);

    function tokenByIndex(uint256 index) external view returns (uint256);

    function tokenOfOwnerByIndex(address owner, uint256 index)
        external
        view
        returns (uint256 tokenId);

    function burn(uint256 tokenId) external;

    function exists(uint256 tokenId) external view returns (bool);

    function burned() external view returns (uint256);

    function ownerOf(uint256 tokenId) external view returns (address);

    function setUser(
        uint256 tokenId,
        address user,
        uint64 expires
    ) external;

    function userOf(uint256 tokenId) external view returns (address);

    function userExpires(uint256 tokenId) external view returns (uint256);

    function balanceOf(address owner) external view returns (uint256);

    function Details() external view returns (string memory);

    function tokenURI(uint256 tokenId) external view returns (string memory);
}
