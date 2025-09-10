import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    // Optional: log to a service like Sentry or console
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: 40, textAlign: "left", fontFamily: "monospace", backgroundColor: "#fff3f3" }}>
          <h2 style={{ color: "red" }}>Something went wrong.</h2>
          <hr />
          <h3 style={{ marginTop: 20 }}>Error:</h3>
          <pre style={{ whiteSpace: "pre-wrap", color: "darkred" }}>
            {this.state.error?.toString()}
          </pre>

          <h3 style={{ marginTop: 20 }}>Stack Trace:</h3>
          <pre style={{ whiteSpace: "pre-wrap", color: "gray" }}>
            {this.state.errorInfo?.componentStack}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
