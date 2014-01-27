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
            case adminPackets.SERVER_COMPANY_INFO:
              this.into("company", function(vars){

                this
                  .word8('id')
                  .scan('name', zeroterm())
                  .tap(function(vars){ vars.name = vars.name.toString();})
                  .scan('manager', zeroterm())
                  .tap(function(vars){ vars.manager = vars.manager.toString();})
                  .word8('colour')
                  .word8('protected')
                  .word32le('startyear')
                  .word8('isai')
                  .tap(function(company){
                    self.emit('companyinfo', company)
                  });
              });
              break;
            case adminPackets.SERVER_COMPANY_UPDATE:
              this.into("company", function(vars){
                this
                  .word8('id')
                  .scan('name', zeroterm())
                  .tap(function(vars){ vars.name = vars.name.toString();})
                  .scan('manager', zeroterm())
                  .tap(function(vars){ vars.manager = vars.manager.toString();})
                  .word8('colour')
                  .word8('protected')
                  .word8('bankruptcy')
                  .into('shares', function(){
                    this
                      .word8('1')
                      .word8('2')
                      .word8('3')
                      .word8('4')
                  })
                  .tap(function(company){
                    self.emit('companyupdate', company);
                  });
              });
              break;
            case adminPackets.SERVER_COMPANY_REMOVE:
              this.into("company", function(vars){
                this
                  .word8('id')
                  .word8('reason')
                  .tap(function(company){
                    self.emit('companyremove', company);
                  });
              break;

            case adminPackets.SERVER_COMPANY_ECONOMY:
              this.into("company", function(vars){
                this
                  .word8('id')
                  .word64les('money')
                  .word64le('loan')
                  .word64les('income')
                  .into('lastquarter', function(){
                    this
                      .word64le('value')
                      .word64le('performance')
                      .word64le('cargo')
                  })
                  .into('prevquarter', function(){
                    this
                      .word64le('value')
                      .word64le('performance')
                      .word64le('cargo')
                  });
                  .tap(function(company){
                    self.emit('companyeconomy', company);
                  });
              });
              break;
            case adminPackets.SERVER_COMPANY_STATS:
              this.into("company", function(vars){

                this
                  .word8('id')
                  .into('vehicles', function(){
                    this
                      .word64le('trains')
                      .word64le('lorries')
                      .word64le('busses')
                      .word64le('planes')
                      .word64le('ships')
                  })
                  .into('stations', function(){
                    this
                      .word64le('trains')
                      .word64le('lorries')
                      .word64le('busses')
                      .word64le('planes')
                      .word64le('ships')
                  })
                  .tap(function(company){
                    self.emit('companystats', company);
                  });
              });
              break;
            case adminPackets.SERVER_CHAT:
              this.into('chat', function(){
                this
                  .word8('action')
                  .word8('desttype')
                  .word8('id')
                  .word32le('id')
                  .scan('message', zeroterm())
                  .tap(function(vars){ vars.message = vars.message.toString();})
                  .word64le('money')
                  .tap(function(message){
                    self.emit('chat', message);
                  });
              });
            
              break;
            case adminPackets.SERVER_RCON:
              this.into('rcon', function(){
                this
                  .word16('colour')
                  .scan('output', zeroterm())
                  .tap(function(vars){ vars.output = vars.output.toString();})
                  .tap(function(rcon){
                    self.emit('rcon', rcon);
                  });

              });
            
              break;
            
            case adminPackets.SERVER_CONSOLE:
              this.into('rcon', function(){
                this
                  .scan('origin', zeroterm())
                  .tap(function(vars){ vars.origin = vars.origin.toString();})
                  .scan('output', zeroterm())
                  .tap(function(vars){ vars.output = vars.output.toString();})
                  .tap(function(rcon){
                    self.emit('rcon', rcon);
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
};

connection.prototype.send_rcon = function(cmd){
  var self = this;
  var bufs = Buffers();
  bufs.push(Buffer(cmd));
  bufs.push(zeroterm());
  self.sendpacket(adminPackets.ADMIN_RCON, bufs);
};

connection.prototype.send_chat = function(action, desttype, id, msg){
  var self = this;
  var bufs = Buffers();
  bufs.push(put()
    .word8(action)
    .word8(desttype)
    .word32(id)
    .buffer());
  bufs.push(Buffer(msg));
  bufs.push(zeroterm());
  self.sendpacket(adminPackets.ADMIN_CHAT, bufs);
};

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
connection.prototype.send_poll = function(type, id){
  var self = this;
  var bufs = Buffers();
  bufs.push(put()
    .word8(type)
    .word32le(id)
    .buffer());
  self.sendpacket(adminPackets.ADMIN_POLL, bufs);

}
connection.prototype.close = function(){
  self.sendpacket(adminPackets.ADMIN_QUIT);
  this.sock.end();
};

var zeroterm = (function(){
    var b = put().word8(0).buffer()
    return function() { return b }
}());

module.exports = {
  connection: connection,
  enums: tcp_enum,
}