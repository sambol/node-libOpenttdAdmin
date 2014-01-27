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

var Buffers = require('buffers')
, binary  = require('binary')
, put  = require('put')
, net     = require('net')
, tcp_enum= require('./enums')
, adminPackets = tcp_enum.AdminPackets
, EventEmitter = require('events').EventEmitter
;

var connection  = function (){
  return this;
};

connection.prototype = new EventEmitter;

connection.prototype.sock = false;
connection.prototype.buffer = Buffers();
connection.prototype.binaryStreamer = binary()


connection.prototype.connect = function(server, port){
  var self = this;
  if (self.sock){
    return callback("Already connected", null);
  }
  self.sock = net.createConnection(port, server);
  self.sock.on("connect", function(){
    self.emit("connect");
    self.sock.on("data", function(buf){
      // console.log("data", buf.toString());
      binary.parse(buf)
        .word16le('pcktlen')
        .word8('pckttype')
        .tap(function(vars){
          switch(vars.pckttype){
            case adminPackets.SERVER_PROTOCOL:
            this
              .word8("version")
              .word8("datafollowing")
              .tap(function(vars){
                self.emit("authenticate", vars);
              });
            break;
            case adminPackets.SERVER_WELCOME:
              this.into("welcomeData", function(){
                this
                  .scan('name', zeroterm())
                  .tap(function(vars){ vars.name = vars.name.toString();})
                  .scan('version', zeroterm())
                  .tap(function(vars){ vars.version = vars.version.toString();})
                  .word8('dedicated')
                  .into("map", function(vars){
                    this
                      .scan('name', zeroterm())
                      .tap(function(vars){ vars.name = vars.name.toString();})
                      .word32le('seed')
                      .word8('landscape')
                      .word32le('startdate')
                      .word16le('mapheight')
                      .word16le('mapwidth')
                  })
                  .tap(function(welcomeData){
                    //User Does not need these
                    self.emit('welcome', welcomeData)
                  });
                });
            
              break;
            case adminPackets.SERVER_FULL:
              this.end();
              self.error("FULL");
            break;
            case adminPackets.SERVER_BANNED:
              this.end();
              self.error("BANNED");
            break;
            case adminPackets.SERVER_ERROR:
              this
                .word8('code')
                .tap(function(vars){
                  self.error(vars.code);
                });
              break;
            case adminPackets.SERVER_NEWGAME:
              self.emit('newgame');
              break;
            case adminPackets.SERVER_SHUTDOWN:
              self.emit('shutdown');
              break;
            case adminPackets.SERVER_DATE:
              this
                .word32le('date')
                .tap(function(vars){
                  self.emit('date', vars.date);
                });
              break;
            case adminPackets.SERVER_CLIENT_JOIN:
              this
                .word32le('id')
                .tap(function(vars){
                  self.emit('clientjoin', vars.id);
                });
              break;
            case adminPackets.SERVER_CLIENT_INFO:
              this
                .into('client', function(){
                  this
                  .word32le('id')
                  .scan('ip', zeroterm())
                  .tap(function(vars){ vars.ip = vars.ip.toString();})
                  .scan('name', zeroterm())
                  .tap(function(vars){ vars.name = vars.name.toString();})
                  .word8('lang')
                  .word32le('joindate')
                  .word8('company')
                  .tap(function(client){
                    self.emit('clientinfo', client);
                  });
                });
              break;
            case adminPackets.SERVER_CLIENT_UPDATE:
              this.into("client", function(vars){
                this
                  .word32le('id')
                  .scan('name', zeroterm())
                  .tap(function(vars){ vars.name = vars.name.toString();})
                  .word8('company')
                  .tap(function(client){
                    self.emit('clientupdate', client);
                  });
              });
              break;
            case adminPackets.SERVER_CLIENT_QUIT:
              this.into("client", function(vars){
                this
                  .word32le('id')
                  .tap(function(client){
                    self.emit('clientquit', client.id);
                  });
              });
              break;
            case adminPackets.SERVER_CLIENT_ERROR:
              this.into("client", function(vars){
                this
                  .word32le('id')
                  .word8('err')
                  .tap(function(client){
                    self.emit('clienterror', client);
                  });
              });
              break;
          }
        });
    });
  });
}; 
connection.prototype.authenticate = function(user, password){
  var self = this;

  var bufs = Buffers();
  bufs.push(Buffer(password));                    //server password
  bufs.push(zeroterm());
  bufs.push(Buffer(user?user:"node-libOpenttdAdmin"));  //admin name
  bufs.push(zeroterm());
  bufs.push(Buffer("0"));                         //version 
  bufs.push(zeroterm());
  self.sendpacket(adminPackets.ADMIN_JOIN, bufs);

};
connection.prototype.sendpacket = function(t, p){
  var self = this;
    put().word16le(p ? p.length + 3 : 3).word8(t).write(self.sock)
    if(p) self.sock.write(p.toBuffer())
}
connection.prototype.send_rcon = function(cmd){
  var self = this;
  var bufs = Buffers();
  bufs.push(Buffer(cmd));
  bufs.push(zeroterm());
  self.sendpacket(adminPackets.ADMIN_RCON, bufs);
}
connection.prototype.error = function(errorMsg){
  console.log("ERROR: ", errorMsg);
  self.emit('error', errorMsg);
};

connection.prototype.send_update_frequency = function(type, frequency){
  var self = this;
  var bufs = Buffers();
  bufs.push(put()
    .word16le(type)
    .word16le(frequency)
    .buffer());
  self.sendpacket(adminPackets.ADMIN_UPDATE_FREQUENCY, bufs);
  
};


var zeroterm = (function(){
    var b = put().word8(0).buffer()
    return function() { return b }
}());

module.exports = {
  connection: connection,
  enums: tcp_enum,
}