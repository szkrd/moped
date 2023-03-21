import classNames from 'classnames';
import { CSSProperties, FC, ReactNode } from 'react';
import styles from './Placeholder.module.scss';

export interface IPlaceholderProps {
  width?: number | string;
  height?: number | string;
  display?: 'inline-block' | 'inline' | 'block';
  className?: string;
  children?: ReactNode;
  active?: boolean;
}

export const Placeholder: FC<IPlaceholderProps> = ({
  className,
  width,
  height,
  display = 'inline-block',
  children,
  active = true,
}) => {
  const outerStyle: CSSProperties = { width, height, display };
  if (active === false && className === undefined) return <>{children}</>;
  if (active === false) return <div className={className}>{children}</div>;
  return (
    <div style={outerStyle} className={classNames(className, styles.placeholder)} aria-hidden>
      <div className={styles.wave}></div>
      <span className={styles.content}>{children}</span>
    </div>
  );
};
