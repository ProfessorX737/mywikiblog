import React from "react";
import "codemirror";
import { Controlled as Codemirror } from "react-codemirror2";
import "codemirror/addon/hint/show-hint";
import "codemirror/addon/hint/html-hint";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/markdown/markdown";
import PropTypes from "prop-types";
import RenderMarkdown2 from "./render-markdown2.js";
import "./github-markdown.css";
import "./code-mirror.css";

//https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet

class MarkdownEditor extends React.Component {
  static propTypes = {
    initialCode: PropTypes.string,
    editorStyle: PropTypes.object,
    onContentChange: PropTypes.func, // (newContent) => void
    lineNumbers: PropTypes.bool,
    renderStyle: PropTypes.object,
    getEditor: PropTypes.func,
    onFocus: PropTypes.func, // (editor, event) => void
    lineWrapping: PropTypes.bool,
    preview: PropTypes.bool,
    wrapperProps: PropTypes.object
  };

  static defaultProps = {
    lineNumbers: true,
    lineWrapping: true,
    renderStyle: {},
    getEditor: cm => {},
    onFocus: () => {},
    onContentChange: () => {},
    preview: true
  };

  constructor(props) {
    super(props);
    const initialCode = props.initialCode ? props.initialCode : "";
    this.state = {
      code: initialCode
    };
    this.options = {
      lineNumbers: this.props.lineNumbers,
      mode: "markdown",
      extraKeys: { "Ctrl-Space": "autocomplete" },
      lineWrapping: this.props.lineWrapping
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.editor.focus();
    }, 0);
    this.props.getEditor(this.editor);
    this.refs.wrap.scrollIntoView({ behavior: "smooth", block: "end" });
  }

  updateCode = (editor, data, value) => {
    this.setState({
      code: value
    });
  };

  render() {
    return (
      <div
        ref="wrap"
        style={{ ...this.props.editorStyle, scrollBehavior: "smooth" }}
        {...this.props.wrapperProps}
      >
        <Codemirror
          ref={el => (this.cm = el)}
          editorDidMount={editor => {
            this.editor = editor;
          }}
          value={this.state.code}
          onBeforeChange={this.updateCode}
          onChange={(editor, data, value) => this.props.onContentChange(value)}
          options={this.options}
          onFocus={this.props.onFocus}
        />
        {this.props.preview && (
          <div style={{ backgroundColor: "transparent" }}>
            <RenderMarkdown2
              source={this.state.code}
              style={this.props.renderStyle}
            />
          </div>
        )}
      </div>
    );
  }
}

export default MarkdownEditor;
