# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Try Turtle is a web-based turtle graphics interpreter that teaches Turtle Geometry through a retro-styled console interface. Users can enter Logo-like commands to control a virtual turtle that draws on an HTML canvas.

## Architecture

The application consists of three main components:

### Core Components
- **`index.html`**: Main application interface with ASCII art header, console, and canvas display
- **`turtle.js`**: Core turtle graphics engine that manages:
  - Canvas pen operations and drawing state
  - Turtle position, rotation, and visibility
  - Command execution (movement, rotation, pen control)
  - Graphics rendering and download functionality
- **`parser.js`**: PEG.js-generated parser that converts Logo commands into executable JavaScript
- **`jquery.console.js`**: Console interface library providing command-line interaction

### Supporting Files
- **`help.html`**: Complete command reference documentation
- **`turtle-graphics-notation.html`**: Educational content about turtle graphics
- **`colophon.html`**: Technical implementation details
- **`turtle.css`**: Retro styling for the interface
- **`text-style.css`**: Typography styles for documentation pages

## Turtle Graphics Commands

The interpreter supports these Logo-style commands:
- **Movement**: `FORWARD [distance]`, `BACK [distance]`
- **Rotation**: `LEFT [degrees]`, `RIGHT [degrees]`
- **Pen Control**: `PENUP`, `PENDOWN`
- **Display**: `CLEARSCREEN`, `SHOWTURTLE`, `HIDETURTLE`
- **Control Flow**: `REPEAT [number]` (for loops)
- **Variables**: `[variable] ← [value]` (assignment syntax)
- **Procedures**: `TO [name] [params]` (planned feature, not fully implemented)

## Development

This is a static website with no build process required. To work with the project:

1. **Local Development**: Open `index.html` in a web browser or serve the directory with any HTTP server
2. **Testing Commands**: Use the console interface to test turtle graphics commands
3. **Parser Modifications**: The `parser.js` file is generated from a PEG.js grammar - look for grammar definitions in comments

## Key Technical Details

- Canvas size is fixed at 280x200 pixels
- Turtle starts at canvas center (140, 100) facing up (90 degrees)
- Drawing uses green stroke color (#47D794) with 2px line width
- Parser supports nested command structures for REPEAT loops
- Download functionality captures canvas as PNG image
- Console history and command completion provided by jquery.console.js

## File Dependencies

- jQuery Console requires proper initialization with the turtle graphics controller
- Parser and turtle engine are tightly coupled through command name mapping
- CSS files provide the distinctive retro terminal aesthetic
- Help documentation should be updated when adding new commands

## Recent Fixes

- Fixed procedure execution system (TO/TRI commands now work correctly)
- Fixed REPEAT block nesting in parser to properly group child commands
- Fixed screen wrapping logic with proper boundary detection (canvas coordinates are 0-based)
- Fixed download button clickable area with proper z-index layering
- Unified styling across all documentation pages to match main app aesthetics
- Added division by zero protection for cardinal direction movements
- Corrected spelling and grammar issues in documentation

## Future TODOs

### Parser Enhancements
- [ ] Add support for indentation-based nested REPEAT blocks (to enable flower pattern and complex nested structures)
- [ ] Implement keyboard shortcut or command for changing indentation levels
- [ ] Add support for nested procedure definitions within procedures

### Command Extensions
- [ ] Add color commands (SETCOLOR, PENCOLOR)
- [ ] Add pen width commands (PENWIDTH)
- [ ] Add geometric shapes (CIRCLE, ARC, POLYGON)
- [ ] Add conditional commands (IF, WHILE)
- [ ] Add variable operations beyond basic assignment

### User Experience
- [ ] Add command autocomplete in console
- [ ] Add syntax highlighting for multi-line procedure definitions
- [ ] Add save/load functionality for turtle programs
- [ ] Add animation speed control
- [ ] Add step-by-step execution mode for debugging

### Technical Improvements
- [ ] Optimize canvas performance for complex drawings
- [ ] Add proper error recovery for partially entered commands
- [ ] Improve memory management for large programs
- [ ] Add comprehensive test suite