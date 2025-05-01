// custom.d.ts or svg.d.ts
declare module "*.svg" {
    import React from "react";
    const content: React.FC<React.SVGProps<SVGSVGElement>>;
    export default content;
  }
  


  declare module "@react-native-firebase/firestore" {
    import firestore from '@react-native-firebase/firestore';
    export default firestore;
  }

  declare module "@react-native-firebase/auth" {
    import auth from '@react-native-firebase/auth';

    export default auth;
  }