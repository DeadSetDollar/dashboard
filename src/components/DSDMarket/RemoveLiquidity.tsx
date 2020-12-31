import React, { useState } from 'react';
import {
  Box, Button, IconCircleMinus,
} from '@aragon/ui';
import BigNumber from 'bignumber.js';
import { removeLiquidity } from '../../utils/web3';

import { BalanceBlock, MaxButton, PriceSection } from '../common/index';
import { toBaseUnitBN } from '../../utils/number';
import {decreaseWithSlippage} from "../../utils/calculation";
import {DED, UNI, DAI} from "../../constants/tokens";
import BigNumberInput from "../common/BigNumberInput";

type RemoveLiquidityProps = {
  userBalanceUNI: BigNumber,
  pairBalanceDED: BigNumber,
  pairBalanceDAI: BigNumber,
  pairTotalSupplyUNI: BigNumber,
}


function RemoveLiquidity({
  userBalanceUNI,
  pairBalanceDED,
  pairBalanceDAI,
  pairTotalSupplyUNI,
}: RemoveLiquidityProps) {
  const [withdrawAmountUNI, setWithdrawAmountUNI] = useState(new BigNumber(0));

  const poolPortion = withdrawAmountUNI.div(pairTotalSupplyUNI);
  const estimatedDAIReceived = pairBalanceDAI.times(poolPortion);
  const estimatedDEDReceived = pairBalanceDED.times(poolPortion);

  const minDAIReceived = decreaseWithSlippage(estimatedDAIReceived);
  const minDEDReceived = decreaseWithSlippage(estimatedDEDReceived);

  const onChangeWithdrawAmountUNI = (amountUNI) => {
    if (!amountUNI) {
      setWithdrawAmountUNI(new BigNumber(0));
      return;
    }
    const amountUNIBN = new BigNumber(amountUNI);
    setWithdrawAmountUNI(amountUNIBN);
  };

  return (
    <Box heading="Remove Liquidity">
      <div style={{ display: 'flex' }}>
        {/* Pool Token in Hold */}
        <div style={{ width: '30%' }}>
          <BalanceBlock asset="Pair Token Balance" balance={userBalanceUNI} />
        </div>
        {/* Remove */}
        <div style={{ width: '70%', paddingTop: '2%' }}>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '35%', marginRight: '5%' }}>
              <BigNumberInput
                adornment="UNI-V2"
                value={withdrawAmountUNI}
                setter={onChangeWithdrawAmountUNI}
              />
              <MaxButton
                onClick={() => setWithdrawAmountUNI(userBalanceUNI)}
              />
            </div>
            <div style={{ width: '35%', marginRight: '5%' }}>
              <>
                <PriceSection label="You get " amt={estimatedDAIReceived} symbol=" DAI" />
                <PriceSection label="+ " amt={estimatedDEDReceived} symbol=" DED" />
              </>
            </div>
            <div style={{ width: '30%' }}>
              <Button
                wide
                icon={<IconCircleMinus />}
                label="Remove Liquidity"
                onClick={() => {
                  removeLiquidity(
                    toBaseUnitBN(withdrawAmountUNI, UNI.decimals),
                    toBaseUnitBN(minDEDReceived, DED.decimals),
                    toBaseUnitBN(minDAIReceived, DAI.decimals),
                  );
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
}

export default RemoveLiquidity;
