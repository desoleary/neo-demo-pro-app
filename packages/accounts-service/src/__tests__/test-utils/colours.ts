const colours = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',

  boldText: (text: string) => `${colours.bold}${text}${colours.reset}`,
  redText: (text: string) => `${colours.red}${text}${colours.reset}`,
  greenText: (text: string) => `${colours.green}${text}${colours.reset}`,
  yellowText: (text: string) => `${colours.yellow}${text}${colours.reset}`,
  blueText: (text: string) => `${colours.blue}${text}${colours.reset}`,
  magentaText: (text: string) => `${colours.magenta}${text}${colours.reset}`,
  cyanText: (text: string) => `${colours.cyan}${text}${colours.reset}`,
  whiteText: (text: string) => `${colours.white}${text}${colours.reset}`,
};

export default colours;