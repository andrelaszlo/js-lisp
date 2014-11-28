# JS-LISP

[![Build status](https://travis-ci.org/andrelaszlo/js-lisp.svg)](https://travis-ci.org/andrelaszlo/js-lisp/)

Toy lisp-like language in javascript.

Interactive mode:

    js-lisp> ['+', 1, 2, 3]
    6

## GETTING STARTED

Run interactively:

    $ node js-lisp.js

Run tests:

    $ cd js-lisp
    $ npm install
    $ ./node_modules/.bin/nodeunit

## TODO

Some ideas for hacking:

* let
* lambdas
* car, cdr and friends
* defun
* quote/unquote
* some fun operators
* exceptions
* macros
* Everything else...

## Notes

* The idea to use javascript, not only to parse a lisp, but also to represent
  it is probably not a very good one - but it might be fun.
* I have a feeling that mixing the two languages can be both powerful and
  confusing.

## Open questions

* Javascript might not give us a lot of freedom when it comes to syntax, so far
  we have hijacked the arrays for lists and strings for symbols. How, then, do
  we represent strings, for example?
* Also, the power of the cons is lost. The arrays are mutable and pretending
  that arrays are linked lists is kind of silly. On the other hand, writing
      ['+', 1, 2]
  is much nicer than something like
      new Cons(new Add(), new Cons(1,new Cons(2, new Nil()))).
  Both could be valid JS, though.
* Could variable names be used as symbols somehow? Or should we escape strings
  or symbols using some funny notation like s("x")?