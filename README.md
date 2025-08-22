# Try Turtle 🐢

[![Live Demo](https://img.shields.io/badge/demo-live-brightgreen)](https://www.tryturtle.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**[🚀 Try it live at www.tryturtle.org](https://www.tryturtle.org/)**

A retro-styled web-based turtle graphics interpreter that teaches programming concepts through Logo-like commands. Draw on a virtual canvas by controlling a turtle with simple, intuitive commands in a nostalgic terminal-style interface.

![Try Turtle Screenshot](https://img.shields.io/badge/screenshot-coming_soon-blue)

## ✨ Features

- **Interactive Console**: Retro terminal interface with command history and completion
- **Logo-Style Commands**: Classic turtle graphics programming with `FORWARD`, `LEFT`, `RIGHT`, `REPEAT`, etc.
- **Visual Feedback**: Watch your turtle draw in real-time on a 280×200 pixel canvas
- **Screen Wrapping**: Turtle seamlessly wraps around screen edges
- **Download Drawings**: Save your creations as PNG images
- **Educational**: Perfect for learning programming concepts and turtle geometry
- **No Installation**: Runs entirely in your web browser

## 🎮 Quick Start

Visit **[www.tryturtle.org](https://www.tryturtle.org/)** and try drawing a triangle:

```logo
REPEAT 3
  FORWARD 50
  LEFT 120
```

Press Enter twice to execute!

## 📚 Commands Reference

| Command | Description | Example |
|---------|-------------|---------|
| `FORWARD [distance]` | Move turtle forward | `FORWARD 50` |
| `BACK [distance]` | Move turtle backward | `BACK 30` |
| `LEFT [degrees]` | Turn turtle left | `LEFT 90` |
| `RIGHT [degrees]` | Turn turtle right | `RIGHT 45` |
| `REPEAT [number]` | Repeat commands | `REPEAT 4` |
| `PENUP` | Lift pen (don't draw) | `PENUP` |
| `PENDOWN` | Put pen down (draw) | `PENDOWN` |
| `CLEARSCREEN` | Clear the canvas | `CLEARSCREEN` |
| `SHOWTURTLE` | Show turtle indicator | `SHOWTURTLE` |
| `HIDETURTLE` | Hide turtle indicator | `HIDETURTLE` |

## 🏗️ Architecture

Try Turtle is built with a minimalist "JavaScript: The Good Parts" philosophy:

- **`turtle.js`**: Core turtle graphics engine with canvas operations
- **`parser.js`**: PEG.js-generated parser for Logo commands  
- **`jquery.console.js`**: Terminal-style console interface
- **`turtle.css`**: Retro VT323 monospace styling
- **Static HTML**: No build process required

## 🚀 Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/mattreed555/try-turtle.git
   cd try-turtle
   ```

2. **Serve locally** (any HTTP server works)
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   
   # Node.js
   npx serve
   
   # PHP
   php -S localhost:8000
   ```

3. **Open in browser**
   ```
   http://localhost:8000
   ```

## 🎨 Example Programs

### Square
```logo
REPEAT 4
  FORWARD 60
  LEFT 90
```

### Spiral
```logo
REPEAT 36
  FORWARD 100
  LEFT 91
```

### Flower Pattern
```logo
REPEAT 8
  REPEAT 6
    FORWARD 40
    LEFT 60
  LEFT 45
```

## 🤝 Contributing

Contributions are welcome! This project maintains a minimalist coding style inspired by "JavaScript: The Good Parts."

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes following the existing code style
4. Test your changes locally
5. Commit with descriptive messages
6. Push and create a Pull Request

## 🎓 Educational Background

Try Turtle is inspired by:
- [**Turtle Geometry**](https://en.wikipedia.org/wiki/Turtle_Geometry) by Hal Abelson and Andrea diSessa
- [**Mindstorms**](https://en.wikipedia.org/wiki/Mindstorms_(book)) by Seymour Papert
- The Logo programming language and turtle graphics tradition
- Classic Apple IIe computing experiences

## 🛠️ Technical Details

- **Canvas Size**: 280×200 pixels
- **Coordinate System**: Origin at center (140, 100), Y-axis inverted
- **Starting Position**: Center, facing up (90°)
- **Colors**: Retro green (#47D794) on dark background (#282828)
- **Fonts**: VT323 monospace for authentic terminal feel
- **Browser Support**: Modern browsers with HTML5 Canvas support

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Acknowledgments

- **Libraries Used**: jQuery, jquery-console, PEG.js
- **Fonts**: VT323 by Peter Hull (Google Fonts)
- **ASCII Art**: ANSI Shadow font from patorjk.com
- **Inspiration**: The Logo/turtle graphics community

---

**[🐢 Start drawing at www.tryturtle.org](https://www.tryturtle.org/)**

*Made with ❤️ for learning programming through turtle graphics*