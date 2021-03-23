import React from 'react';
import PropTypes from 'prop-types';
import CustomScroll from 'react-custom-scroll';
import Measure from 'react-measure';

export default class Scroll extends React.Component {
  static propTypes = {
    scrollToSelector: PropTypes.string,
  }

  static defaultProps = {
    scrollToSelector: null,
  }

  constructor(props) {
    super(props);

    this.scrollRef = React.createRef();
    this.onSizeChange = this.onSizeChange.bind(this);
  }

  onSizeChange() {
    if (this.scrollRef.current) {
      this.scrollRef.current.forceUpdate();
    }
  }

  scrollToSelector() {
    const { scrollToSelector } = this.props;

    if (!scrollToSelector) {
      return;
    }

    const scroll = this.scrollRef.current;
    const container = scroll.innerContainerRef.current;
    const node = container.querySelector(scrollToSelector);

    if (node) {
      scroll.updateScrollPosition(node.offsetTop - container.offsetTop);
    }
  }

  componentDidMount() {
    setTimeout(() => this.scrollToSelector(), 10); // sorry
  }

  componentDidUpdate(prevProps) {
    const { scrollToSelector } = this.props;

    if (prevProps.scrollToSelector !== scrollToSelector) {
      this.scrollToSelector();
    }
  }

  render() {
    const { children, scrollToSelector, ...otherProps } = this.props;

    return (
      <CustomScroll
        ref={this.scrollRef}
        {...otherProps}
      >
        <Measure onResize={this.onSizeChange}>
          {({ measureRef }) => (
            <div ref={measureRef}>{children}</div>
          )}
        </Measure>
      </CustomScroll>
    );
  }
}
