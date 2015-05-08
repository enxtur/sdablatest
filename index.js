var request = require('request')
var fs = require('fs')
  // request('http://cdn.dota2.com/apps/570/scripts/items/items_game.fb311cfe4e79e2627fe16baef4b04557735f17dc.txt', function(err, res, body) {
  //   console.log(parse(body))
  //
  // })

fs.readFile(__dirname + '/items_game.txt', function(err, res, str) {
  var string = res.toString('utf-8').replace(/\n/g, "").replace(/\t/g, "")
  var object = parse(string)
  fs.writeFile(__dirname + '/items_game.json', JSON.stringify(object), function(err) {
    if (err) return console.log(err);
    console.log("The file was saved!");
  });
})

function parse(string) {
  var current = new CurrentObject()
  var root = {}
  current.push(root)
  var started = false
  var text = ''
  var key = null
  for (var i = 0; i < string.length; i++) {
    var char = string[i]
    if (char == '"') {
      if (started) {
        if (key) {
          current.peek()[key] = text
          key = null
        } else {
          key = text
        }
        started = false
        text = ''
      } else {
        started = true
      }
    } else if (char == '{') {
      current.peek()[key] = {}
      current.push(current.peek()[key])
      key = null
    } else if (char == '}') {
      current.pop()
    } else {
      text += char
    }
  }
  return root
}

function CurrentObject() {
  this.stack = []
  this.push = function(item) {
    this.stack.push(item)
  }
  this.pop = function() {
    return this.stack.pop()
  }
  this.peek = function() {
    if (this.stack.length)
      return this.stack[this.stack.length - 1]
    return null
  }
}
