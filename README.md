node-libOpenttdAdmin
====================

A Node.js Library for connecting to Openttd's admin interface.

## Events

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
    
        
        
  </tbody>
</table>