/*

{
options = {
    ...options,
    variables: {
      rate: 1.25,
    },
    procs: {
      "CLEARSCREEN": "clearScreen",
      "PENUP": "penUp",
      "PENDOWN": "penDown",
      "SHOWTURTLE": "showTurtle",
      "HIDETURTLE": "hideTurtle",
      "FORWARD": "forward",
      "BACK": "backward",
      "LEFT": "left",
      "RIGHT": "right",
    },
  };
}

STATEMENT 
 = DEFINE_PROC / 
   DEFINE_VAR /
   DEFINE_LOOP /
   COMMAND

DEFINE_PROC
 = _ PROC_DEF_ val1:IDENTIFIER val2:PARAM_ARRAY EOF { return { "name": "TO", "procname":val1, "parameters": val2 }; } /
 _ PROC_DEF_ EOF { return { "name": "TO", "procname":undefined, "parameters": [] }; }

PARAM_ARRAY
  = values:(
      head:IDENTIFIER
      tail:(v:IDENTIFIER { return v; })*
      { return [head].concat(tail); }
    )?
    EOF
    { return values !== null ? values : []; }

DEFINE_VAR 
 = _ val1:IDENTIFIER ARROW_ val2:EXPR EOF { return { "name": "assign", "varname":val1, "varvalue": val2 }; } 

DEFINE_LOOP
 = _ LOOP_DEF_ val:EXPR EOF { return { "name": "REPEAT", "val": val }; } /
 _ LOOP_DEF_ EOF { return { "name": "REPEAT", "val": undefined }; }

COMMAND
  = _ val1:PROC val2:ARG_ARRAY EOF { return { "name": val1, "arguments": val2 }; } 
  
ARG_ARRAY
  = values:(
      head:EXPR
      tail:(COMMA_ v:EXPR { return v; })*
      { return [head].concat(tail); }
    )?
    EOF
    { return values !== null ? values : []; }

EXPR 
= val1:EXP_PD rest:((PLUS_/MINUS_) EXP_PD)* {
    return rest.reduce(
        (acc, element) =>
            element[0][0] === "+" ? acc + element[1] : acc - element[1],
        val1
    );
  }

EXP_PD
  = val1:EXP_X  rest:((MULT_/DIV_) EXP_X)*  {
    return rest.reduce(
        (acc, element) =>
            element[0][0] === "*" ? acc * element[1] : acc / element[1],
        val1
    );
  }

EXP_X
  = 
    val1:VALUE CARET_ val2:EXP_X  { return val1 ** val2; }
  / val1:VALUE { return val1; }


VALUE
  =  LPAREN_ val1:EXPR RPAREN_ { return val1; }

  / val1:NUMBER { return val1; }
  / val1:VARIABLE { return val1; }

NUMBER
  = digits:(DIGIT+ DOT DIGIT+) _ { return Number(digits.flat().join("")); }
  / digits:DIGIT+ _ { return Number(digits.join("")); }

VARIABLE
  = char1:LETTER chars:(LETTER / DIGIT)* _  {
    const varName = char1 + chars.join("");
    return options.variables[varName];
  }
  
IDENTIFIER
  = char1:LETTER chars:(LETTER / DIGIT)* _  {
    return char1 + chars.join("");
  }

PROC
  = char1:LETTER chars:(LETTER / DIGIT)* _  {
    const name = char1 + chars.join("");
    return options.procs[name];
  }

PROC_DEF_   = "TO" _
LOOP_DEF_   = "REPEAT" _

ARROW_   = "<-" _
CARET_  = "^" _
COMMA_  = "," _
DIGIT   = [0-9]
DIV_    = "/" _
DOT     = "."
LETTER  = [A-Z_]
LPAREN_ = "(" _
MINUS_  = "-" _
MULT_   = "*" _
NE_     = "<>" _
PLUS_   = "+" _
RPAREN_ = ")" _
_       = [ \t\n\r]*
EOF     = !.

*/


  function parse(textCommand) {
    let [command, ...childCommands] = textCommand
        .toUpperCase()
        .trim()
        .split(/\n/),
      [commandName, ...args] = command.trim().split(" "),
      isBlockCommand = name =>
        name.trim().indexOf("TO") === 0 || name.trim().indexOf("REPEAT") === 0;

    if (childCommands.length > 0) {
      let newChildCommands = [],
        isBlock = false,
        newChildCommand = "";
      for (let i = 0; i < childCommands.length; i += 1) {
        newChildCommand += childCommands[i] + "\n";

        if (isBlockCommand(childCommands[i])) {
          isBlock = true;
        }

        if (i === childCommands.length - 1 || !isBlock) {
          newChildCommands.push(newChildCommand);
          newChildCommand = "";
        }
      }
      childCommands = newChildCommands.map(childCommand => parse(childCommand));
    } else {
      childCommands = [];
    }

    return {
      commandName: commandName,
      args: args,
      childCommands: childCommands,
      isBlockCommand: isBlockCommand(commandName)
    };
  }

