# DAT.js

This library implements a Double Array Trie (DAT) System in JavaScript. A Double-Array Trie is a structure designed to make the size compact while maintaining fast access with algorithms for retrieval. Read more about it [here](http://ieeexplore.ieee.org/document/31365/).

Designed as a library to support my DAT-AC algorithm, this library naturally provides support for the aho-corasick algorithm, but keeps the more traditionally linked list trie when building the double array trie. 

##Instructions
####Node.js
```javascript
var doublearray = require('datjs');

var data = new doublearray(
{
    'redundant': 1,
    'rambunctious': 2,
    'pies': 3,
    'puncture': 4,
    'whistle': 5
 });
```
####Bower.js
```javascript
var data = new doublearray(
{
    'redundant': 1,
    'rambunctious': 2,
    'pies': 3,
    'puncture': 4,
    'whistle': 5
 });
```
####With Source
```javascript
var doublearray = require('./dat.js');
var data = new doublearray(
{
    'redundant': 1,
    'rambunctious': 2,
    'pies': 3,
    'puncture': 4,
    'whistle': 5
 });
```
##Usage
####Insert Data
```javascript
data.insert('apples');
data.insert('dudes');
```
####Query Data
```javascript
trie.contains('redundant);
trie.contains('eggs');
```
####Delete Data
```javascript
trie.delete('rambunctious);
trie.delete('pies');
```