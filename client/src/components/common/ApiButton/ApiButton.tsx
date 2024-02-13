import { FC, PropsWithChildren, useCallback } from 'react';
import { apiCall, ApiUrl } from '../../../modules/api';
import { TQueryObject } from '../../../utils/fetch/request';
import { Button, IButton } from '../Button/Button';

interface IApiButton extends PropsWithChildren<Omit<IButton, 'onClick'>> {
  /** Unlike with the plain button, this is required; api url without the host prefix. */
  url: ApiUrl;
  query?: TQueryObject;
}

export const ApiButton: FC<IApiButton> = (props) => {
  const buttonProps: IButton = { ...props, url: undefined };
  const { url, className, query } = props;
  buttonProps.onClick = useCallback(() => {
    apiCall(url, { query });
  }, [url, query]);
  return <Button {...buttonProps} className={className} />;
};
