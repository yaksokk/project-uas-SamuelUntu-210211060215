const colors = {
    grey: (opacity = 1) => `rgba(136, 138, 164, ${opacity})`,
    blue: (opacity = 1) => `rgba(0, 50, 225, ${opacity})`,
    white: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
    black: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    red: (opacity = 1) => `rgba(225, 15, 15, ${opacity})`,
    darkModeBlack: (opacity = 1) => `rgba(27, 27, 27, ${opacity})`,
    darkModeBlue: (opacity = 1) => `rgba(146, 156, 241, ${opacity})`,
}
export default colors