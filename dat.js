function doublearray(alphabet) {
  this.alphabet = alphabet;

  this.base = [1];
  this.check = [0];
  this.end = [];
  this.position = 1;
}

doublearray.prototype.contains = function (word) {
  var chars = word.split(''),
      parent = 1,
      child = null;

  for (var i = 0; i < chars.length; i += 1) {
    child = this.getBase(parent) + this.getCharCode(chars[i]);

    if (this.getCheck(child) !== parent) {
      return false;
    }

    if (this.getBase(child) < 0) {
      break;
    }
    else{
      parent = child;
      continue;
    }
  }
  return false;
};


doublearray.prototype.getEndString = function (position) {
  var result = [];

  for (var i = position - 1; i < this.end.length; i += 1) {
    result.push(this.end[i]);

    if (this.end[i] === '#') {
      break;
    }
  }
  return result;
};

doublearray.prototype.endEquals = function (start, chars, position) {
  for (var i = start - 1, k = 0; i < this.end.length; i += 1, k += 1) {
    if (this.end[i] !== chars[position + k]) {
      return false;
    }

    if (this.end[i] === '#') {
      break;
    }
  }
  return true;
};

doublearray.prototype.x_check = function (list) {
  var q = 1;

  while (true) {
    var found = false;

    for (var c = 0; c < list.length; c += 1) {
      if (this.getCheck(q + list[c])) {
        found = true;
        break;
      }
    }

    if (!found) {
      break;
    }
    q += 1;
  }
  return q;
};

doublearray.prototype.writeEnd = function (str, position, start) {
  for (var i = start + 1, k = 0; i < str.length; i += 1, k += 1) {
    this.end[position - 1 + k] = str[i];

    if (str[i] === '#') {
      break;
    }
  }

  if (position + k + 1 > this.position) {
    this.position = position + k + 1;
  }
};

doublearray.prototype.findArcs = function (parent) {
  var result = [];

  for (var c in this.alphabet) {
    if (this.getCheck(this.getBase(parent) + this.getCharCode(c)) === parent) {
      result.push(this.getCharCode(c));
    }
  }
  return result;
};

doublearray.prototype.relocateBase = function (parent, child, chars, i) {
  var temp_node1 = parent,
      temp_node2 = null,
      listA = this.findArcs(parent),
      listB = this.findArcs(this.getCheck(child)),

      node = listA.length + 1 < listB.length ? parent : this.getCheck(child),
      list = listA.length + 1 < listB.length ? listA : listB;

  var temp_base = this.getBase(node);

  this.setBase(node, this.x_check(list));

  for (var j = 0; j < list.length; j += 1) {
    temp_node1 = temp_base + list[j];
    temp_node2 = this.getBase(node) + list[j];

    this.setBase(temp_node2, this.getBase(temp_node1));
    this.setCheck(temp_node2, node);

    if (this.getBase(temp_node1) > 0) {
      var w = 1;

      for (; w < this.check.length; w += 1) {
        if (this.getCheck(this.getBase(temp_node1) + w) === temp_node1) {
          this.setCheck(this.getBase(temp_node1) + w, temp_node2);
        }

      }

    }

  }

  if(temp_node1 !== parent ) {
        temp_node2 = parent;
  }

  this.setBase(temp_node1, 0);
  this.setCheck(temp_node1, 0);

  var temp_node = this.getBase(temp_node2) + this.getCharCode(chars[i]);
  this.setBase(temp_node, -this.position);
  this.setCheck(temp_node, temp_node2);
  this.writeEnd(chars, this.position, i);
};

doublearray.prototype.insert = function (word) {
  var chars = word.split(''),
      parent = 1,
      child = null;

  for (var i = 0; i < chars.length; i += 1) {
    child = this.getBase(parent) + this.getCharCode(chars[i]);

    if (this.getCheck(child) !== parent) {
      if (this.getCheck(child) !== 0) {
        this.relocateBase(parent, child, chars, i);
      } else {
        this.setBase(child, -this.position);
        this.setCheck(child, parent);
        this.writeEnd(chars, this.position, i);
      }
      return;
    }

    if (this.getBase(child) < 0) {
      break;
    }

    parent = child;
  }

  if (chars[i] === '#' || this.endEquals(-this.getBase(child), chars, i + 1)) {
    return;
  }

  if (this.getBase(child) !== 0) {
    this.insertEnd(child, -this.getBase(child), chars, i + 1);
  }
};

doublearray.prototype.getBase = function (position) {
  return this.base[position - 1] || 0;
};

doublearray.prototype.getCheck = function (position) {
  return this.check[position - 1] || 0;
};

doublearray.prototype.setBase = function (position, value) {
  this.base[position - 1] = value;
};

doublearray.prototype.setCheck = function (position, value) {
  this.check[position - 1] = value;
};

doublearray.prototype.getCharCode = function (c) {
  if (!this.alphabet.hasOwnProperty(c)) {
    throw new Error('Character "' + c + '" is not in the alphabet.');
  }
  return this.alphabet[c];
};

doublearray.prototype.insertEnd = function (parent, endPos, chars, i) {
  var tempBase = -this.getBase(parent);

  for (var j = endPos - 1, k = 0; j < this.end.length; j += 1, k += 1) {
    var endChar = this.getCharCode(this.end[j]),
        wordChar = this.getCharCode(chars[i + k]);

    if (endChar === wordChar) {
      this.setBase(parent, this.x_check([endChar]));
      this.setCheck(this.getBase(parent) + endChar, parent);
      parent = this.getBase(parent) + endChar;
    } else {
      this.setBase(parent, this.x_check([endChar, wordChar]));

      var q = this.getBase(parent) + endChar;
      this.setBase(q, -tempBase);
      this.setCheck(q, parent);
      this.writeEnd(this.end, tempBase, j);

      var q = this.getBase(parent) + wordChar;
      this.setBase(q, -this.position);
      this.setCheck(q, parent);
      this.writeEnd(chars, this.position, ((i + j > chars.length) ? i + k : i + j));
      break;
    }

    if (this.end[j] === '#') {
      break;
    }
  }
};

doublearray.prototype.delete = function (word) {
  var chars = word.split(''),
      parent = 1,
      child = null;

  for (var i = 0; i < chars.length; i += 1) {
    child = this.getBase(parent) + this.getCharCode(chars[i]);

    if (this.getBase(child) < 0) {
      break;
    }
    parent = child;
  }

  if (chars[i] === '#' || this.endEquals(-this.getBase(child), chars, i + 1)) {
    this.setBase(child, 0);
    this.setCheck(child, 0);
  }
};

doublearray.prototype.toString = function () {
  return JSON.stringify({
    base: this.base,
    check: this.check,
    end: this.end,
    position: this.position
  }, null, 2);
};

module.exports = doublearray;