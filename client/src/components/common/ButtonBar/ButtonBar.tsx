import React, { FC, PropsWithChildren } from 'react';
import styles from './ButtonBar.module.scss';

export const ButtonBar: FC<PropsWithChildren> = ({ children }) => {
  return <div className={styles.buttonBar}>{children}</div>;
};
