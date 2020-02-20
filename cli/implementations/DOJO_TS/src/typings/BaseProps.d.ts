import { Widget } from './Widget';

interface BaseProps extends Widget {
  mxObject: mendix.lib.MxObject;
  // Start listing the attributes defined in `widget.config.xml`
  dummyKey: string;
  // End listing the attributes defined in `widget.config.xml`
}

export interface RootProps extends BaseProps {
  style: string;
  class: string;
}

export interface ComponentProps extends BaseProps {
  style?: React.CSSProperties;
  className?: string;
}

export interface PreviewProps {
  style: string;
  class: string;
  dummyKey: string;
}
