import { ChangeEventHandler, FC, FormEventHandler, useCallback, useState } from 'react';
import { Edit, RotateCcw } from 'react-feather';
import { apiPostLikeSong } from '../../../../modules/api';
import { Button } from '../../Button/Button';
import styles from './SongComment.module.scss';

interface ISongComment {
  id: number;
  text?: string;
}

export const SongComment: FC<ISongComment> = (props) => {
  const { id } = props;
  const [comment, setComment] = useState<string>(props.text || '');
  const changed = comment.trim() !== (props.text || '').trim();
  const onChange: ChangeEventHandler<HTMLInputElement> = useCallback((event) => {
    setComment(event.target.value);
  }, []);
  const onReset = useCallback(() => {
    setComment(props.text || '');
  }, [props.text]);
  const onSubmit: FormEventHandler<HTMLFormElement> = useCallback(
    (event) => {
      event.preventDefault();
      apiPostLikeSong({ id, comment }, true);
    },
    [comment, id]
  );
  return (
    <form onSubmit={onSubmit}>
      <input onChange={onChange} value={comment} className={styles.input} />
      {changed && (
        <div className={styles.actions}>
          <Button type="reset" onClick={onReset}>
            <RotateCcw />
          </Button>
          <Button type="submit">
            <Edit />
          </Button>
        </div>
      )}
    </form>
  );
};
