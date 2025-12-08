// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Contract {
    struct Book {
        string bookId;
        string title;
        uint256 price;
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
    mapping(string => Book) public books;

    mapping(address => License[]) public userLicenses; // licenses that have for users

    event BookMinted(
        string indexed bookId,
        address author,
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

    function mintBook(
        string memory _title,
        uint256 _price,
        uint256 _royalty,
        string memory _bookId
    ) public {
        require(_royalty <= 100, "Royalty cannot exceed 100%");
        require(_price > 0, "Price must have a price");

        bookCount++;

        books[_bookId] = Book(
            _bookId,
            _title,
            _price,
            _royalty,
            0,
            true,
            payable(msg.sender)
        );

        emit BookMinted(_bookId, msg.sender, _title, _price, _royalty);
    }

    function purchaseBook(string memory _bookId) public payable {
        Book memory b = books[_bookId];
        require(b.price > 0, "Book does not exist");
        require(msg.value == b.price, "Incorrect payment amount");

        uint256 royaltyAmount = (msg.value * b.royalty) / 100;

        (bool success, ) = b.author.call{value: royaltyAmount}("");
        require(success, "Transfer failed");

        (bool successContract, ) = payable(address(this)).call{
            value: msg.value - royaltyAmount
        }("");
        require(successContract, "Transfer failed");

        b.totalSales++;

        License memory newLicense = License({
            bookId: _bookId,
            licensee: msg.sender,
            purchasedDate: block.timestamp,
            isActive: true
        });

        userLicenses[msg.sender].push(newLicense);

        emit BookPurchased(_bookId, (msg.sender), b.price);
        emit RoyaltyPaid(_bookId, b.author, royaltyAmount);
    }

    function getLicenses() public view returns (License[] memory) {
        return userLicenses[msg.sender];
    }

    function deactivateBook(string memory _bookId) public {
        Book memory b = books[_bookId];
        require(b.author == msg.sender, "Only author can deactivate the book");

        b.isActive = false;

        emit BookDeactivated(_bookId);
    }
}
