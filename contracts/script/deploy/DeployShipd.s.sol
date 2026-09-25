// SPDX-License-Identifier: MIT
pragma solidity 0.8.37;

import {Script} from "forge-std/Script.sol";
import {console2} from "forge-std/console2.sol";

import {ShipdRegistry} from "../../src/ShipdRegistry.sol";
import {WorkReceipt} from "../../src/WorkReceipt.sol";
import {Reputation} from "../../src/Reputation.sol";

/// @title DeployShipd
/// @notice Deploys the three Shipd V1 contracts to Monad in protocol order:
///         ShipdRegistry -> WorkReceipt -> Reputation.
/// @dev V1 deployment only. No cross-contract authorization or wiring is
///      performed here; each contract is deployed standalone.
contract DeployShipd is Script {
    function run() external {
        uint256 deployerPrivateKey = vm.envUint("MONAD_DEPLOYER_PRIVATE_KEY");

        vm.startBroadcast(deployerPrivateKey);

        ShipdRegistry registry = new ShipdRegistry();
        WorkReceipt workReceipt = new WorkReceipt();
        Reputation reputation = new Reputation();

        vm.stopBroadcast();

        console2.log("ShipdRegistry deployed at:", address(registry));
        console2.log("WorkReceipt deployed at:", address(workReceipt));
        console2.log("Reputation deployed at:", address(reputation));
    }
}
