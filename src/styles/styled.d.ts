import 'styled-components'

declare module 'styled-components' {
  interface ColorsTheme {
    primary: string;
    secundary: string;
    background: string;
    text: string;
  }

  export interface DefaultTheme {
    title: string,
    colors: ColorsTheme
  }
}