node-libOpenttdAdmin
====================

A Node.js Library for connecting to Openttd's admin interface.

## Preface

This module can be seen as an update to yorickvP/node-ottdadmin, however its completely rewritten to be a bit more tidy and standard, as well as working on more recent versions of node.
I have kept the interface reasonably similar, however, its not a drop-in replacement. 

## Basic Usage

```javascript
var libOpenttdAdmin = require("libOpenttdAdmin"),
  ottdConnection =  new libOpenttdAdmin.connection();
  
ottdConnection.connect("myserver.com", 3977);

ottdConnection.on('connect', function(){
  ottdConnection.authenticate("MyBot", "MyPass");
});
ottdConnection.on('welcome', function(data){
  ottdConnection.send_rcon("say \"hello world\"");
  ottdConnection.close();
});
```

## Advanced Usage
Examples can be found in the `examples/` folder

## Functions

<table>
  <thead>
    <tr>
      <td>Name</td>
      <td>Description</td>
      <td>parameters</td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>`authenticate`</td>
      <td>Send and authentication request - this must be performed within 10 seconds of the server connecting </td>
      <td>
        <ul>
          <li>`username` - name of the client (can be null for a default)</li>
          <li>`password` - server admin password</li>
        </ul>
      </td>
    </tr>
    <tr>
      <td>`send_rcon`</td>
      <td>Send an rcon command</td>
        <td>
        <ul>
          <li>`command` - command to execute on the server</li> 
        </ul>
      </td>

    </tr>
  </tbody>
</table>
        

  
## Events

| Event Name          | Description         | Options                               |
| ------------------- | :-----------------: | :-----------------------------------: |
| connect             | Called when the tcp connection to the server is connected | none |




<table>
  <thead>
    <tr>
      <td>Event Name</td>
      <td>Description</td>
      <td>Options</td>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>connect</td>
      <td>Called when the tcp connection to the server is connected</td>
      <td>none</td>
    </tr>
    <tr>
      <td>authenticate</td>
      <td>Called when successfully authenticated. `welcome` is more useful for connection however</td>
      <td>version- I have no idea TODO: Lookup</td>
    </tr>
    <tr>
      <td>welcome</td>
      <td>Called when the server sends its "welcome packet", which contains info about the server</td>
      <td>
        name - name of the server <br/>
        version - sematic version of the server. ie- 1.4.0-beta2 <br/>
        dedicated - 0 or 1 depending on whether the server is running as a dedicated server<br/>
        map - data about the map (seed, landscape, startdate, mapheight, mapwidth)
      </td>
      
    </tr>
    <tr>
      <td>newgame</td>
      <td>fired when a new game starts</td>
      <td>none</td>
    </tr>
    <tr>
      <td>shutdown</td>
      <td>fired when a new game ends</td>
      <td>none</td>
    </tr>
    <tr>
      <td>date</td>
      <td>fired when information about the date is received</td>
      <td>date - the current date</td>
    </tr>
    <tr>
      <td>clientjoin</td>
      <td>fired when a client joins</td>
      <td>id - id of joining client</td>
    </tr>
    <tr>
      <td>clientinfo</td>
      <td>Fired when information about the client is received</td>
      <td>
        id - id of the client<br/>
        ip - ip address of the client<br/>
        name - username of the client<br/>
        lang - language id<br/>
        joindate - date the player joined the game<br/>
        company - id of the company that the player is in
      </td>
    </tr>
    <tr>
      <td>clientupdate</td>
      <td>Fired when an update from a client is received</td>
      <td>
        id - id of the client<br/>
        ip - ip address of the client<br/>
        name - username of the client<br/>
        lang - language id<br/>
        joindate - date the player joined the game<br/>
        company - id of the company that the player is in
      </td>
    </tr>
    <tr>
      <td>clientquit</td>
      <td>fired when a client quits</td>
      <td>id - id of the client</td>
    </tr>
    <tr>
      <td>clienterror</td>
      <td>Fired when a client has an error</td>
      <td>id - id of the client<br/>err - error </td>
    </tr>
    <tr>
      <td>companyinfo</td>
      <td>Fired when info about a company is received</td>
      <td>
        id - company id <br/>
        name - company name <br/>
        manager - company manager <br/>
        colour - company primary colour <br/>
        protected - whether the company is password protected <br/>
        startyear - year of inaugaration <br/>
        isai - whether the company is ai or a human player
      </td>
    </tr>
    <tr>
      <td>companyinfo</td>
      <td>Fired when an update happens to a company</td>
      <td>
        id - company id <br/>
        name - company name <br/>
        manager - company manager <br/>
        colour - company primary colour <br/>
        protected - whether the company is password protected <br/>
        shares - who owns the 4 shares, this is an object with elements 1, 2, 3 and 4.
      </td>
    </tr>
    <tr>
      <td>companyremove</td>
      <td>Fired when a company is deleted</td>
      <td>
        id - company id<br />
        reason - reason for deletion (enums.CompanyRemoveReasons needed)
      </td>
    </tr>
    <tr>
      <td>companyeconomy</td>
      <td>fired on receiving information about the company's performance</td>
      <td> 
        id - company id <br/>
        money - money of the company <br/>
        loan - amount the company has borrowed <br/>
        income - income <br/>
        lastquarter - value, performance and cargo delivered (cargo) of the last quarter
        prevquarter - the same, but for the quarter before.
      </td>
    </tr>
    <tr>
      <td>companystats</td>
      <td>Fired on receiving information about the assets of a company </td>
      <td> vehicles - number of trains, lorries, busses, planes and ships that the company owns <br/>
      stations - number of stations of each type that the company owns
      </td>
    </tr>
    <tr>
      <td>chat</td>
      <td>Fired on receiving a chat message</td>
      <td>
        action - what action is included in the message (enums.Actions)<br/>
        desttype - where the message is aimed at (enums.DestTypes) <br/>
        id - message id <br/>
        message - message body<br/>
        money - amount of money sent if action is GIVE_MONEY
      </td>
    </tr>
    <tr>
      <td>rcon</td>
      <td>Fired on receiving the output of an rcon command</td>
      <td>
        colour - what colour the message is displayed in <br/>
        output - output of the rcon <br/>
      </td>
    </tr>
    <tr>
      <td>console</td>
      <td>Fired on receiving output</td>
      <td>
        origin - origin of the output </br>
        output - body of the output
      </td>
    </tr>
      
      </td>
      
    
        
        
  </tbody>
</table>