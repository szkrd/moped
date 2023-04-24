import { ChangeEventHandler, FC, useCallback, useState } from 'react';
import { apiPostLikeSong } from '../../../../modules/api';

interface ISongDownloadedFlag {
  id: number;
  state: boolean;
}

export const SongDownloadedFlag: FC<ISongDownloadedFlag> = (props) => {
  const { id } = props;
  const [downloaded, setDownloaded] = useState<boolean>(props.state ?? false);
  const onClick: ChangeEventHandler<HTMLInputElement> = useCallback(
    (event) => {
      event.preventDefault();
      apiPostLikeSong({ id, downloaded: !downloaded }, true);
      setDownloaded(!downloaded);
    },
    [downloaded, id]
  );
  return (
    <span>
      <input onChange={onClick} type="checkbox" checked={downloaded} />
    </span>
  );
};
