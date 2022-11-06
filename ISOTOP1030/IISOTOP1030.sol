// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

///  这是一个预言机的包装合约，使用了chainlink的VRF
///  使用者无需申请link，只需要付费TGAS费用，我们会支付chainlink的通道费用
///  注意，尚未支持国内联盟链。 正在移植中

interface IISOTOP1030 {
    event RequestSent(uint256 requestId, uint32 numWords);
    event RequestFulfilled(uint256 requestId, uint256[] randomWords);

    // 发起N个随机数请求，返回请求ID
    function requestRandomWords(uint32 numWords)
        external
        returns (uint256 requestId);

    // 查询随机数请求状况，如果完成了就读取数组
    function getRequestStatus(uint256 _requestId)
        external
        view
        returns (bool fulfilled, uint256[] memory randomWords);

    // 混淆一个数组，根据生成的随机数作为种子
    function shuffle(uint256 size, uint256 entropy)
        external
        pure
        returns (uint256[] memory);
}
