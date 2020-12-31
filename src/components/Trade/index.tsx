import React from 'react';
import { Box } from '@aragon/ui';

import DSDMarket from "../DSDMarket";
import CouponMarket from "../CouponMarket";

type TradeProps = {
  user: string
};

function Trade({user}: TradeProps) {
  return (
    <>
      <div style={{ padding: '1%', display: 'flex', flexWrap: 'wrap', alignItems: 'top' }}>
        <div style={{ flexBasis: '20%', flexGrow: 1, marginRight: '2%', textAlign: 'right'}}>
          <Box>
            <DSDMarket user={user}/>
          </Box>
        </div>
        <div style={{ flexBasis: '50%'}}>
          <Box>
            <CouponMarket user={user}/>
          </Box>
        </div>
      </div>
    </>
  );
}

export default Trade;
