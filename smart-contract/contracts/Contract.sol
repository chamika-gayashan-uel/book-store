// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract BookStore {
    struct Book {
        string bookId;
        string title;
        uint256 price; // Price in Wei
        uint256 royalty;
        uint256 totalSales;
        bool isActive;
        address payable author;
    }

    struct License {
        string bookId;
        address licensee;
        uint256 purchasedDate;
        bool isActive;
    }

    uint256 public bookCount;

    // Mappings
    mapping(string => Book) public books;
    mapping(address => License[]) public userLicenses;
    mapping(string => bool) public bookExists; // Check if bookId exists
    mapping(address => mapping(string => bool)) public hasAccess; // user => bookId => hasLicense

    // Events
    event BookMinted(
        string indexed bookId,
        address indexed author,
        string title,
        uint256 price,
        uint256 royalty
    );

    event BookUpdated(
        string indexed bookId,
        address indexed author,
        string title,
        uint256 price,
        uint256 royalty
    );

    event BookPurchased(
        string indexed bookId,
        address indexed buyer,
        uint256 price
    );

    event RoyaltyPaid(
        string indexed bookId,
        address indexed author,
        uint256 amount
    );

    event BookDeactivated(string indexed bookId);

    /**
     * @dev Mint a new book
     * @param _title Book title
     * @param _price Price in Wei (useWeb3 to convert: ethers.utils.parseEther("0.05"))
     * @param _royalty Royalty percentage (0-100)
     * @param _bookId Unique book identifier
     */
    function mintBook(
        string memory _title,
        uint256 _price,
        uint256 _royalty,
        string memory _bookId
    ) public {
        // Validations
        require(!bookExists[_bookId], "Book ID already exists");
        require(_royalty <= 100, "Royalty cannot exceed 100%");
        require(_price > 0, "Price must be greater than 0");
        require(bytes(_title).length > 0, "Title cannot be empty");
        require(bytes(_bookId).length > 0, "Book ID cannot be empty");

        bookCount++;

        // Create book
        books[_bookId] = Book({
            bookId: _bookId,
            title: _title,
            price: _price,
            royalty: _royalty,
            totalSales: 0,
            isActive: true,
            author: payable(msg.sender)
        });

        bookExists[_bookId] = true;

        // Author automatically has access to their own book
        hasAccess[msg.sender][_bookId] = true;

        emit BookMinted(_bookId, msg.sender, _title, _price, _royalty);
    }

    /**
     * @dev Purchase a book license
     * @param _bookId Book identifier
     */
    function purchaseBook(string memory _bookId) public payable {
        Book storage book = books[_bookId]; // Use storage to modify the struct

        // Validations
        require(bookExists[_bookId], "Book does not exist");
        require(book.isActive, "Book is not active");
        require(msg.value >= book.price, "Insufficient payment");
        require(!hasAccess[msg.sender][_bookId], "You already own this book");
        require(
            msg.sender != book.author,
            "Author cannot purchase their own book"
        );

        // Calculate royalty
        uint256 royaltyAmount = (msg.value * book.royalty) / 100;
        uint256 platformFee = msg.value - royaltyAmount;

        // Transfer royalty to author
        (bool successAuthor, ) = book.author.call{value: royaltyAmount}("");
        require(successAuthor, "Royalty transfer to author failed");

        // Platform fee stays in contract (owner can withdraw)
        // No need to transfer to contract, it's already there

        // Update sales count
        book.totalSales++;

        // Create license
        License memory newLicense = License({
            bookId: _bookId,
            licensee: msg.sender,
            purchasedDate: block.timestamp,
            isActive: true
        });

        userLicenses[msg.sender].push(newLicense);
        hasAccess[msg.sender][_bookId] = true;

        // Emit events
        emit BookPurchased(_bookId, msg.sender, book.price);
        emit RoyaltyPaid(_bookId, book.author, royaltyAmount);

        // Refund excess payment
        if (msg.value > book.price) {
            (bool refundSuccess, ) = payable(msg.sender).call{
                value: msg.value - book.price
            }("");
            require(refundSuccess, "Refund failed");
        }
    }

    /**
     * @dev Get all licenses for current user
     * @return Array of user's licenses
     */
    function getLicenses() public view returns (License[] memory) {
        return userLicenses[msg.sender];
    }

    /**
     * @dev Get licenses for specific user (public view)
     * @param _user User address
     * @return Array of user's licenses
     */
    function getUserLicenses(
        address _user
    ) public view returns (License[] memory) {
        return userLicenses[_user];
    }

    /**
     * @dev Check if user has access to a book
     * @param _user User address
     * @param _bookId Book identifier
     * @return True if user has access
     */
    function checkAccess(
        address _user,
        string memory _bookId
    ) public view returns (bool) {
        return hasAccess[_user][_bookId];
    }

    /**
     * @dev Deactivate a book (author only)
     * @param _bookId Book identifier
     */
    function deactivateBook(string memory _bookId) public {
        Book storage book = books[_bookId];

        require(bookExists[_bookId], "Book does not exist");
        require(
            book.author == msg.sender,
            "Only author can deactivate the book"
        );
        require(book.isActive, "Book is already inactive");

        book.isActive = false;

        emit BookDeactivated(_bookId);
    }

    /**
     * @dev Reactivate a book (author only)
     * @param _bookId Book identifier
     */
    function reactivateBook(string memory _bookId) public {
        Book storage book = books[_bookId];

        require(bookExists[_bookId], "Book does not exist");
        require(
            book.author == msg.sender,
            "Only author can reactivate the book"
        );
        require(!book.isActive, "Book is already active");

        book.isActive = true;
    }

    /**
     * @dev Update book (author only)
     * @param _bookId Book identifier
     * @param _newTitle New title in string
     * @param _newPrice New price in Wei
     */
    function updateBook(
        string memory _bookId,
        string memory _newTitle,
        uint256 _newPrice
    ) public {
        Book storage book = books[_bookId];

        require(bookExists[_bookId], "Book does not exist");
        require(book.author == msg.sender, "Only author can update price");
        require(_newPrice > 0, "Price must be greater than 0");

        book.price = _newPrice;
        book.title = _newTitle;

        emit BookUpdated(
            book.bookId,
            book.author,
            book.title,
            book.price,
            book.royalty
        );
    }

    /**
     * @dev Get book details
     * @param _bookId Book identifier
     * @return Book struct
     */
    function getBook(string memory _bookId) public view returns (Book memory) {
        require(bookExists[_bookId], "Book does not exist");
        return books[_bookId];
    }

    /**
     * @dev Get contract balance
     * @return Contract balance in Wei
     */
    function getBalance() public view returns (uint256) {
        return address(this).balance;
    }

    /**
     * @dev Withdraw contract balance (platform fees)
     * Only contract deployer can withdraw
     */
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function withdraw() public {
        require(msg.sender == owner, "Only owner can withdraw");
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");

        (bool success, ) = payable(owner).call{value: balance}("");
        require(success, "Withdrawal failed");
    }

    // Allow contract to receive ETH
    receive() external payable {}
    fallback() external payable {}
}
