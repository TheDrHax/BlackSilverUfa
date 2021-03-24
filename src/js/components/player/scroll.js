import React from 'react';
import PropTypes from 'prop-types';
import CustomScroll from 'react-custom-scroll';
import Measure from 'react-measure';

export default class Scroll extends React.Component {
  static propTypes = {
    scrollToSelector: PropTypes.string,
    flex: PropTypes.string,
    heightRelativeToParent: PropTypes.string,
    keepAtBottom: PropTypes.bool,
  }

  static defaultProps = {
    scrollToSelector: null,
    flex: null,
    heightRelativeToParent: null,
    keepAtBottom: false,
  }

  constructor(props) {
    super(props);

    this.scrollRef = React.createRef();
    this.onSizeChange = this.onSizeChange.bind(this);

    this.innerHeight = 0;
    this.outerHeight = 0;
    this.prevOuterHeight = 0;
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

  keepAtBottom() {
    const {
      innerHeight,
      scrollRef: {
        current: ref,
      },
      props: {
        keepAtBottom,
      },
    } = this;

    if (keepAtBottom && ref && innerHeight) {
      ref.updateScrollPosition(innerHeight);
    }
  }

  render() {
    const {
      children,
      scrollToSelector,
      flex,
      heightRelativeToParent,
      ...otherProps
    } = this.props;

    const containerStyle = {};

    if (flex) {
      containerStyle.flex = flex;
    } else if (heightRelativeToParent) {
      containerStyle.height = heightRelativeToParent;
    }

    return (
      <Measure onResize={this.onSizeChange}>
        {({ contentRect: { entry: { height: outerHeight } }, measureRef: outerMeasureRef }) => {
          this.prevOuterHeight = this.outerHeight;
          this.outerHeight = outerHeight;
          if (this.prevOuterHeight !== this.outerHeight) {
            this.keepAtBottom();
          }

          return (
            <div ref={outerMeasureRef} style={containerStyle} className="scroll-outer">
              <CustomScroll
                ref={this.scrollRef}
                flex="1 1 0"
                {...otherProps}
              >
                <Measure onResize={this.onSizeChange}>
                  {({ contentRect: { entry: { height: innerHeight } }, measureRef }) => {
                    this.innerHeight = innerHeight;

                    return <div ref={measureRef}>{children}</div>;
                  }}
                </Measure>
              </CustomScroll>
            </div>
          );
        }}
      </Measure>
    );
  }
}
