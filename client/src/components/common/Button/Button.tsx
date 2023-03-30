import classNames from 'classnames';
import { noop } from 'lodash';
import { FC, MouseEvent, PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';
import styles from './Button.module.scss';

export interface IButton {
  className?: string;
  selectedClassName?: string;
  url?: string;
  newTab?: boolean;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  selected?: boolean;
  disabled?: boolean;
  dataId?: string | number;
  type?: 'submit' | 'button' | 'reset';
}

export const Button: FC<PropsWithChildren<IButton>> = (props) => {
  const { children, url, onClick, selected, disabled, newTab, selectedClassName, dataId } = props;
  const type = props.type ?? 'button';
  const className = classNames(
    styles.button,
    props.className,
    selected ? classNames(styles.selected, selectedClassName) : '',
    disabled ? styles.disabled : ''
  );
  if (url)
    return (
      <Link
        to={url}
        className={className}
        data-id={dataId}
        onClick={disabled ? noop : onClick}
        target={newTab ? '_blank' : undefined}
      >
        {children}
      </Link>
    );
  return (
    <button className={className} onClick={onClick} disabled={disabled} data-id={dataId} type={type}>
      {children}
    </button>
  );
};