var tgnParse = (function(textCommand, variables) {
    
  const options = {
    variables: variables,
    procs: {
      "CLEARSCREEN": "CLEARSCREEN",
      "PENUP": "PENUP",
      "PENDOWN": "PENDOWN",
      "SHOWTURTLE": "SHOWTURTLE",
      "HIDETURTLE": "HIDETURTLE",
      "FORWARD": "FORWARD",
      "BACK": "BACK",
      "LEFT": "LEFT",
      "RIGHT": "RIGHT",
    },
  };
  let [command, ...childCommands] = textCommand
      .toUpperCase()
      .trim()
      .split(/\n/);
 const
    result = myparser.parse(command, options),
    isBlockCommand = name =>
        name.trim().indexOf("TO") === 0 || name.trim().indexOf("REPEAT") === 0;
console.log("parsed:");
  console.log(result);

  if (childCommands.length > 0) {
      let newChildCommands = [],
        isBlock = false,
        newChildCommand = "";
      for (let i = 0; i < childCommands.length; i += 1) {
        newChildCommand += childCommands[i] + "\n";

        if (isBlockCommand(childCommands[i])) {
          isBlock = true;
        }

        if (i === childCommands.length - 1 || !isBlock) {
            newChildCommands.push(newChildCommand);
          newChildCommand = "";
        }
      }
      childCommands = newChildCommands.map(childCommand => tgnParse(childCommand));
    } else {
      childCommands = [];
    }
  
  return {
    commandName: result.name,
    args: result.arguments == undefined ? [ result.val] : result.arguments,
    childCommands: childCommands,
    isBlockCommand: isBlockCommand(result.name)
  };
});

var myparser = /*
 * Generated by PEG.js 0.10.0.
 *
 * http://pegjs.org/
 */
