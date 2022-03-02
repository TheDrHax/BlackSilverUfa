import React, { useCallback, useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import CustomScroll from 'react-custom-scroll';
import Measure from 'react-measure';

export const Scroll = ({
  children,
  className,
  keepAtBottom,
  scrollTo,
  scrollDelay,
  contentKey,
}) => {
  const scrollRef = useRef();
  const [manualScroll, setManualScroll] = useState(!keepAtBottom);
  const [outerHeight, setOuterHeight] = useState(0);

  const scrollToSelector = (selector) => {
    const { current: scroll } = scrollRef;
    const node = scroll?.innerContainerRef.current?.querySelector(selector);

    if (node) {
      if (scrollDelay) {
        setTimeout(() => (
          scroll.updateScrollPosition(node.offsetTop)
        ), scrollDelay);
      } else {
        scroll.updateScrollPosition(node.offsetTop);
      }
    }
  };

  const onResize = useCallback(() => {
    scrollRef.current?.forceUpdate();
  });

  const onOuterResize = useCallback(({ entry }) => {
    setOuterHeight(entry?.height || 0);
    onResize();
  });

  const onScroll = useCallback(({ target: { scrollTop, scrollTopMax } }) => {
    setManualScroll(scrollTop < scrollTopMax * 0.9);
  });

  useEffect(() => {
    if (keepAtBottom && !manualScroll) {
      scrollToSelector('.bottom');
    }
  }, [keepAtBottom, manualScroll, outerHeight, contentKey]);

  useEffect(() => {
    if (scrollTo) {
      scrollToSelector(scrollTo);
    }
  }, [scrollTo, contentKey]);

  return (
    <Measure onResize={onOuterResize}>
      {({ measureRef: outerMeasureRef }) => (
        <div
          ref={outerMeasureRef}
          className={className}
          style={{ display: 'flex', flexDirection: 'column' }}
        >
          <CustomScroll
            ref={scrollRef}
            onScroll={onScroll}
            flex="1 1 0"
          >
            <Measure onResize={onResize}>
              {({ measureRef }) => (
                <div ref={measureRef}>
                  {children}
                  <div className="bottom" />
                </div>
              )}
            </Measure>
          </CustomScroll>
        </div>
      )}
    </Measure>
  );
};

Scroll.propTypes = {
  className: PropTypes.string,
  keepAtBottom: PropTypes.bool,
  scrollTo: PropTypes.string,
  scrollDelay: PropTypes.number,
  contentKey: PropTypes.any,
};

Scroll.defaultProps = {
  className: null,
  keepAtBottom: false,
  scrollTo: null,
  scrollDelay: 0,
  contentKey: null,
};
