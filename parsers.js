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

/*

  This file contains all the parsing functions, to keep it out of the way of the main code

*/
var put  = require('put')

var zeroterm = (function(){
    var b = put().word8(0).buffer()
    return function() { return b }
}());

module.exports.protocol = function(binaryparser, cb){
  binaryparser.into("protocol", function(){
    this
    .word8("version")
    .tap(function(vars){
      cb(vars);
    });
  }); 
};
module.exports.welcome = function(binaryparser, cb){
  binaryparser.into("welcome", function(){
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
      .tap(function(vars){
        cb(vars);
      });
  });
};

module.exports.date = function(binaryparser, cb){
  binaryparser.into("date", function(){
    this
      .word32le('date')
      .tap(function(vars){
        cb(vars.date);
      });

  });
};

module.exports.clientjoin = function(binaryparser, cb){
  binaryparser.into("clientjoin", function(){
    this
      .word32le('id')
      .tap(function(vars){
        cb(vars.id);
      });
  });
};

module.exports.clientinfo = function(binaryparser, cb){
  binaryparser.into("clientinfo", function(){
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
        cb(client);
      });
  });
};

module.exports.clientupdate = function(binaryparser, cb){
  binaryparser.into("clientupdate", function(){
    this
      .word32le('id')
      .scan('name', zeroterm())
      .tap(function(vars){ vars.name = vars.name.toString();})
      .word8('company')
      .tap(function(client){
        cb(client);
      });

  });
};

module.exports.clientquit = function(binaryparser, cb){
  binaryparser.into("client", function(){
    this
      .word32le('id')
      .tap(function(client){
        cb(client);
      });
  });
};

module.exports.clienterror = function(binaryparser, cb){
  binaryparser.into("client", function(){
    this
      .word32le('id')
      .word8('err')

      .tap(function(client){
        cb(client);
      });
  });
};
module.exports.companyinfo = function(binaryparser, cb){
  binaryparser.into("company", function(){

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
        cb(company)
      });
  });
};

module.exports.companyupdate = function(binaryparser, cb){
  binaryparser.into("company", function(){
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
        cb(company);
      });
  });
};

module.exports.companyremove = function(binaryparser, cb){
  binaryparser.into("company", function(){
    this
      .word8('id')
      .word8('reason')
      .tap(function(company){
        cb(company);
      });
  });
};
module.exports.companyeconomy = function(binaryparser, cb){
  binaryparser.into("company", function(){
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
      })
      .tap(function(company){
        cb(company);
      });
  });
};

module.exports.companystats = function(binaryparser, cb){
  binaryparser.into("company", function(){
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
        cb(company);
      });
  });
};

module.exports.chat = function(binaryparser, cb){
  binaryparser.into("chat", function(){
    this
      .word8('action')
      .word8('desttype')
      .word32le('id')
      .scan('message', zeroterm())
      .tap(function(vars){ vars.message = vars.message.toString();})
      .word64le('money')
      .tap(function(message){
        cb(message);
      });
  });
};

module.exports.rcon = function(binaryparser, cb){

  binaryparser.into('rcon', function(){
    this
      .word16('colour')
      .scan('output', zeroterm())
      .tap(function(vars){ vars.output = vars.output.toString();})
      .tap(function(rcon){
        cb(rcon);
      });

  });
};

module.exports.rcon = function(binaryparser, cb){
  binaryparser.into('console', function(){
    this
      .scan('origin', zeroterm())
      .tap(function(vars){ vars.origin = vars.origin.toString();})
      .scan('output', zeroterm())
      .tap(function(vars){ vars.output = vars.output.toString();})
      .tap(function(rcon){
        cb(console);
      });
  });
};



















