var libOpenttdAdmin = require("../main"),
  ottdConnection =  new libOpenttdAdmin.connection();

ottdConnection.connect("MyServer", 3977)

ottdConnection.on('connect', function(){
  ottdConnection.authenticate("MyBot", "MyPass");
});
ottdConnection.on('welcome', function(data){
  console.log("Welcome: ", data);
  ottdConnection.send_update_frequency(libOpenttdAdmin.enums.UpdateTypes.CLIENT_INFO, libOpenttdAdmin.enums.UpdateFrequencies.AUTOMATIC);
});
ottdConnection.on('error', function(err){
  console.log("Error: " + err) 
});
ottdConnection.on('clientjoin', function(id){
  console.log("Client with id: ", id, " has joined the game.");
});
ottdConnection.on('clientinfo', function(client){
  console.log("Info for client: ", client);
});
ottdConnection.on('clientupdate', function(client){
  console.log("client updated: ", client);
});
ottdConnection.on('clientquit', function(id){
  console.log("Client with id: ", id, " has left the game.");
});
ottdConnection.on('clienterror', function(client){
  console.log("Client with id: ", client.id, " has had an error: ", client.err);
});