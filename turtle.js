(function() {
  "use strict";

  function createCanvasPen(canvas) {
    const ctx = canvas.getContext("2d"),
      width = canvas.width,
      height = canvas.height;

    let actualDrawing = ctx.createImageData(canvas.width, canvas.height);
    let dataURL;

    function restoreBackground() {
      ctx.putImageData(actualDrawing, 0, 0);
    }

    function saveBackground() {
      dataURL = canvas.toDataURL('image/png');
      actualDrawing = ctx.getImageData(0, 0, canvas.width, canvas.height);
    }

    function drawLine(x1, y1, x2, y2) {
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    function drawLinePermanent(x1, y1, x2, y2) {
      restoreBackground();
      drawLine(x1, y1, x2, y2);
      saveBackground();
    }

    function clear() {
      ctx.putImageData(ctx.createImageData(canvas.width, canvas.height), 0, 0);
      saveBackground();
    }
    
    function getDataURL() {
      return dataURL;
    }

    ctx.strokeStyle = "#47D794";
    ctx.lineWidth = 2;

    return Object.freeze({
      width: width,
      height: height,
      drawLine: drawLine,
      drawLinePermanent: drawLinePermanent,
      restoreBackground: restoreBackground,
      clear: clear,
      getDataURL
    });
  }

  function createTurtleGraphics(canvasPen, downloadLink) {
    const width = canvasPen.width,
      height = canvasPen.height;

    let point = {
        x: width / 2,
        y: height / 2
      },
      rotation = 90,
      is_up = false,
      is_shown = true;

    function radians(r) {
      return 2 * Math.PI * (r / 360);
    }

    function addAngle(currentRotation, angle) {
      let newRotation = currentRotation + (angle % 360);
      if (newRotation < 0) {
        return newRotation + 360;
      } else {
        return newRotation;
      }
    }

    function transform(point, rotation, distance) {
      return {
        x: point.x + Math.cos(radians(rotation)) * distance,
        y: point.y - Math.sin(radians(rotation)) * distance
      };
    }

    function drawTurtle(point) {
      canvasPen.restoreBackground();
      if (is_shown) {
        const TURTLE_SIZE = 5;
        const TURTLE_WING_SIZE = 11;
        const TURTLE_WING_ANGLE = 160;
        
        const pointA = transform(point, rotation, TURTLE_SIZE),
          pointB = transform(pointA, addAngle(rotation, -TURTLE_WING_ANGLE), TURTLE_WING_SIZE),
          pointC = transform(pointA, addAngle(rotation, TURTLE_WING_ANGLE), TURTLE_WING_SIZE);
        canvasPen.drawLine(pointA.x, pointA.y, pointB.x, pointB.y);
        canvasPen.drawLine(pointB.x, pointB.y, pointC.x, pointC.y);
        canvasPen.drawLine(pointC.x, pointC.y, pointA.x, pointA.y);
      }
    }

    function drawTo(newPoint) {
      if (!is_up) {
        canvasPen.drawLinePermanent(point.x, point.y, newPoint.x, newPoint.y);
      }
      point = newPoint;
    }

    function clearScreen() {
      canvasPen.clear();
      drawTurtle(point);
    }

    function penUp() {
      is_up = true;
    }

    function penDown() {
      is_up = false;
    }

    function showTurtle() {
      is_shown = true;
      drawTurtle(point);
    }

    function hideTurtle() {
      is_shown = false;
      drawTurtle(point);
    }
    
    function getNextPoint(point, rotation, distance, doWrap) {
      let stepDistance = distance;
      let drawToPoint = transform(point, rotation, distance);
      let newPoint = {};
      let hadToWrap = false;

      if (doWrap) {
        const maxX = canvasPen.width - 1,
              minX = 0,
              maxY = canvasPen.height - 1,
              minY = 0;
        if  (drawToPoint.x > maxX) {
          const cosRotation = Math.cos(radians(rotation));
          if (Math.abs(cosRotation) > 0.001) {
            stepDistance = Math.abs(maxX - point.x) / Math.abs(cosRotation);
            drawToPoint = transform(point, rotation, stepDistance);
            let wrapY = drawToPoint.y;
            // Wrap y-coordinate if needed
            while (wrapY > maxY) wrapY -= (maxY - minY + 1);
            while (wrapY < minY) wrapY += (maxY - minY + 1);
            newPoint = {
              y: wrapY,
              x: minX
            };
            hadToWrap = true;
          }
        }
        else if (drawToPoint.x < minX) {
          const cosRotation = Math.cos(radians(rotation));
          if (Math.abs(cosRotation) > 0.001) {
            stepDistance = Math.abs(minX - point.x) / Math.abs(cosRotation);
            drawToPoint = transform(point, rotation, stepDistance);
            let wrapY = drawToPoint.y;
            // Wrap y-coordinate if needed
            while (wrapY > maxY) wrapY -= (maxY - minY + 1);
            while (wrapY < minY) wrapY += (maxY - minY + 1);
            newPoint = {
              y: wrapY,
              x: maxX
            };
            hadToWrap = true;
          }
        }
        else if (drawToPoint.y > maxY) {
          const sinRotation = Math.sin(radians(rotation));
          if (Math.abs(sinRotation) > 0.001) {
            stepDistance = Math.abs(maxY - point.y) / Math.abs(sinRotation);
            drawToPoint = transform(point, rotation, stepDistance);
            let wrapX = drawToPoint.x;
            // Wrap x-coordinate if needed
            while (wrapX > maxX) wrapX -= (maxX - minX + 1);
            while (wrapX < minX) wrapX += (maxX - minX + 1);
            newPoint = {
              x: wrapX,
              y: minY
            };
            hadToWrap = true;
          }
        }
        else if (drawToPoint.y < minY) {
          const sinRotation = Math.sin(radians(rotation));
          if (Math.abs(sinRotation) > 0.001) {
            stepDistance = Math.abs(minY - point.y) / Math.abs(sinRotation);
            drawToPoint = transform(point, rotation, stepDistance);
            let wrapX = drawToPoint.x;
            // Wrap x-coordinate if needed
            while (wrapX > maxX) wrapX -= (maxX - minX + 1);
            while (wrapX < minX) wrapX += (maxX - minX + 1);
            newPoint = {
              x: wrapX,
              y: maxY
            };
            hadToWrap = true;
          }
        }
        
      }
      
      return Object.freeze({
        distanceTraveled: stepDistance,
        drawTo: drawToPoint,
        wrap: hadToWrap,
        goTo: newPoint
      });
    }
    
    
    function forward(distance, offset) {
      if (!offset) {
        offset = 0;
      }
      let distanceLeft = distance;
      let iterations = 0;
      const maxIterations = 1000; // Prevent infinite loops
      
      while (distanceLeft > 0.1 && iterations < maxIterations) {
        const nextStep = getNextPoint(point, rotation + (offset), distanceLeft, true);
        drawTo(nextStep.drawTo);
        if (nextStep.wrap) {
          point = nextStep.goTo;
        }
        distanceLeft = distanceLeft - nextStep.distanceTraveled;
        iterations++;
        
        // Safety check for infinite loops
        if (nextStep.distanceTraveled <= 0) {
          break;
        }
      }
      drawTurtle(point);
    }

    function backward(distance) {
      forward(distance, 180);
    }

    function left(angle) {
      rotation = addAngle(rotation, angle);
      drawTurtle(point);
    }

    function right(angle) {
      left(angle * -1);
    }

    drawTurtle(point);
    
    return function(command) {
      switch (command.kind) {
        case "clearScreen":
          clearScreen();
          break;
        case "penDown":
          penDown();
          break;
        case "penUp":
          penUp();
          break;
        case "showTurtle":
          showTurtle();
          break;
        case "hideTurtle":
          hideTurtle();
          break;
        case "forward":
          forward(command.distance);
          break;
        case "backward":
          backward(command.distance);
          break;
        case "left":
          left(command.angle);
          break;
        case "right":
          right(command.angle);
          break;
        default:
          return false;
      }
      
      downloadLink.href = canvasPen.getDataURL();
      downloadLink.download = "tryturtle.png";
      
      return true;
    };
  }

  function createEnvironment() {
    function errorMessage(message) {
      return Object.freeze({
        kind: "error",
        message: message
      });
    }

    function done() {
      return Object.freeze({
        kind: "done"
      });
    }

    function createError(message) {
      let hasReturned = false;

      return function() {
        if (hasReturned) {
          return done();
        } else {
          hasReturned = true;
          return errorMessage(message);
        }
      };
    }

    function createNoArgs(name) {
      return function() {
        let hasReturned = false;

        return function() {
          if (hasReturned) {
            return done();
          } else {
            hasReturned = true;
            return Object.freeze({
              kind: name
            });
          }
        };
      };
    }

    function createIntArg(name, intArgName) {
      return function(parsedStructure) {
        let hasReturned = false;
        return function() {
          if (hasReturned) {
            return done();
          } else {
            hasReturned = true;
            if (parsedStructure.args.length !== 1) {
              return errorMessage("Missing Arguments.");
            } else {
              let returnValue = {
                kind: name
              };
              returnValue[intArgName] = parseInt(parsedStructure.args[0], 10);
              return Object.freeze(returnValue);
            }
          }
        };
      };
    }

    function block(childCommands, blockRepetitions, literals) {
      let times = blockRepetitions,
        blockLineLength = childCommands.length,
        blockLine = 0,
        blockLineInitialized = false,
        executer;

      return function() {
        if (times > 0) {
          if (!blockLineInitialized) {
            blockLineInitialized = true;
            executer = createExecuter(childCommands[blockLine], literals);
          }
          let result = executer();
          if (result.kind === "done") {
            blockLine = blockLine + 1;
            if (blockLine > blockLineLength - 1) {
              blockLine = 0;
              times = times - 1;
            }
            executer = createExecuter(childCommands[blockLine], literals);
            result = executer();
          }
          return result;
        } else {
          return done();
        }
      };
    }

    function repeatBlock(parsedStructure, literals) {
      if (parsedStructure.args.length !== 1) {
        return createError("Missing Arguments.");
      } else {
        return block(
          parsedStructure.childCommands,
          parseInt(parsedStructure.args[0], 10),
          literals
        );
      }
    }

    function toBlock(parsedStructure) {
      if (parsedStructure.args.length < 1) {
        return createError("Missing Arguments.");
      } else {
        bindings[parsedStructure.args[0]] = function(
          innerStructure,
          innerLiterals
        ) {
          if (innerStructure.args.length !== parsedStructure.args.length - 1) {
            return createError("Missing Arguments.");
          }
          innerLiterals = innerLiterals || {};
          for (let i = 1; i < parsedStructure.args.length; i += 1) {
            innerLiterals[parsedStructure.args[i]] = innerStructure.args[i - 1];
          }
          return block(parsedStructure.childCommands, 1, innerLiterals);
        };
        return function() {
          return done();
        };
      }
    }

    let bindings = {
      CLEARSCREEN: createNoArgs("clearScreen"),
      PENUP: createNoArgs("penUp"),
      PENDOWN: createNoArgs("penDown"),
      SHOWTURTLE: createNoArgs("showTurtle"),
      HIDETURTLE: createNoArgs("hideTurtle"),
      FORWARD: createIntArg("forward", "distance"),
      BACK: createIntArg("backward", "distance"),
      LEFT: createIntArg("left", "angle"),
      RIGHT: createIntArg("right", "angle"),
      REPEAT: repeatBlock,
      TO: toBlock,
      ERROR: function(parsedStructure) {
        return createError(parsedStructure.args[0] || "Unknown error");
      }
    };

    function evalLiterals(parsedStructure, literals) {
      let newStructure = Object.assign({}, parsedStructure);

      if (literals !== undefined && literals !== null) {
        newStructure.args = parsedStructure.args.map(function(arg) {
          if (!literals.hasOwnProperty(arg)) {
            return arg;
          } else {
            return literals[arg];
          }
        });
      }

      return newStructure;
    }

    function createExecuter(parsedStructure, literals) {
      if (bindings.hasOwnProperty(parsedStructure.commandName)) {
        return bindings[parsedStructure.commandName](
          evalLiterals(parsedStructure, literals),
          literals
        );
      } else {
        return createError("Unknown command: " + parsedStructure.commandName);
      }
    }

    return Object.freeze({
      createExecuter: createExecuter
    });
  }


  function envExec(executer, report, turtleGraphics) {
    setTimeout(function() {
      if (cancelFlag === true) {
        cancelFlag = false;
        report("Cancelled.");
      } else {
        let result = executer();

        if (typeof result.kind == "undefined" || result.kind == "unknown") {
          report("Unknown Command");
        } else if (result.kind == "done") {
          report("");
        } else if (result.kind == "error") {
          report(result.message);
        } else {
          turtleGraphics(result);
          envExec(executer, report, turtleGraphics);
        }
      }
    }, execWait);
  }

  let turtleGraphics = createTurtleGraphics(
      createCanvasPen(document.getElementById("turtle")),
      document.getElementById("download")
    ),
    cancelFlag = false,
    execWait = 1,
    env = createEnvironment(),
    controller = $("#console").console({
      promptLabel: "? ",
      continuedPromptLabel: "    ",
      continuedPrompt: false,
      cancelHandle: function() {
        cancelFlag = true;
      },
      commandHandle: function(line, report) {
        let parsedLine = tgnParse(line);
        if (
          (controller.continuedPrompt === false ||
            controller.continuedPrompt === undefined) &&
          parsedLine.isBlockCommand
        ) {
          controller.continuedPrompt = true;
          return;
        }

        if (controller.continuedPrompt === true) {
          const lines = line.split(/\n/);
          if (lines[lines.length - 1].trim().length !== 0) {
            return;
          }

          controller.continuedPrompt = false;
        }
        let executer = env.createExecuter(parsedLine);
        envExec(executer, report, turtleGraphics);
      },
      autofocus: true,
      animateScroll: true,
      promptHistory: true,
      welcomeMessage: "" 
    });
})();
