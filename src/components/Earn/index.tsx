import React from 'react';
import { Box } from '@aragon/ui';

import Wallet from "../Wallet";
import Pool from "../Pool";

type EarnProps = {
  user: string
};

function Earn({user}: EarnProps) {
  return (
    <>
      <div style={{ padding: '1%', display: 'flex', flexWrap: 'wrap', alignItems: 'top' }}>
        <div style={{ flexBasis: '20%', flexGrow: 1, marginRight: '2%', textAlign: 'right'}}>
          <Box>
            <Wallet user={user}/>
          </Box>
        </div>
        <div style={{ flexBasis: '20%', flexGrow: 1, marginRight: '2%', textAlign: 'right'}}>
          <Box>
            <Pool user={user}/>
          </Box>
        </div>
      </div>
    </>
  );
}

export default Earn;
