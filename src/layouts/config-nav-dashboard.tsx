import { getAuth, signOut } from "firebase/auth";

import { useRouter } from 'src/routes/hooks';
import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';
import { action } from 'src/theme/core';
import axios from "axios";

// import app from "src/init-firebase";

// ----------------------------------------------------------------------

// const auth = getAuth();





const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navData = [

  {
    title: 'Student Page',
    path: '/',
    icon: icon('ic-user'),
  },
];
