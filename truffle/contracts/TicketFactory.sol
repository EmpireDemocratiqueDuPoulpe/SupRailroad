// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

// ISSUE 01 :
// Storing an array of Coordinates in a Ticket is forbidden by the Solidity gods. But storing the same Ticket in an array
// of Ticket in another struct is allowed. I don't know why. I didn't found a fix.

/// @title Exposes basic functions to create, read, update and delete tickets from user wallets.
/// @author Alexis L. <alexis.lecomte@supinfo.com>
contract TicketFactory {
    constructor() {}

    /// Properties
    /// @notice A ticket structure.
    /// @param owner - The ticket owner.
    /// @param name - The ticket name.
    /// @param types - A list of transport types (bus, train, subway).
    /// @param distance - The distance in kilometer.
    struct Ticket {
        address owner;
        string name;
        string[] types;
        // Coordinate[] points; // See ISSUE 01
        uint256 distance;
    }

    /// @notice A coordinate structure.
    /// @param lat - Latitude of the coordinate.
    /// @param long - Longitude of the coordinate.
    struct Coordinate {
        int32 lat;
        int32 long;
    }

    /// Mappings
    mapping (address => Ticket[]) private userToTickets;

    /// Modifier
    modifier checkIndex(address _owner, uint256 _index) {
        require(_index < _getTicketsOf(_owner).length, "Invalid ticket index!");
        _;
    }

    /// Functions
    // Functions - Create
    /// @notice Adds a ticket to an address.
    /// @param _owner - The owner of the ticket.
    /// @param _ticket - The ticket.
    function _addTicket(address _owner, Ticket memory _ticket) private {
        userToTickets[_owner].push(_ticket);
    }

    /// @notice Creates a ticket an associate it to an address.
    /// @param _owner - The owner of the new ticket.
    /// @param _name - The name of the new ticket.
    /// @param _types - The transport types of the new ticket.
    /// @param _distance - The distance of the new ticket.
    /// @return The new ticket.
    function _createTicket(address _owner, string memory _name, string[] memory _types, uint256 _distance) internal returns(Ticket memory) {
        // Ticket storage ticket = _addTicket(_owner, Ticket(_owner, _name, _types, new Coordinate[](_points.length), _distance)); // See ISSUE 01
        Ticket memory ticket = Ticket(_owner, _name, _types, _distance);
        _addTicket(_owner, ticket);

        // for(uint i = 0; i < _points.length; i++) { // See ISSUE 01
        //     ticket.points.push(_points[i]);        // See ISSUE 01
        // }                                          // See ISSUE 01

        return ticket;
    }

    // Functions - Read
    /// @notice Returns the tickets wallet of the address who call this function.
    /// @return The tickets wallet.
    function getTickets() public view returns(Ticket[] memory) {
        return _getTicketsOf(msg.sender);
    }

    /// @notice Returns the tickets wallet of the specified address.
    /// @param _owner - Owner to fetch the tickets from.
    /// @return The tickets wallet.
    function _getTicketsOf(address _owner) internal view returns(Ticket[] memory) {
        return userToTickets[_owner];
    }

    /// @notice Returns a specific ticket from a specified address at a specified index.
    /// @param _owner - Owner to fetch the ticket from.
    /// @param _index - Index of the ticket in the owner wallet.
    /// @return The ticket.
    function _getTicket(address _owner, uint256 _index) internal view checkIndex(_owner, _index) returns(Ticket memory) {
        return userToTickets[_owner][_index];
    }

    // Functions - Update
    /// @notice Replaces a ticket from a specified address at a specified index.
    /// @param _owner - Owner of the replaced ticket.
    /// @param _index - Index of the ticket to replace.
    /// @param _ticket - The ticket that will overwrite the older one.
    function _setTicketOf(address _owner, uint256 _index, Ticket memory _ticket) internal {
        userToTickets[_owner][_index] = _ticket;
    }

    // Functions - Delete
    /// @notice Removes a ticket from a specified address at a specified index.
    /// @param _owner - Owner of the deleted ticket.
    /// @param _index - Index of the ticket to delete.
    function _removeTicket(address _owner, uint256 _index) internal checkIndex(_owner, _index) {
        // Delete the ticket
        delete userToTickets[_owner][_index];

        // Sort the array and truncate it
        uint256 offset = 0;

        for (uint256 idx = 0; idx <  userToTickets[_owner].length; idx++) {
            if (offset > 0) {
                userToTickets[_owner][idx - offset] =  userToTickets[_owner][idx];
            }

            if ( userToTickets[_owner][idx].distance == 0) {
                offset++;
            }
        }

        for (uint256 i = 0; i < offset; i++) {
            userToTickets[_owner].pop();
        }
    }
}
