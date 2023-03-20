import classNames from 'classnames';
import { FC, PropsWithChildren } from 'react';
import { Link } from 'react-router-dom';
import styles from './Button.module.scss';

interface IButton {
  className?: string;
  url?: string;
}

const Button: FC<PropsWithChildren<IButton>> = (props) => {
  const { children, url } = props;
  const className = classNames(styles.button, props.className);
  if (url)
    return (
      <Link to={url} className={className}>
        {children}
      </Link>
    );
  return <button className={className}>{children}</button>;
};

export default Button;
