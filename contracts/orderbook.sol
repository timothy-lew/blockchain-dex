pragma solidity ^0.8.0;
// Import both the IERC20 interface and the ERC20 contracts from the OpenZeppelin library
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";


contract Token1 is ERC20 {
    // Constructor function that initializes the ERC20 token with a custom name, symbol, and initial supply
    // The name, symbol, and initial supply are passed as arguments to the constructor
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) ERC20(name, symbol) {
        // Mint the initial supply of tokens to the deployer's address
        _mint(msg.sender, initialSupply);
    }
}
contract Token2 is ERC20 {
    constructor(
        string memory name,
        string memory symbol,
        uint256 initialSupply
    ) ERC20(name, symbol) {
        // Mint the initial supply of tokens to the deployer's address
        _mint(msg.sender, initialSupply);
    }
}
// Define the Orderbook smart contract
contract Orderbook {
     // Contract Code here
    struct Order {
        uint256 id;
        address trader;
        bool isBuyOrder;
        uint256 price;
        uint256 quantity;
        uint256 filledQuantity;
        address baseToken; // ERC20 token address for the base asset
        address quoteToken; // ERC20 token address for the quote asset (e.g., stablecoin)
    }
    // Arrays to store bid (buy) orders and ask (sell) orders
    Order[] public bidOrders;
    Order[] public askOrders;
    // Events
    event OrderCanceled(
        uint256 indexed orderId,
        address indexed trader,
        bool isBuyOrder
    );
    event TradeExecuted(
        uint256 indexed buyOrderId,
        uint256 indexed sellOrderId,
        address indexed buyer,
        address seller,
        uint256 price,
        uint256 quantity
    );

    // Place a buy order
    function placeBuyOrder(uint256 price,
        uint256 quantity,
        address baseToken,
        address quoteToken
    ) external {
        // Check that the trader has approved enough quote tokens to cover the order value
        uint256 orderValue = price * quantity;
        IERC20 quoteTokenContract = IERC20(quoteToken);
        require(quoteTokenContract.allowance(msg.sender, address(this)) >= orderValue, "Insufficient allowance");
        // Insert the buy order and match it with compatible sell orders
        Order memory newOrder = Order({
            id: bidOrders.length,
            trader: msg.sender,
            isBuyOrder: true,
            price: price,
            quantity: quantity,
            isFilled: 0,
            baseToken: baseToken,
            quoteToken: quoteToken
        });
        insertBidOrder(newOrder);
        matchBuyOrder(newOrder.id);
    }
    // Place a sell order
    function placeSellOrder(
        uint256 price,
        uint256 quantity,
        address baseToken,
        address quoteToken
    ) external {
        // Check that the trader has approved enough base tokens to cover the order quantity
        IERC20 baseTokenContract = IERC20(baseToken);
        require(baseTokenContract.allowance(msg.sender, address(this)) >= quantity, "Insufficient allowance");
        // Insert the sell order and match it with compatible buy orders
        Order memory newOrder = Order({
            id: askOrders.length,
            trader: msg.sender,
            isBuyOrder: false,
            price: price,
            quantity: quantity,
            isFilled: 0,
            baseToken: baseToken,
            quoteToken: quoteToken
        });
        insertAskOrder(newOrder);
        matchSellOrder(newOrder.id);
    }
    // Function to cancel an existing order
    function cancelOrder(uint256 orderId, bool isBuyOrder) external {
        // Retrieve the order from the appropriate array
        Order storage order = isBuyOrder
            ? bidOrders[getBidOrderIndex(orderId)]
            : askOrders[getAskOrderIndex(orderId)];
        // Verify that the caller is the original trader
        require(
            order.trader == msg.sender,
            "Only the trader can cancel the order"
        );
        // Mark the order as filled (canceled)
        order.isFilled = true;
        emit OrderCanceled(orderId, msg.sender, isBuyOrder);
    }
        



}