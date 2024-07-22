declare module 'react-json-tree' {
  import * as React from 'react';

  interface JSONTreeProps {
    data: any;
    theme?: any;
    invertTheme?: boolean;
  }

  export default class JSONTree extends React.Component<JSONTreeProps, any> {}
}
