libOpenttdAdmin = require("../main");

var ottd = new libOpenttdAdmin.connection();

ottd.connect("tinworkx.com", 3999)

ottd.on('connect', function(){
  ottd.authenticate("TestAdmin", "qwerty");
  ottd.send_update_frequency(libOpenttdAdmin.enums.UpdateTypes.CLIENT_INFO, libOpenttdAdmin.enums.UpdateFrequencies.AUTOMATIC);
  ottd.send_rcon("say hello");

});
ottd.on('welcome', function(data){
  console.log("Welcome: ", data);
});
ottd.on('error', function(err){
  console.log("Error: " + err) 
});
ottd.on('clientjoin', function(id){
  console.log("Client with id: ", id, " has joined the game.");
});
ottd.on('clientinfo', function(client){
  console.log("Info for client: ", client);
});
ottd.on('clientupdate', function(client){
  console.log("client updated: ", client);
});
ottd.on('clientquit', function(id){
  console.log("Client with id: ", id, " has left the game.");
});
ottd.on('clientquit', function(client){
  console.log("Client with id: ", client.id, " has had an error: ", client.err);
});