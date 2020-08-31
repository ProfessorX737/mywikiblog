import React from "react";
import ReactMarkdown from "react-markdown";
import MathJax from "./react-mathjax2";
import RemarkMathPlugin from "remark-math";
import PropTypes from "prop-types";
import htmlParser from "react-markdown/plugins/html-parser";
import CodeBlock from "./code-block.js";

class RenderMarkdown2 extends React.PureComponent {
  static propTypes = {
    style: PropTypes.object
  };

  render() {
    const newProps = {
      ...this.props,
      plugins: [RemarkMathPlugin, htmlParser],
      renderers: {
        ...this.props.renderers,
        math: props => <MathJax.Node>{props.value}</MathJax.Node>,
        inlineMath: props => <MathJax.Node inline>{props.value}</MathJax.Node>,
        code: CodeBlock
      }
    };
    return (
      <div className="markdown-body" style={this.props.style}>
        <MathJax.Context
          input="tex"
          options={{
            asciimath2jax: {
              useMathMLspacing: true,
              delimiters: [["$", "$"]],
              preview: "none"
            }
          }}
        >
          <ReactMarkdown {...newProps} />
        </MathJax.Context>
      </div>
    );
  }
}

export default RenderMarkdown2;
