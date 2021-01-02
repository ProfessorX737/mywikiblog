import React, { PureComponent } from "react";
import PropTypes from "prop-types";
import SyntaxHighlighter from "react-syntax-highlighter";
import { vs2015 } from "react-syntax-highlighter/dist/cjs/styles/hljs";

//https://medium.com/young-developer/react-markdown-code-and-syntax-highlighting-632d2f9b4ada

export default class CodeBlock extends PureComponent {
  static propTypes = {
    value: PropTypes.string.isRequired,
    language: PropTypes.string
  };

  static defaultProps = {
    value: ""
  };

  render() {
    let { language, value } = this.props;
    let style = vs2015;
    if (language === "text") {
      style = undefined;
    }
    return (
      <SyntaxHighlighter language={language} style={style}>
        {value}
      </SyntaxHighlighter>
    );
  }
}
