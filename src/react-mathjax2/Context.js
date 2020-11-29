/* global MathJax */

import React from "react";
import PropTypes from "prop-types";
import loadScript from "load-script";

/**
 * Context for loading MathJax
 */
class Context extends React.Component {
  constructor(props) {
    super(props);
    this.state = { loaded: false };
    this.unmounted = false;
  }

  getChildContext() {
    return {
      MathJax: typeof MathJax === "undefined" ? undefined : MathJax,
      input: this.props.input
    };
  }

  componentDidMount() {
    const script = this.props.script;

    if (!script) {
      console.log("script not defined");
      return this.onLoad();
    }

    loadScript(script, this.onLoad);
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  onLoad = () => {
    const options = this.props.options;

    MathJax.Hub.Config(options);

    this.myHook = MathJax.Hub.Register.StartupHook("End", () => {
      if (this.unmounted) return;
      MathJax.Hub.processSectionDelay = this.props.delay;

      if (this.props.didFinishTypeset) {
        this.props.didFinishTypeset();
      }

      if (this.props.onLoad) {
        this.props.onLoad();
      }

      if (this.props.hubFn) {
        this.props.hubFn(MathJax.Hub);
      }
      this.setState({
        loaded: true
      });
    });

    MathJax.Hub.Register.MessageHook("Math Processing Error", message => {
      if (this.props.onError) {
        this.props.onError(MathJax, message);
      }
    });
  }

  render() {
    if (!this.state.loaded && !this.props.noGate) {
      return this.props.loading;
    }

    return React.Children.only(this.props.children);
  }
}

Context.propTypes = {
  children: PropTypes.node.isRequired,
  didFinishTypeset: PropTypes.func,
  script: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([false])]),
  input: PropTypes.oneOf(["ascii", "tex"]),
  delay: PropTypes.number,
  options: PropTypes.object,
  loading: PropTypes.node,
  noGate: PropTypes.bool,
  hubFn: PropTypes.func // (MathJax.Hub) => void
};

Context.childContextTypes = {
  MathJax: PropTypes.object,
  input: PropTypes.string
};

Context.defaultProps = {
  script:
    "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js?config=TeX-MML-AM_CHTML",
  // script: "MathJax-2.7.3/MathJax.js",
  // script: "https://cdn.mathjax.org/mathjax/latest/MathJax.js",
  // script: "https://cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.4/MathJax.js",
  input: "ascii",
  delay: 0,
  options: {},
  loading: null,
  noGate: false
};

export default Context;
