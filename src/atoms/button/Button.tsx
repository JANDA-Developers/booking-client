/* eslint-disable react/button-has-type */
import React, { Fragment } from "react";
import "./Button.scss";
import classNames from "classnames";
import Icon, { IConProps } from "../icons/Icons";
import Preloader from "../preloader/Preloader";
import { s4, colorClass } from "../../utils/utils";
import Tooltip from "../tooltip/Tooltip";
import { JDColor } from "../../types/enum";
import { JDmbClass, JDmrClass } from "../../utils/autoClasses";
import { JDatomExtentionSet } from "../../types/interface";
import { IIcons, IconConifgProps } from "../icons/declation";
import userTacking from "../../utils/userTracking";
import JDtypho from "../typho/Typho";

export interface IButtonProps
  extends React.HTMLAttributes<HTMLButtonElement>,
  JDatomExtentionSet {
  disabled?: boolean;
  label?: string;
  icon?: IIcons;
  iconProps?: IConProps & IconConifgProps;
  refContainer?: any;
  cunsumPadding?: boolean;
  onClick?(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void;
  iconClasses?: string[];
  dataTip?: any;
  dataFor?: any;
  br?: "round" | "normal";
  mode?: "flat" | "normal" | "border" | "iconButton";
  size?: "tiny" | "small" | "large" | "long" | "longLarge";
  flat?: boolean;
  float?: string;
  type?: "button" | "submit" | "reset" | undefined;
  color?: string;
  thema?: JDColor | null;
  pulse?: boolean;
  blink?: boolean;
  toggle?: boolean;
  preloader?: boolean;
  transparent?: boolean;
  className?: string;
  hrefOpen?: string;
  tooltip?: string;
  redirect?: string;
}

const Button: React.FC<IButtonProps> = ({
  disabled,
  label,
  icon,
  tooltip,
  onClick,
  iconProps,
  iconClasses,
  br,
  dataTip,
  dataFor,
  flat,
  mode,
  cunsumPadding,
  refContainer,
  float,
  type,
  color,
  thema,
  redirect,
  pulse,
  blink,
  preloader,
  className,
  transparent,
  size,
  mb,
  mr,
  hrefOpen,
  // 투글은 클래스만 바꾸어 줍니다.
  toggle,
  ...props
}) => {
  const classes = classNames("JDbtn", className, {
    "JDbtn--flat": mode === "flat" || flat,
    "JDbtn--small": size === "small",
    "JDbtn--tiny": size === "tiny",
    "JDbtn--large": size === "large" || size === "longLarge",
    "JDbtn--long": size === "long" || size === "longLarge",
    "JDbtn--border": mode === "border",
    "JDbtn--left": float === "left",
    "JDbtn--right": float === "right",
    "JDbtn--text-white": color === "white",
    "JDbtn--transparent": transparent,
    ...colorClass("JDbtn", thema),
    "JDwaves-effect-dark": mode === "flat" && thema === "normal",
    "JDbtn--pulse": pulse,
    "JDbtn--iconButton": mode === "iconButton",
    "JDbtn--round": br === "round",
    "JDbtn--toogleOn": toggle === true,
    "JDbtn--toogle111Off": toggle === false,
    "JDbtn--cunsumPadding": cunsumPadding,
    "JDtext-blink": blink,
    "visibility-none": props.hidden,
    ...JDmbClass(mb),
    ...JDmrClass(mr)
  });

  const handleClickButton = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    hrefOpen && window.open(hrefOpen);
    if (redirect) {
      document.location.href = redirect;
    }
    userTacking(label);

    onClick && onClick(event);
  };

  const handleKeyPress = () => { };

  const newId = s4();

  if (mode === "iconButton") {
    return (
      <button
        {...props}
        ref={refContainer}
        type={type}
        disabled={disabled}
        className={`JDbtn JDwaves-effect ${classes}`}
        onClick={handleClickButton}
        onKeyPress={handleKeyPress}
        data-tip={tooltip ? true : dataTip}
        data-for={tooltip ? `btnTooltip${newId}` : dataFor}
      >
        <div>
          <Icon {...iconProps} icon={icon!} />
        </div>
        {label && (
          <JDtypho className="JDbtn--iconButton__label" size="tiny">
            {label}
          </JDtypho>
        )}
      </button>
    );
  }

  return (
    <Fragment>
      <button
        {...props}
        ref={refContainer}
        type={type}
        disabled={disabled}
        className={`JDbtn JDwaves-effect ${classes}`}
        onClick={handleClickButton}
        onKeyPress={handleKeyPress}
        data-tip={tooltip ? true : dataTip}
        data-for={tooltip ? `btnTooltip${newId}` : dataFor}
      >
        <span className="JDbtn__contents">
          {preloader ? <Preloader loading={true} /> : label}
          {!preloader && icon && (
            <i
              className={`JDbtn__icon ${iconClasses && iconClasses.join(" ")}`}
            >
              {icon && <Icon {...iconProps} icon={icon} />}
            </i>
          )}
        </span>
      </button>
      {tooltip && (
        <Tooltip type="dark" effect="solid" id={`btnTooltip${newId}`}>
          <span>{tooltip}</span>
        </Tooltip>
      )}
    </Fragment>
  );
};

Button.defaultProps = {
  disabled: false,
  label: "",
  onClick: () => { },
  iconClasses: [""],
  dataTip: false,
  dataFor: "",
  pulse: false,
  blink: false,
  float: "",
  color: "",
  thema: "normal",
  type: "button",
  preloader: false
};

export default Button;
