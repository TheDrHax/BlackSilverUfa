import React from 'react';
import PropTypes from 'prop-types';
import CustomScroll from 'react-custom-scroll';
import Measure from 'react-measure';
import animateScrollTo from 'animated-scroll-to';

export default class Scroll extends React.Component {
  constructor(props) {
    super(props);

    this.scrollRef = React.createRef();
    this.onSizeChange = this.onSizeChange.bind(this);

    this.outerHeight = 0;
    this.prevOuterHeight = 0;
    this.outerWidth = 0;
    this.prevOuterWidth = 0;
  }

  onSizeChange() {
    if (this.scrollRef.current) {
      this.scrollRef.current.forceUpdate();
    }
  }

  scrollToSelector(selector) {
    const { smooth } = this.props;
    const scroll = this.scrollRef.current;
    const container = scroll.innerContainerRef.current;
    const node = container.querySelector(selector);

    if (node) {
      // We need to wait for child components to render
      // This is probably a bad solution
      setTimeout(() => {
        animateScrollTo(node, {
          elementToScroll: container,
          maxDuration: smooth ? 1000 : 0,
        });
      }, 100);
    }
  }

  componentDidMount() {
    const { scrollToSelector, keepAtBottom } = this.props;

    if (scrollToSelector) {
      this.scrollToSelector(scrollToSelector);
    } else if (keepAtBottom) {
      this.keepAtBottom();
    }
  }

  componentDidUpdate(prevProps) {
    const { scrollToSelector, keepAtBottom, contentKey } = this.props;

    if (prevProps.contentKey !== contentKey) {
      if (scrollToSelector) {
        this.scrollToSelector(scrollToSelector);
      }

      if (keepAtBottom) {
        this.keepAtBottom();
      }
    }
  }

  keepAtBottom() {
    const {
      scrollRef: {
        current: ref,
      },
      props: {
        keepAtBottom,
        bottomSelector,
      },
    } = this;

    if (keepAtBottom && ref) {
      this.scrollToSelector(bottomSelector);
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
        {({
          contentRect: {
            entry: {
              width: outerWidth,
              height: outerHeight,
            },
          },
          measureRef: outerMeasureRef,
        }) => {
          this.prevOuterHeight = this.outerHeight;
          this.outerHeight = outerHeight;
          this.prevOuterWidth = this.outerWidth;
          this.outerWidth = outerWidth;

          if (this.prevOuterHeight !== this.outerHeight
              || this.prevOuterWidth !== this.outerWidth) {
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
                  {({ measureRef }) => (
                    <div ref={measureRef}>
                      {children}
                      <div className="bottom" />
                    </div>
                  )}
                </Measure>
              </CustomScroll>
            </div>
          );
        }}
      </Measure>
    );
  }
}

Scroll.propTypes = {
  scrollToSelector: PropTypes.string,
  smooth: PropTypes.bool,
  flex: PropTypes.string,
  heightRelativeToParent: PropTypes.string,
  keepAtBottom: PropTypes.bool,
  bottomSelector: PropTypes.string,
  contentKey: PropTypes.any,
};

Scroll.defaultProps = {
  scrollToSelector: null,
  smooth: false,
  flex: null,
  heightRelativeToParent: null,
  keepAtBottom: false,
  bottomSelector: '.bottom',
  contentKey: null,
};
