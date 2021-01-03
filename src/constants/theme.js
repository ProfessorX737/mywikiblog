const mainStyles = {
  spacing: (x) => `${x * 8}px`,
  borderRadius: '5px',
};

const lightTheme = {
  ...mainStyles,
  textBackgroundColor: 'white',
  textColor: 'black',
  unfocusedTextColor: 'rgba(0, 0, 0, 0.54)',
  unfocusedSmallTextColor: 'rgba(0, 0, 0, 0.75)',
  unfocusedBackgroundColor: '#00000030',
  unfocusedBorderColor: 'rgba(0, 0, 0, 0.4)',
  unfocusedInputBorderColor: 'rgba(0, 0, 0, 0.23)',
  focusedBorderColor: '#da2e76',
  focusedColor: '#da2e76',
  headerBackground: 'white',
  //formBackground: 'linear-gradient(45deg, #b86813 0%,#b83f13 25%,#c4102b 50%,#c5115c 75%,#bb1185 100%)',
  formBackground: '#272727ff',
  errorColor: '#f44336',
  dashboardBackground: '#f2f2f2',
  buttonBorderColor: '#222222',
  buttonFillColor: 'white',
  primaryButtonFillColor: '#c31163',
  secondaryButtonFillColor: '#ed4956',
  maxFeedWidth: '800px',
};

const darkTheme = {
  ...mainStyles,
  textBackgroundColor: 'black',
  textColor: 'white',
  unfocusedTextColor: 'grey',
  focusedBorderColor: 'white',
  unfocusedInputBorderColor: 'grey',
};

export default lightTheme;
