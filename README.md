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

| Event Name          | Description                                                                               | Options                               |
| ------------------- | :---------------------------------------------------------------------------------------: | :-----------------------------------: |
|`connect`            | Called when the tcp connection to the server is connected                                 | none |
|`authenticate`       |Called when successfully authenticated. `welcome` is more useful for connection however    |version- I have no idea TODO: Lookup|
|`welcome`            |Called when the server sends its "welcome packet", which contains info about the server    |name - name of the server <br/>version - sematic version of the server. ie- 1.4.0-beta2 <br/>dedicated - 0 or 1 depending on whether the server is running as a dedicated server<br/> map - data about the map (seed, landscape, startdate, mapheight, mapwidth)|
|`newgame`            |fired when a new game starts                                                               |none|
|`shutdown`           |fired when a new game ends                                                                 |none|
|`date`               |fired when information about the date is received                                          |date - the current date|
|`clientjoin`         |fired when a client joins                                                                  |id - id of joining client|
|`clientinfo`         |Fired when information about the client is received                                        |id - id of the client<br/>ip - ip address of the client<br/>name - username of the client<br/>lang - language id<br/>joindate - date the player joined the game<br/>company - id of the company that the player is in|
|`clientupdate`       |Fired when an update from a client is received                                             |id - id of the client<br/>ip - ip address of the client<br/>name - username of the client<br/>lang - language id<br/>joindate - date the player joined the game<br/>company - id of the company that the player is in|
|`clientquit`         |fired when a client quits                                                                  |id - id of the client|
|`clienterror`        |Fired when a client has an error                                                           |id - id of the client<br/>err - error |
|`companyinfo`        |Fired when info about a company is received                                                |id - company id <br/>name - company name <br/>manager - company manager <br/>colour - company primary colour <br/>protected - whether the company is password protected <br/>startyear - year of inaugaration <br/>isai - whether the company is ai or a human player|
|`companyupdate`      |Fired when an update happens to a company                                                  |id - company id <br/>name - company name <br/>manager - company manager <br/>colour - company primary colour <br/>protected - whether the company is password protected <br/> shares - who owns the 4 shares, this is an object with elements 1, 2, 3 and 4.|
|`companyremove`      |Fired when a company is deleted                                                            |id - company id<br />reason - reason for deletion (enums.CompanyRemoveReasons needed)|
|`companyeconomy`     |fired on receiving information about the company's performance                             | id - company id <br/> money - money of the company <br/> loan - amount the company has borrowed <br/>income - income <br/>lastquarter - value, performance and cargo delivered (cargo) of the last quarterprevquarter - the same, but for the quarter before.|
|`companystats`       |Fired on receiving information about the assets of a company                               | vehicles - number of trains, lorries, busses, planes and ships that the company owns <br/>stations - number of stations of each type that the company owns|
|`chat`               |Fired on receiving a chat message                                                          |action - what action is included in the message (enums.Actions)<br/>desttype - where the message is aimed at (enums.DestTypes) <br/>id - message id <br/>message - message body<br/>money - amount of money sent if action is GIVE_MONEY|
|`rcon`               |Fired on receiving the output of an rcon command                                           |colour - what colour the message is displayed in <br/>output - output of the rcon <br/>|
|`console`            |Fired on receiving output                                                                  |origin - origin of the output </br>output - body of the output|
      
      
      
    