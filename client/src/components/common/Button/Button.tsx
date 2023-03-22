import classNames from 'classnames';
import { noop } from 'lodash';
import { FC, PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';
import styles from './Button.module.scss';

export interface IButton {
  className?: string;
  url?: string;
  newTab?: boolean;
  onClick?: () => void;
  selected?: boolean;
  disabled?: boolean;
}

export const Button: FC<PropsWithChildren<IButton>> = (props) => {
  const { children, url, onClick, selected, disabled, newTab } = props;
  const className = classNames(
    styles.button,
    props.className,
    selected ? styles.selected : '',
    disabled ? styles.disabled : ''
  );
  if (url)
    return (
      <Link to={url} className={className} onClick={disabled ? noop : onClick} target={newTab ? '_blank' : undefined}>
        {children}
      </Link>
    );
  return (
    <button className={className} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  );
};
