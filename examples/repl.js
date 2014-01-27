var repl = require("repl"),
libOpenttdAdmin = require("../main");

var ottd = new libOpenttdAdmin.connection();

ottd.connect("tinworkx.com", 3999)
ottd.on('connect', function(){
  ottd.authenticate("TestAdmin", "qwerty");
  console.log("Connected, awating welcome message");
});
ottd.on('welcome', function(data){
  console.log("Got Welcome message");
  repl.start({
    prompt: "openttd> ",
    input: process.stdin,
    output: process.stdout,
    terminal:true,
    eval: doCommand
    
  });
});

function doCommand(cmd, context, filename, callback){
  callback(null, "here")
}
setTimeout(function(){
  process.stdout.write("hello")
}, 5000);