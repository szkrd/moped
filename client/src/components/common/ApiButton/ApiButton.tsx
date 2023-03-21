import { FC, PropsWithChildren, useCallback } from 'react';
import { apiCall } from '../../../modules/api';
import { Button, IButton } from '../Button/Button';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface IApiButton extends PropsWithChildren<Omit<IButton, 'onClick'>> {
  /** Unlike with the plain button, this is required; api url without the host prefix. */
  url: string;
}

export const ApiButton: FC<IApiButton> = (props) => {
  const buttonProps: IButton = { ...props, url: undefined };
  const { url } = props;
  buttonProps.onClick = useCallback(() => {
    apiCall(url);
  }, [url]);
  return <Button {...buttonProps} />;
};
