import { FC } from 'react';
import { Outlet, Link } from 'react-router-dom';
import Button from '../../common/Button/Button';
import TabSelector, { ITabSelectorTab } from '../../common/TabSelector/TabSelector';

const TABS: ITabSelectorTab[] = [
  { name: 'all stats', url: 'stats' },
  { name: 'favorites', url: 'favorites' },
  { name: 'history', url: 'history' },
];

const MainPage: FC = () => {
  return (
    <div>
      <h1>wip</h1>
      <Button>Volume:</Button>
      <Button>3</Button>
      <Button>4</Button>
      <TabSelector tabs={TABS} />
      <Outlet />
    </div>
  );
};

export default MainPage;
