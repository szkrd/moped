import { FC, PropsWithChildren, SVGProps } from 'react';
import { Youtube } from 'react-feather';
import { Button, IButton } from '../Button/Button';

interface ISearchButton extends PropsWithChildren<IButton> {
  provider: 'google' | 'youtube' | 'spotify';
  searchText?: string;
}

const strokeData: Partial<SVGProps<SVGPathElement>> = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
};

function SpotifyIcon() {
  return (
    <svg width={24} height={24} viewBox="0 0 350 340" xmlns="http://www.w3.org/2000/svg">
      <path
        fill="currentColor"
        d="M8 171c0 92 76 168 168 168s168-76 168-168S268 4 176 4 8 79 8 171zm230 78c-39-24-89-30-147-17-14 2-16-18-4-20 64-15 118-8 162 19 11 7 0 24-11 18zm17-45c-45-28-114-36-167-20-17 5-23-21-7-25 61-18 136-9 188 23 14 9 0 31-14 22zM80 133c-17 6-28-23-9-30 59-18 159-15 221 22 17 9 1 37-17 27-54-32-144-35-195-19z"
      />
    </svg>
  );
}

function GoogleLogo() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={24} height={24} viewBox="-2 -2 28 28">
      <path
        d="M11.940527 9.7688291v4.6239359h6.425727c-.282165 1.487035-1.128909 2.746183-2.398837 3.592801l3.874965 3.006661c2.257692-2.083955 3.560211-5.144892 3.560211-8.781065 0-.846619-.07596-1.660771-.217108-2.4422076z"
        {...strokeData}
      />
      <path
        d="m5.249182 14.21226-.873945.668997-3.093529 2.409616c1.964621 3.896651 5.991261 6.588557 10.658569 6.588557 3.223642 0 5.926328-1.063727 7.901855-2.887203l-3.874965-3.006661c-1.063726.71638-2.420522 1.150594-4.02689 1.150594-3.10431 0-5.741814-2.094861-6.686206-4.917006z"
        {...strokeData}
      />
      <path
        d="M1.281708 6.5885571C.467681 8.194926.001 10.007622.001 11.939652c0 1.93203.466681 3.744726 1.280708 5.351095 0 .01078 3.972739-3.082624 3.972739-3.082624-.238793-.716379-.379938-1.476129-.379938-2.268596s.141145-1.552217.379938-2.2685968z"
        {...strokeData}
      />
      <path
        d="M11.940527 4.7541752c1.758419 0 3.321416.6078255 4.569658 1.780105l3.419066-3.4190651C17.856076 1.1831851 15.164296 0 11.940527 0 7.27322 0 3.246329 2.6810003 1.281708 6.5885571l3.972614 3.0826238c.944266-2.8221452 3.581895-4.9170057 6.686205-4.9170057Z"
        {...strokeData}
      />
    </svg>
  );
}

export const SearchButton: FC<ISearchButton> = (props) => {
  const { provider } = props;
  let url: string | undefined = undefined;
  const enabled = !!props.searchText;
  if (enabled) {
    const query = encodeURIComponent(props.searchText ?? '');
    if (provider === 'google') {
      url = `https://www.google.com/search?q=${query}`;
    } else if (provider === 'youtube') {
      url = `https://www.youtube.com/results?search_query=${query}`;
    } else if (provider === 'spotify') {
      url = `https://open.spotify.com/search/${query}`;
    }
  }
  return (
    <Button {...props} url={url} newTab disabled={!enabled}>
      {provider === 'google' && <GoogleLogo />}
      {provider === 'youtube' && <Youtube />}
      {provider === 'spotify' && <SpotifyIcon />}
    </Button>
  );
};
