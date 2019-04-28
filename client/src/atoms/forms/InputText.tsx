import React, {
  useEffect, useRef, useState, FormEvent,
} from 'react';
import './InputText.scss';
import './Textarea.scss';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import JDicon, { IconSize } from '../icons/Icons';
import ErrProtecter from '../../utils/ErrProtecter';
import autoHyphen from '../../utils/AutoHyphen';
import { NEUTRAL } from '../../types/apiEnum';
import { isEmpty } from '../../utils/utils';
import { getByteLength } from '../../utils/math';

interface IProps extends React.HTMLAttributes<HTMLInputElement> {
  readOnly?: boolean;
  disabled?: boolean;
  textarea?: boolean;
  scroll?: boolean;
  doubleHeight?: boolean;
  halfHeight?: boolean;
  label?: string;
  type?: string;
  dataError?: string;
  icon?: string;
  iconHover?: boolean;
  iconOnClick?: any;
  dataSuccess?: string;
  validation?: any;
  // 음... 곤란하군 만약에 이벤트 객체를 핸들링할 경우가 생긴다면
  // onChnage=> onChangeValue로 바꾸어야겠다.
  onChange?(foo?: any): void;
  onChangeValid?: any;
  onBlur?: any;
  refContainer?: any;
  isValid?: any;
  value?: string | null;
  max?: number;
  defaultValue?: string;
  // 컨트롤 일때만 작동함
  hyphen?: boolean;
  byte?: boolean;
}

const InputText: React.FC<IProps> = ({
  readOnly,
  label,
  disabled,
  type,
  validation,
  onChange,
  onBlur,
  max,
  isValid,
  onChangeValid,
  refContainer,
  textarea,
  scroll,
  value,
  defaultValue, // UNcontrolled
  doubleHeight,
  halfHeight,
  dataError,
  dataSuccess,
  icon,
  iconOnClick,
  iconHover,
  hyphen,
  byte,
  ...props
}) => {
  const inHandleChange = (event: any) => {
    const { target } = event;
    const result = validation(target.value, max);
    onChange && onChange(target.value.replace(/-/gi, ''));
    onChangeValid(result);
  };

  const { className } = props;
  const classes = classNames(textarea ? 'JDtextarea' : 'JDinput', className, {
    'JDinput--valid': isValid === true && !textarea,
    'JDinput--invalid': isValid === false && !textarea,
    /* --------------------------------- 텍스트어리어 --------------------------------- */
    'JDtextarea--scroll': scroll && textarea,
    'JDtextarea--doubleHeight': doubleHeight && textarea,
    'JDtextarea--halfHeight': halfHeight && textarea,
    'JDtextarea--valid': isValid === true,
    'JDtextarea--invalid': isValid === false,
  });

  const inRefContainer = useRef(null);

  // for unControlled
  useEffect(() => {
    let domInput;
    if (refContainer) domInput = refContainer.current;
    else domInput = inRefContainer.current;
    if (defaultValue !== undefined) domInput.value = defaultValue;
  }, []);

  const valueFormat = () => {
    if (value) {
      return hyphen ? autoHyphen(value) : value;
    }
    return undefined;
  };
  const formatedValue = valueFormat();

  // 인풋 과 텍스트어리어 경계
  return !textarea ? (
    <div className="JDinput-wrap">
      {icon !== '' ? (
        <span className="JDinput-iconWrap">
          {icon && <JDicon size={IconSize.MEDIUM} onClick={iconOnClick} hover={iconHover} icon={icon} />}
        </span>
      ) : null}
      <input
        onChange={inHandleChange}
        disabled={disabled}
        readOnly={readOnly}
        onBlur={onBlur}
        type={type}
        value={formatedValue}
        ref={refContainer || inRefContainer}
        data-color="1213"
        className={classes}
        {...props}
      />
      <label htmlFor="JDinput" data-error={dataError} data-success={dataSuccess} className="JDinput_label">
        {label}
      </label>
    </div>
  ) : (
    <div className="JDinput-wrap">
      <textarea
        disabled={disabled}
        value={value || undefined}
        onChange={inHandleChange}
        onBlur={onBlur}
        id="JDtextarea"
        className={classes}
        readOnly={readOnly}
        ref={refContainer || inRefContainer}
      />
      <label htmlFor="JDtextarea" className="JDtextarea_label">
        {label}
      </label>
      {byte && <span className="JDtextarea__byte">{getByteLength(value || undefined)}</span>}
    </div>
  );
};

InputText.defaultProps = {
  readOnly: false,
  disabled: false,
  textarea: false,
  scroll: false,
  doubleHeight: false,
  label: '',
  type: '',
  dataError: '',
  icon: '',
  dataSuccess: '',
  isValid: '',
  onChangeValid: () => {},
  onChange: () => {},
  validation: () => NEUTRAL,
  max: 10000,
  refContainer: undefined,
  value: undefined,
};

export default ErrProtecter(InputText);
