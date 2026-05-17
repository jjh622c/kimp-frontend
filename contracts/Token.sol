// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title KiMP Token — Korea Premium Arbitrage Vault Token
/// @notice ERC-20 token on Base. Owner (admin) can mint and burn.
///         Buyback-and-burn model: profits used to buy back tokens from investors.
contract KimpToken is ERC20, Ownable {
    uint8 private constant _DECIMALS = 18;

    event TokensMinted(address indexed to, uint256 amount, string inviteToken);
    event TokensBurned(address indexed from, uint256 amount, string reason);

    constructor(address initialOwner)
        ERC20("KiMP Token", "KMP")
        Ownable(initialOwner)
    {}

    function decimals() public pure override returns (uint8) {
        return _DECIMALS;
    }

    /// @notice Mint tokens to investor wallet after deposit confirmation.
    /// @param to Investor wallet address
    /// @param amount Token amount (in wei, 18 decimals)
    /// @param inviteToken Invite token string for auditability
    function mint(address to, uint256 amount, string calldata inviteToken) external onlyOwner {
        _mint(to, amount);
        emit TokensMinted(to, amount, inviteToken);
    }

    /// @notice Burn tokens from an address (buyback execution).
    /// @param from Address to burn from (must have approved this contract)
    /// @param amount Token amount to burn
    /// @param reason Reason string (e.g., "buyback_2025_01")
    function burnFrom(address from, uint256 amount, string calldata reason) external onlyOwner {
        _burn(from, amount);
        emit TokensBurned(from, amount, reason);
    }
}
