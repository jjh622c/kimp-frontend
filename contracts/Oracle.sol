// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @title KiMP Price Oracle — on-chain token price and monthly report registry
/// @notice Admin-controlled price feed. Investors can verify price via read-only calls.
contract KimpOracle is Ownable {

    struct PriceRecord {
        uint256 price;   // KRW * 100 (e.g. 102000 = 1020.00 KRW)
        uint256 timestamp;
        string  note;
    }

    struct ReportRecord {
        bytes32 reportHash;  // SHA-256 of monthly PDF report
        uint256 timestamp;
        string  note;
    }

    PriceRecord[] public priceHistory;
    mapping(string => ReportRecord) public monthlyReports; // key: "YYYY-MM"

    event PriceUpdated(uint256 price, string note, uint256 timestamp);
    event MonthlyReportRecorded(string month, bytes32 reportHash, string note, uint256 timestamp);

    constructor(address initialOwner) Ownable(initialOwner) {}

    /// @notice Update token price. price is KRW * 100.
    function updatePrice(uint256 price, string calldata note) external onlyOwner {
        priceHistory.push(PriceRecord({ price: price, timestamp: block.timestamp, note: note }));
        emit PriceUpdated(price, note, block.timestamp);
    }

    /// @notice Get latest token price.
    function latestPrice() external view returns (uint256 price, uint256 timestamp) {
        require(priceHistory.length > 0, "No price data");
        PriceRecord memory latest = priceHistory[priceHistory.length - 1];
        return (latest.price, latest.timestamp);
    }

    /// @notice Record monthly report hash for investor auditability.
    function recordMonthlyReport(
        string calldata month,
        bytes32 reportHash,
        string calldata note
    ) external onlyOwner {
        monthlyReports[month] = ReportRecord({
            reportHash: reportHash,
            timestamp: block.timestamp,
            note: note
        });
        emit MonthlyReportRecorded(month, reportHash, note, block.timestamp);
    }

    /// @notice Get total number of price records.
    function priceHistoryLength() external view returns (uint256) {
        return priceHistory.length;
    }
}
