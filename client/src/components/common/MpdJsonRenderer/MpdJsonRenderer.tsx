import classNames from 'classnames';
import dayjs from 'dayjs';
import { FC } from 'react';
import { Placeholder } from '../Placeholder/Placeholder';
import { RelativeTime } from '../RelativeTime/RelativeTime';
import styles from './MpdJsonRenderer.module.scss';

interface IMpdJsonRenderer {
  data: Record<string, string | number | boolean>;
}

interface IListItem {
  label: string;
  className: string;
  dataValue: string;
  text: string;
  key: string;
}

export const MpdJsonRenderer: FC<IMpdJsonRenderer> = ({ data }) => {
  const deprecated = ['time'];
  const subTypeDate = ['dbUpdate'];
  const subTypeTime = ['playtime', 'uptime', 'elapsed', 'dbPlaytime'];
  const subTypeRelativeDate = ['at'];
  const obj = { ...data };
  const uninitialized = obj.uninitialized === true;
  const html: IListItem[] = [];

  if (!obj.at) obj.at = Date.now();
  Object.keys(obj).forEach((key) => {
    const val = obj[key];
    const className: string[] = [typeof val];
    let text = String(val);
    let formattedText = '';
    let subType = '';
    if (deprecated.includes(key)) return;
    if (subTypeDate.includes(key) && typeof val === 'number') {
      subType = 'date';
      text = dayjs(val * 1000).format('YYYY MMM. D. HH:mm');
    }
    if (subTypeTime.includes(key) && typeof val === 'number') {
      subType = 'time';
      formattedText = dayjs(val * 1000).format('HH:mm:ss'); // from seconds
    }
    if (subTypeRelativeDate.includes(key)) subType = 'relativeDate';
    if (subType) className.push(subType);
    if (val !== false) {
      html.push({
        label: key,
        className: classNames(className.map((cn) => styles[`type_${cn}`])),
        key,
        dataValue: text,
        text: formattedText || text,
      });
    }
  });

  return (
    <ul className={styles.jsonData}>
      {html.map((item) => (
        <li key={item.key}>
          <label>{item.label}</label>
          <Placeholder active={uninitialized}>
            <span className={item.className} data-key={item.key} data-value={item.dataValue}>
              {item.key === 'at' ? <RelativeTime at={item.dataValue} /> : item.text}
            </span>
          </Placeholder>
        </li>
      ))}
    </ul>
  );
};
