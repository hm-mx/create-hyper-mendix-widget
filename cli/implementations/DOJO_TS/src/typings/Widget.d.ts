// defualt props for all widgets

export interface Widget {
  mxform: mxui.lib.form._FormBase;
  mxObject: mendix.lib.MxObject;
  style?: React.CSSProperties;
  className?: string;
  tabIndex: number | undefined;
}
