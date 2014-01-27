/* Based on tcp_enum.js from node-ottdadmin by yorickvP: 
https://raw.github.com/yorickvP/node-ottdadmin/master/tcp_enum.js
*/

/*This project is free software released under the MIT/X11 license:

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.*/
const AdminPackets = {
ADMIN_JOIN: 0,               ///< The admin announces and authenticates itself to the server.
ADMIN_QUIT: 1,               ///< The admin tells the server that it is quitting.
ADMIN_UPDATE_FREQUENCY: 2,   ///< The admin tells the server the update frequency of a particular piece of information.
ADMIN_POLL: 3,               ///< The admin explicitly polls for a piece of information.
ADMIN_CHAT: 4,               ///< The admin sends a chat message to be distributed.
ADMIN_RCON: 5,               ///< The admin sends a remote console command.
ADMIN_GAMESCRIPT: 6,         
ADMIN_PING: 7,               

SERVER_FULL: 100,            ///< The server tells the admin it cannot accept the admin.
SERVER_BANNED: 101,          ///< The server tells the admin it is banned.
SERVER_ERROR: 102,           ///< The server tells the admin an error has occurred.
SERVER_PROTOCOL: 103,        ///< The server tells the admin its protocol version.
SERVER_WELCOME: 104,         ///< The server welcomes the admin to a game.
SERVER_NEWGAME: 105,         ///< The server tells the admin its going to start a new game.
SERVER_SHUTDOWN: 106,        ///< The server tells the admin its shutting down.

SERVER_DATE: 107,            ///< The server tells the admin what the current game date is.
SERVER_CLIENT_JOIN: 108,     ///< The server tells the admin that a client has joined.
SERVER_CLIENT_INFO: 109,     ///< The server gives the admin information about a client.
SERVER_CLIENT_UPDATE: 110,   ///< The server gives the admin an information update on a client.
SERVER_CLIENT_QUIT: 111,     ///< The server tells the admin that a client quit.
SERVER_CLIENT_ERROR: 112,    ///< The server tells the admin that a client caused an error.
SERVER_COMPANY_NEW: 113,     ///< The server tells the admin that a new company has started.
SERVER_COMPANY_INFO: 114,    ///< The server gives the admin information about a company.
SERVER_COMPANY_UPDATE: 115,  ///< The server gives the admin an information update on a company.
SERVER_COMPANY_REMOVE: 116,  ///< The server tells the admin that a company was removed.
SERVER_COMPANY_ECONOMY: 117, ///< The server gives the admin some economy related company information.
SERVER_COMPANY_STATS: 118,   ///< The server gives the admin some statistics about a company.
SERVER_CHAT: 119,            ///< The server received a chat message and relays it.
SERVER_RCON: 120,            ///< The server's reply to a remove console command.
SERVER_CONSOLE: 121,         ///< The server gives the admin the data that got printed to its console.
SERVER_CMD_NAMES: 122,       ///< The server sends out the names of the DoCommands to the admins.
SERVER_CMD_LOGGING: 123,     ///< The server gives the admin copies of incoming command packets.
SERVER_GAMESCRIPT: 124,      
SERVER_RCON_END: 125,      
SERVER_PONG: 126,
};

const UpdateTypes =
{ DATE           : 0   ///< Updates about the date of the game.
, CLIENT_INFO    : 1   ///< Updates about the information of clients.
, COMPANY_INFO   : 2   ///< Updates about the generic information of companies.
, COMPANY_ECONOMY: 3   ///< Updates about the economy of companies.
, COMPANY_STATS  : 4   ///< Updates about the statistics of companies.
, CHAT           : 5   ///< The admin would like to have chat messages.
, CONSOLE        : 6   ///< The admin would like to have console messages.
, CND_NAMES      : 7   ///< The admin would like a list of all DoCommand names.
, CMD_LOGGING    : 8 } ///< The admin would like to have DoCommand information.

/** Update frequencies an admin can register. */
const UpdateFrequencies =
{ POLL     : 0x01
, DAILY    : 0x02
, WEEKLY   : 0x04
, MONTHLY  : 0x08
, QUARTERLY: 0x10
, ANUALLY  : 0x20
, AUTOMATIC: 0x40 }

const CompanyRemoveReasons =
{ MANUAL   : 0
, AUTOCLEAN: 1
, BANKRUPT : 2 }

const Actions =
{ JOIN             : 0x00
, LEAVE            : 0x01
, SERVER_MESSAGE   : 0x02
, CHAT             : 0x03
, CHAT_COMPANY     : 0x04
, CHAT_CLIENT      : 0x05
, GIVE_MONEY       : 0x06
, NAME_CHANGE      : 0x07
, COMPANY_SPECTATOR: 0x08
, COMPANY_JOIN     : 0x09
, COMPANY_NEW      : 0x0A }

const DestTypes = 
{ BROADCAST        : 0x00
, TEAM             : 0x01
, CLIENT           : 0x02 }

const NetworkErrorCodes =
{ GENERAL          : 0x00 // Try to use this one like never
// Signals from clients //
, DESYNC           : 0x01
, SAVEGAME_FAILED  : 0x02
, CONNECTION_LOST  : 0x03
, ILLEGAL_PACKET   : 0x04
, NEWGRF_MISMATCH  : 0x05
// Signals from servers //
, NOT_AUTHORIZED   : 0x06
, NOT_EXPECTED     : 0x07
, WRONG_REVISION   : 0x08
, NAME_IN_USE      : 0x09
, WRONG_PASSWORD   : 0x0A
, COMPANY_MISMATCH : 0x0B // Happens in CLIENT_COMMAND
, KICKED           : 0x0C
, CHEATER          : 0x0D
, FULL             : 0x0E
, TOO_MANY_COMMANDS: 0x0F }

module.exports = 
{ AdminPackets        : AdminPackets
, UpdateTypes         : UpdateTypes
, UpdateFrequencies   : UpdateFrequencies
, CompanyRemoveReasons: CompanyRemoveReasons
, Actions             : Actions
, DestTypes           : DestTypes
, NetworkErrorCodes   : NetworkErrorCodes    }