(function() {
  "use strict";

  function peg$subclass(child, parent) {
    function ctor() { this.constructor = child; }
    ctor.prototype = parent.prototype;
    child.prototype = new ctor();
  }

  function peg$SyntaxError(message, expected, found, location) {
    this.message  = message;
    this.expected = expected;
    this.found    = found;
    this.location = location;
    this.name     = "SyntaxError";

    if (typeof Error.captureStackTrace === "function") {
      Error.captureStackTrace(this, peg$SyntaxError);
    }
  }

  peg$subclass(peg$SyntaxError, Error);

  peg$SyntaxError.buildMessage = function(expected, found) {
    var DESCRIBE_EXPECTATION_FNS = {
          literal: function(expectation) {
            return "\"" + literalEscape(expectation.text) + "\"";
          },

          "class": function(expectation) {
            var escapedParts = "",
                i;

            for (i = 0; i < expectation.parts.length; i++) {
              escapedParts += expectation.parts[i] instanceof Array
                ? classEscape(expectation.parts[i][0]) + "-" + classEscape(expectation.parts[i][1])
                : classEscape(expectation.parts[i]);
            }

            return "[" + (expectation.inverted ? "^" : "") + escapedParts + "]";
          },

          any: function(expectation) {
            return "any character";
          },

          end: function(expectation) {
            return "end of input";
          },

          other: function(expectation) {
            return expectation.description;
          }
        };

    function hex(ch) {
      return ch.charCodeAt(0).toString(16).toUpperCase();
    }

    function literalEscape(s) {
      return s
        .replace(/\\/g, '\\\\')
        .replace(/"/g,  '\\"')
        .replace(/\0/g, '\\0')
        .replace(/\t/g, '\\t')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/[\x00-\x0F]/g,          function(ch) { return '\\x0' + hex(ch); })
        .replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) { return '\\x'  + hex(ch); });
    }

    function classEscape(s) {
      return s
        .replace(/\\/g, '\\\\')
        .replace(/\]/g, '\\]')
        .replace(/\^/g, '\\^')
        .replace(/-/g,  '\\-')
        .replace(/\0/g, '\\0')
        .replace(/\t/g, '\\t')
        .replace(/\n/g, '\\n')
        .replace(/\r/g, '\\r')
        .replace(/[\x00-\x0F]/g,          function(ch) { return '\\x0' + hex(ch); })
        .replace(/[\x10-\x1F\x7F-\x9F]/g, function(ch) { return '\\x'  + hex(ch); });
    }

    function describeExpectation(expectation) {
      return DESCRIBE_EXPECTATION_FNS[expectation.type](expectation);
    }

    function describeExpected(expected) {
      var descriptions = new Array(expected.length),
          i, j;

      for (i = 0; i < expected.length; i++) {
        descriptions[i] = describeExpectation(expected[i]);
      }

      descriptions.sort();

      if (descriptions.length > 0) {
        for (i = 1, j = 1; i < descriptions.length; i++) {
          if (descriptions[i - 1] !== descriptions[i]) {
            descriptions[j] = descriptions[i];
            j++;
          }
        }
        descriptions.length = j;
      }

      switch (descriptions.length) {
        case 1:
          return descriptions[0];

        case 2:
          return descriptions[0] + " or " + descriptions[1];

        default:
          return descriptions.slice(0, -1).join(", ")
            + ", or "
            + descriptions[descriptions.length - 1];
      }
    }

    function describeFound(found) {
      return found ? "\"" + literalEscape(found) + "\"" : "end of input";
    }

    return "Expected " + describeExpected(expected) + " but " + describeFound(found) + " found.";
  };

  function peg$parse(input, options) {
    options = options !== void 0 ? options : {};

    var peg$FAILED = {},

        peg$startRuleFunctions = { STATEMENT: peg$parseSTATEMENT },
        peg$startRuleFunction  = peg$parseSTATEMENT,

        peg$c0 = function(val1, val2) { return { "name": "TO", "procname":val1, "parameters": val2 }; },
        peg$c1 = function() { return { "name": "TO", "procname":undefined, "parameters": [] }; },
        peg$c2 = function(head, v) { return v; },
        peg$c3 = function(head, tail) { return [head].concat(tail); },
        peg$c4 = function(values) { return values !== null ? values : []; },
        peg$c5 = function(val1, val2) { return { "name": "assign", "varname":val1, "varvalue": val2 }; },
        peg$c6 = function(val) { return { "name": "REPEAT", "val": val }; },
        peg$c7 = function() { return { "name": "REPEAT", "val": undefined }; },
        peg$c8 = function(val1, val2) { return { "name": val1, "arguments": val2 }; },
        peg$c9 = function(val1, rest) {
            return rest.reduce(
                (acc, element) =>
                    element[0][0] === "+" ? acc + element[1] : acc - element[1],
                val1
            );
          },
        peg$c10 = function(val1, rest) {
            return rest.reduce(
                (acc, element) =>
                    element[0][0] === "*" ? acc * element[1] : acc / element[1],
                val1
            );
          },
        peg$c11 = function(val1, val2) { return val1 ** val2; },
        peg$c12 = function(val1) { return val1; },
        peg$c13 = function(digits) { return Number(digits.flat().join("")); },
        peg$c14 = function(digits) { return Number(digits.join("")); },
        peg$c15 = function(char1, chars) {
            const varName = char1 + chars.join("");
            return options.variables[varName];
          },
        peg$c16 = function(char1, chars) {
            return char1 + chars.join("");
          },
        peg$c17 = function(char1, chars) {
            const name = char1 + chars.join("");
            return options.procs[name];
          },
        peg$c18 = "TO",
        peg$c19 = peg$literalExpectation("TO", false),
        peg$c20 = "REPEAT",
        peg$c21 = peg$literalExpectation("REPEAT", false),
        peg$c22 = "<-",
        peg$c23 = peg$literalExpectation("<-", false),
        peg$c24 = "^",
        peg$c25 = peg$literalExpectation("^", false),
        peg$c26 = ",",
        peg$c27 = peg$literalExpectation(",", false),
        peg$c28 = /^[0-9]/,
        peg$c29 = peg$classExpectation([["0", "9"]], false, false),
        peg$c30 = "/",
        peg$c31 = peg$literalExpectation("/", false),
        peg$c32 = ".",
        peg$c33 = peg$literalExpectation(".", false),
        peg$c34 = /^[A-Z_]/,
        peg$c35 = peg$classExpectation([["A", "Z"], "_"], false, false),
        peg$c36 = "(",
        peg$c37 = peg$literalExpectation("(", false),
        peg$c38 = "-",
        peg$c39 = peg$literalExpectation("-", false),
        peg$c40 = "*",
        peg$c41 = peg$literalExpectation("*", false),
        peg$c42 = "<>",
        peg$c43 = peg$literalExpectation("<>", false),
        peg$c44 = "+",
        peg$c45 = peg$literalExpectation("+", false),
        peg$c46 = ")",
        peg$c47 = peg$literalExpectation(")", false),
        peg$c48 = /^[ \t\n\r]/,
        peg$c49 = peg$classExpectation([" ", "\t", "\n", "\r"], false, false),
        peg$c50 = peg$anyExpectation(),

        peg$currPos          = 0,
        peg$savedPos         = 0,
        peg$posDetailsCache  = [{ line: 1, column: 1 }],
        peg$maxFailPos       = 0,
        peg$maxFailExpected  = [],
        peg$silentFails      = 0,

        peg$result;

    if ("startRule" in options) {
      if (!(options.startRule in peg$startRuleFunctions)) {
        throw new Error("Can't start parsing from rule \"" + options.startRule + "\".");
      }

      peg$startRuleFunction = peg$startRuleFunctions[options.startRule];
    }

    function text() {
      return input.substring(peg$savedPos, peg$currPos);
    }

    function location() {
      return peg$computeLocation(peg$savedPos, peg$currPos);
    }

    function expected(description, location) {
      location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos)

      throw peg$buildStructuredError(
        [peg$otherExpectation(description)],
        input.substring(peg$savedPos, peg$currPos),
        location
      );
    }

    function error(message, location) {
      location = location !== void 0 ? location : peg$computeLocation(peg$savedPos, peg$currPos)

      throw peg$buildSimpleError(message, location);
    }

    function peg$literalExpectation(text, ignoreCase) {
      return { type: "literal", text: text, ignoreCase: ignoreCase };
    }

    function peg$classExpectation(parts, inverted, ignoreCase) {
      return { type: "class", parts: parts, inverted: inverted, ignoreCase: ignoreCase };
    }

    function peg$anyExpectation() {
      return { type: "any" };
    }

    function peg$endExpectation() {
      return { type: "end" };
    }

    function peg$otherExpectation(description) {
      return { type: "other", description: description };
    }

    function peg$computePosDetails(pos) {
      var details = peg$posDetailsCache[pos], p;

      if (details) {
        return details;
      } else {
        p = pos - 1;
        while (!peg$posDetailsCache[p]) {
          p--;
        }

        details = peg$posDetailsCache[p];
        details = {
          line:   details.line,
          column: details.column
        };

        while (p < pos) {
          if (input.charCodeAt(p) === 10) {
            details.line++;
            details.column = 1;
          } else {
            details.column++;
          }

          p++;
        }

        peg$posDetailsCache[pos] = details;
        return details;
      }
    }

    function peg$computeLocation(startPos, endPos) {
      var startPosDetails = peg$computePosDetails(startPos),
          endPosDetails   = peg$computePosDetails(endPos);

      return {
        start: {
          offset: startPos,
          line:   startPosDetails.line,
          column: startPosDetails.column
        },
        end: {
          offset: endPos,
          line:   endPosDetails.line,
          column: endPosDetails.column
        }
      };
    }

    function peg$fail(expected) {
      if (peg$currPos < peg$maxFailPos) { return; }

      if (peg$currPos > peg$maxFailPos) {
        peg$maxFailPos = peg$currPos;
        peg$maxFailExpected = [];
      }

      peg$maxFailExpected.push(expected);
    }

    function peg$buildSimpleError(message, location) {
      return new peg$SyntaxError(message, null, null, location);
    }

    function peg$buildStructuredError(expected, found, location) {
      return new peg$SyntaxError(
        peg$SyntaxError.buildMessage(expected, found),
        expected,
        found,
        location
      );
    }

    function peg$parseSTATEMENT() {
      var s0;

      s0 = peg$parseDEFINE_PROC();
      if (s0 === peg$FAILED) {
        s0 = peg$parseDEFINE_VAR();
        if (s0 === peg$FAILED) {
          s0 = peg$parseDEFINE_LOOP();
          if (s0 === peg$FAILED) {
            s0 = peg$parseCOMMAND();
          }
        }
      }

      return s0;
    }

    function peg$parseDEFINE_PROC() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$parse_();
      if (s1 !== peg$FAILED) {
        s2 = peg$parsePROC_DEF_();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseIDENTIFIER();
          if (s3 !== peg$FAILED) {
            s4 = peg$parsePARAM_ARRAY();
            if (s4 !== peg$FAILED) {
              s5 = peg$parseEOF();
              if (s5 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c0(s3, s4);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parse_();
        if (s1 !== peg$FAILED) {
          s2 = peg$parsePROC_DEF_();
          if (s2 !== peg$FAILED) {
            s3 = peg$parseEOF();
            if (s3 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c1();
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      }

      return s0;
    }

    function peg$parsePARAM_ARRAY() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$currPos;
      s2 = peg$parseIDENTIFIER();
      if (s2 !== peg$FAILED) {
        s3 = [];
        s4 = peg$currPos;
        s5 = peg$parseIDENTIFIER();
        if (s5 !== peg$FAILED) {
          peg$savedPos = s4;
          s5 = peg$c2(s2, s5);
        }
        s4 = s5;
        while (s4 !== peg$FAILED) {
          s3.push(s4);
          s4 = peg$currPos;
          s5 = peg$parseIDENTIFIER();
          if (s5 !== peg$FAILED) {
            peg$savedPos = s4;
            s5 = peg$c2(s2, s5);
          }
          s4 = s5;
        }
        if (s3 !== peg$FAILED) {
          peg$savedPos = s1;
          s2 = peg$c3(s2, s3);
          s1 = s2;
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
      if (s1 === peg$FAILED) {
        s1 = null;
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseEOF();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c4(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseDEFINE_VAR() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$parse_();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseIDENTIFIER();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseARROW_();
          if (s3 !== peg$FAILED) {
            s4 = peg$parseEXPR();
            if (s4 !== peg$FAILED) {
              s5 = peg$parseEOF();
              if (s5 !== peg$FAILED) {
                peg$savedPos = s0;
                s1 = peg$c5(s2, s4);
                s0 = s1;
              } else {
                peg$currPos = s0;
                s0 = peg$FAILED;
              }
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseDEFINE_LOOP() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = peg$parse_();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseLOOP_DEF_();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseEXPR();
          if (s3 !== peg$FAILED) {
            s4 = peg$parseEOF();
            if (s4 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c6(s3);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parse_();
        if (s1 !== peg$FAILED) {
          s2 = peg$parseLOOP_DEF_();
          if (s2 !== peg$FAILED) {
            s3 = peg$parseEOF();
            if (s3 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c7();
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      }

      return s0;
    }

    function peg$parseCOMMAND() {
      var s0, s1, s2, s3, s4;

      s0 = peg$currPos;
      s1 = peg$parse_();
      if (s1 !== peg$FAILED) {
        s2 = peg$parsePROC();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseARG_ARRAY();
          if (s3 !== peg$FAILED) {
            s4 = peg$parseEOF();
            if (s4 !== peg$FAILED) {
              peg$savedPos = s0;
              s1 = peg$c8(s2, s3);
              s0 = s1;
            } else {
              peg$currPos = s0;
              s0 = peg$FAILED;
            }
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseARG_ARRAY() {
      var s0, s1, s2, s3, s4, s5, s6;

      s0 = peg$currPos;
      s1 = peg$currPos;
      s2 = peg$parseEXPR();
      if (s2 !== peg$FAILED) {
        s3 = [];
        s4 = peg$currPos;
        s5 = peg$parseCOMMA_();
        if (s5 !== peg$FAILED) {
          s6 = peg$parseEXPR();
          if (s6 !== peg$FAILED) {
            peg$savedPos = s4;
            s5 = peg$c2(s2, s6);
            s4 = s5;
          } else {
            peg$currPos = s4;
            s4 = peg$FAILED;
          }
        } else {
          peg$currPos = s4;
          s4 = peg$FAILED;
        }
        while (s4 !== peg$FAILED) {
          s3.push(s4);
          s4 = peg$currPos;
          s5 = peg$parseCOMMA_();
          if (s5 !== peg$FAILED) {
            s6 = peg$parseEXPR();
            if (s6 !== peg$FAILED) {
              peg$savedPos = s4;
              s5 = peg$c2(s2, s6);
              s4 = s5;
            } else {
              peg$currPos = s4;
              s4 = peg$FAILED;
            }
          } else {
            peg$currPos = s4;
            s4 = peg$FAILED;
          }
        }
        if (s3 !== peg$FAILED) {
          peg$savedPos = s1;
          s2 = peg$c3(s2, s3);
          s1 = s2;
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
      if (s1 === peg$FAILED) {
        s1 = null;
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parseEOF();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c4(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseEXPR() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$parseEXP_PD();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parsePLUS_();
        if (s4 === peg$FAILED) {
          s4 = peg$parseMINUS_();
        }
        if (s4 !== peg$FAILED) {
          s5 = peg$parseEXP_PD();
          if (s5 !== peg$FAILED) {
            s4 = [s4, s5];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parsePLUS_();
          if (s4 === peg$FAILED) {
            s4 = peg$parseMINUS_();
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parseEXP_PD();
            if (s5 !== peg$FAILED) {
              s4 = [s4, s5];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c9(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseEXP_PD() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$parseEXP_X();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$currPos;
        s4 = peg$parseMULT_();
        if (s4 === peg$FAILED) {
          s4 = peg$parseDIV_();
        }
        if (s4 !== peg$FAILED) {
          s5 = peg$parseEXP_X();
          if (s5 !== peg$FAILED) {
            s4 = [s4, s5];
            s3 = s4;
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        } else {
          peg$currPos = s3;
          s3 = peg$FAILED;
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$currPos;
          s4 = peg$parseMULT_();
          if (s4 === peg$FAILED) {
            s4 = peg$parseDIV_();
          }
          if (s4 !== peg$FAILED) {
            s5 = peg$parseEXP_X();
            if (s5 !== peg$FAILED) {
              s4 = [s4, s5];
              s3 = s4;
            } else {
              peg$currPos = s3;
              s3 = peg$FAILED;
            }
          } else {
            peg$currPos = s3;
            s3 = peg$FAILED;
          }
        }
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c10(s1, s2);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseEXP_X() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parseVALUE();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseCARET_();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseEXP_X();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c11(s1, s3);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parseVALUE();
        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c12(s1);
        }
        s0 = s1;
      }

      return s0;
    }

    function peg$parseVALUE() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parseLPAREN_();
      if (s1 !== peg$FAILED) {
        s2 = peg$parseEXPR();
        if (s2 !== peg$FAILED) {
          s3 = peg$parseRPAREN_();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c12(s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = peg$parseNUMBER();
        if (s1 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c12(s1);
        }
        s0 = s1;
        if (s0 === peg$FAILED) {
          s0 = peg$currPos;
          s1 = peg$parseVARIABLE();
          if (s1 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c12(s1);
          }
          s0 = s1;
        }
      }

      return s0;
    }

    function peg$parseNUMBER() {
      var s0, s1, s2, s3, s4, s5;

      s0 = peg$currPos;
      s1 = peg$currPos;
      s2 = [];
      s3 = peg$parseDIGIT();
      if (s3 !== peg$FAILED) {
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parseDIGIT();
        }
      } else {
        s2 = peg$FAILED;
      }
      if (s2 !== peg$FAILED) {
        s3 = peg$parseDOT();
        if (s3 !== peg$FAILED) {
          s4 = [];
          s5 = peg$parseDIGIT();
          if (s5 !== peg$FAILED) {
            while (s5 !== peg$FAILED) {
              s4.push(s5);
              s5 = peg$parseDIGIT();
            }
          } else {
            s4 = peg$FAILED;
          }
          if (s4 !== peg$FAILED) {
            s2 = [s2, s3, s4];
            s1 = s2;
          } else {
            peg$currPos = s1;
            s1 = peg$FAILED;
          }
        } else {
          peg$currPos = s1;
          s1 = peg$FAILED;
        }
      } else {
        peg$currPos = s1;
        s1 = peg$FAILED;
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          peg$savedPos = s0;
          s1 = peg$c13(s1);
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }
      if (s0 === peg$FAILED) {
        s0 = peg$currPos;
        s1 = [];
        s2 = peg$parseDIGIT();
        if (s2 !== peg$FAILED) {
          while (s2 !== peg$FAILED) {
            s1.push(s2);
            s2 = peg$parseDIGIT();
          }
        } else {
          s1 = peg$FAILED;
        }
        if (s1 !== peg$FAILED) {
          s2 = peg$parse_();
          if (s2 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c14(s1);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      }

      return s0;
    }

    function peg$parseVARIABLE() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parseLETTER();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parseLETTER();
        if (s3 === peg$FAILED) {
          s3 = peg$parseDIGIT();
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parseLETTER();
          if (s3 === peg$FAILED) {
            s3 = peg$parseDIGIT();
          }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parse_();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c15(s1, s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseIDENTIFIER() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parseLETTER();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parseLETTER();
        if (s3 === peg$FAILED) {
          s3 = peg$parseDIGIT();
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parseLETTER();
          if (s3 === peg$FAILED) {
            s3 = peg$parseDIGIT();
          }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parse_();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c16(s1, s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsePROC() {
      var s0, s1, s2, s3;

      s0 = peg$currPos;
      s1 = peg$parseLETTER();
      if (s1 !== peg$FAILED) {
        s2 = [];
        s3 = peg$parseLETTER();
        if (s3 === peg$FAILED) {
          s3 = peg$parseDIGIT();
        }
        while (s3 !== peg$FAILED) {
          s2.push(s3);
          s3 = peg$parseLETTER();
          if (s3 === peg$FAILED) {
            s3 = peg$parseDIGIT();
          }
        }
        if (s2 !== peg$FAILED) {
          s3 = peg$parse_();
          if (s3 !== peg$FAILED) {
            peg$savedPos = s0;
            s1 = peg$c17(s1, s2);
            s0 = s1;
          } else {
            peg$currPos = s0;
            s0 = peg$FAILED;
          }
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsePROC_DEF_() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c18) {
        s1 = peg$c18;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c19); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseLOOP_DEF_() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 6) === peg$c20) {
        s1 = peg$c20;
        peg$currPos += 6;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c21); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseARROW_() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c22) {
        s1 = peg$c22;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c23); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseCARET_() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 94) {
        s1 = peg$c24;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c25); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseCOMMA_() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 44) {
        s1 = peg$c26;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c27); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseDIGIT() {
      var s0;

      if (peg$c28.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c29); }
      }

      return s0;
    }

    function peg$parseDIV_() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 47) {
        s1 = peg$c30;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c31); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseDOT() {
      var s0;

      if (input.charCodeAt(peg$currPos) === 46) {
        s0 = peg$c32;
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c33); }
      }

      return s0;
    }

    function peg$parseLETTER() {
      var s0;

      if (peg$c34.test(input.charAt(peg$currPos))) {
        s0 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s0 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c35); }
      }

      return s0;
    }

    function peg$parseLPAREN_() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 40) {
        s1 = peg$c36;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c37); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseMINUS_() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 45) {
        s1 = peg$c38;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c39); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseMULT_() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 42) {
        s1 = peg$c40;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c41); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseNE_() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.substr(peg$currPos, 2) === peg$c42) {
        s1 = peg$c42;
        peg$currPos += 2;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c43); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parsePLUS_() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 43) {
        s1 = peg$c44;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c45); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parseRPAREN_() {
      var s0, s1, s2;

      s0 = peg$currPos;
      if (input.charCodeAt(peg$currPos) === 41) {
        s1 = peg$c46;
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c47); }
      }
      if (s1 !== peg$FAILED) {
        s2 = peg$parse_();
        if (s2 !== peg$FAILED) {
          s1 = [s1, s2];
          s0 = s1;
        } else {
          peg$currPos = s0;
          s0 = peg$FAILED;
        }
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }

    function peg$parse_() {
      var s0, s1;

      s0 = [];
      if (peg$c48.test(input.charAt(peg$currPos))) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c49); }
      }
      while (s1 !== peg$FAILED) {
        s0.push(s1);
        if (peg$c48.test(input.charAt(peg$currPos))) {
          s1 = input.charAt(peg$currPos);
          peg$currPos++;
        } else {
          s1 = peg$FAILED;
          if (peg$silentFails === 0) { peg$fail(peg$c49); }
        }
      }

      return s0;
    }

    function peg$parseEOF() {
      var s0, s1;

      s0 = peg$currPos;
      peg$silentFails++;
      if (input.length > peg$currPos) {
        s1 = input.charAt(peg$currPos);
        peg$currPos++;
      } else {
        s1 = peg$FAILED;
        if (peg$silentFails === 0) { peg$fail(peg$c50); }
      }
      peg$silentFails--;
      if (s1 === peg$FAILED) {
        s0 = void 0;
      } else {
        peg$currPos = s0;
        s0 = peg$FAILED;
      }

      return s0;
    }


    peg$result = peg$startRuleFunction();

    if (peg$result !== peg$FAILED && peg$currPos === input.length) {
      return peg$result;
    } else {
      if (peg$result !== peg$FAILED && peg$currPos < input.length) {
        peg$fail(peg$endExpectation());
      }

      throw peg$buildStructuredError(
        peg$maxFailExpected,
        peg$maxFailPos < input.length ? input.charAt(peg$maxFailPos) : null,
        peg$maxFailPos < input.length
          ? peg$computeLocation(peg$maxFailPos, peg$maxFailPos + 1)
          : peg$computeLocation(peg$maxFailPos, peg$maxFailPos)
      );
    }
  }

  return {
    SyntaxError: peg$SyntaxError,
    parse:       peg$parse
  };
})();
