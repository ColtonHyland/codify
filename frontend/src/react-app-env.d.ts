declare module 'react-json-tree' {
  import * as React from 'react';

  interface JSONTreeProps {
    data: any;
    theme?: any;
    invertTheme?: boolean;
  }

  export class JSONTree extends React.Component<JSONTreeProps, any> {}
}
