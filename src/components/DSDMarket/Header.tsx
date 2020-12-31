import React from 'react';
import BigNumber from 'bignumber.js';

import { BalanceBlock, AddressBlock } from '../common/index';

type TradePageHeaderProps = {
  pairBalanceDED: BigNumber,
  pairBalanceDAI: BigNumber,
  uniswapPair: string,
};

const TradePageHeader = ({
  pairBalanceDED, pairBalanceDAI, uniswapPair,
}: TradePageHeaderProps) => {
  const price = pairBalanceDAI.dividedBy(pairBalanceDED);

  return (
    <div style={{ padding: '2%', display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
      <div style={{ flexBasis: '25%' }}>
        <BalanceBlock asset="DED Price" balance={price} suffix={"DAI"}/>
      </div>
      <div style={{ flexBasis: '25%' }}>
        <BalanceBlock asset="DED Liquidity" balance={pairBalanceDED} suffix={"DED"}/>
      </div>
      <div style={{ flexBasis: '25%' }}>
        <BalanceBlock asset="DAI Liquidity" balance={pairBalanceDAI} suffix={"DAI"}/>
      </div>
      <div style={{ flexBasis: '25%' }}>
        <>
          <AddressBlock label="Uniswap Contract" address={uniswapPair} />
        </>
      </div>
    </div>
  );
}


export default TradePageHeader;
