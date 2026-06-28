export interface MenuItem {
  title: string;
  description: string;
  icon: string;
  color: string;
  action?: () => void;
  children?: MenuItem[];
}

export const getMenuItems = (): MenuItem[] => {
  const route = useRoute();
  const router = useRouter();

  const routerPush = (targetPath: string) => {
    if (route.path !== targetPath) {
      router.push(targetPath);
    } else {
      router.go(0);
    }
  };

  return [
    {
      title: 'Home',
      description: 'System Status',
      icon: 'HomeIcon',
      color: 'bg-teal-300',
      action: () => {
        routerPush('/');
      },
    },
    {
      title: 'Report Issue',
      description: 'Report a service issue',
      icon: 'ExclamationTriangleIcon',
      color: 'bg-amber-300',
      action: () => {
        routerPush('/raise');
      },
    },
  ];
};
