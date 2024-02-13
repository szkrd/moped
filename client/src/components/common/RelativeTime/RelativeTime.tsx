import dayjs from 'dayjs';
import { FC, useEffect, useRef } from 'react';
import { Clock } from 'react-feather';
import styles from './RelativeTime.module.scss';

interface IRelativeTime {
  at: number | string;
}

function getFormattedTime(at: number | string) {
  if (typeof at === 'number' || /^[0-9]*$/.test(String(at))) {
    return dayjs(parseInt(String(at), 10)).fromNow();
  } else {
    return dayjs(at).fromNow();
  }
}

export const RelativeTime: FC<IRelativeTime> = ({ at }) => {
  const ref = useRef<HTMLSpanElement | null>(null);
  const time = getFormattedTime(at);
  useEffect(() => {
    const interval = setInterval(() => {
      if (ref.current) ref.current.innerText = getFormattedTime(at);
    }, 5000);
    return () => {
      clearInterval(interval);
    };
  }, [at]);
  return (
    <span className={styles.relativeTime}>
      <Clock className={styles.icon} />
      <span ref={ref}>{time}</span>
      <span className={styles.origValue}>({at})</span>
    </span>
  );
};
