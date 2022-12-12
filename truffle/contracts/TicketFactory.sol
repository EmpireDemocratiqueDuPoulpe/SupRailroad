pragma solidity ^0.8.0;
// SPDX-License-Identifier: UNLICENSED

// ISSUE 01 :
// Storing an array of Coordinates in a Ticket is forbidden by the Solidity gods. But storing the same Ticket in an array
// of Ticket in another struct is allowed. I don't know why. I didn't found a fix.

contract TicketFactory {
    constructor() {}

    /// Properties
    struct Ticket {
        address owner;
        string name;
        string[] types;
        // Coordinate[] points; // See ISSUE 01
        uint256 distance;
    }

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
    function _addTicket(address _owner, Ticket memory _ticket) private {
        userToTickets[_owner].push(_ticket);
    }

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
    function getTickets() public view returns(Ticket[] memory) {
        return _getTicketsOf(msg.sender);
    }

    function _getTicketsOf(address _owner) internal view returns(Ticket[] memory) {
        return userToTickets[_owner];
    }

    function _getTicket(address _owner, uint256 _index) internal view checkIndex(_owner, _index) returns(Ticket memory) {
        return userToTickets[_owner][_index];
    }

    // Functions - Update
    function _setTicketOf(address _owner, uint256 _index, Ticket memory _ticket) internal {
        userToTickets[_owner][_index] = _ticket;
    }

    // Functions - Delete
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
