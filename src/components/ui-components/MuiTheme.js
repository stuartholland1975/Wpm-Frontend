import { createMuiTheme } from "@material-ui/core/styles";


export const theme = createMuiTheme({
  palette: {
    primary: {
      // light: will be calculated from palette.primary.main,
      main: "#366363",
      // dark: will be calculated from palette.primary.main,
      // contrastText: will be calculated to contrast with palette.primary.main
    },
    secondary: {
      
      main: "hsl(0, 0%, 25%)",
      // dark: will be calculated from palette.secondary.main,
     
    },
    
  },
});