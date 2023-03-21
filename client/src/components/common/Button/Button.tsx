import classNames from 'classnames';
import { FC, PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';
import styles from './Button.module.scss';

export interface IButton {
  className?: string;
  url?: string;
  onClick?: () => void;
}

export const Button: FC<PropsWithChildren<IButton>> = (props) => {
  const { children, url, onClick } = props;
  const className = classNames(styles.button, props.className);
  if (url)
    return (
      <Link to={url} className={className} onClick={onClick}>
        {children}
      </Link>
    );
  return (
    <button className={className} onClick={onClick}>
      {children}
    </button>
  );
};
