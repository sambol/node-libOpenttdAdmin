var libOpenttdAdmin = require("../main"),
  ottdConnection =  new libOpenttdAdmin.connection();
  
ottdConnection.connect("myServer", 3977);

ottdConnection.on('connect', function(){
  ottdConnection.authenticate("MyBot", "MyPass");
});
ottdConnection.on('welcome', function(data){
  ottdConnection.send_rcon("say \"hello world\"");
  ottdConnection.close();
});
