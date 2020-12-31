import React, { useState } from 'react';
import BigNumber from 'bignumber.js';
import { Box, Button, IconCirclePlus } from '@aragon/ui';
import { addLiquidity } from '../../utils/web3';

import { BalanceBlock, MaxButton, PriceSection } from '../common/index';
import {toBaseUnitBN, toTokenUnitsBN} from '../../utils/number';
import {DED, UNI, DAI} from "../../constants/tokens";
import {SLIPPAGE} from "../../utils/calculation";
import BigNumberInput from "../common/BigNumberInput";

type AddliquidityProps = {
  userBalanceDED: BigNumber,
  userBalanceDAI: BigNumber,
  pairBalanceDED: BigNumber,
  pairBalanceDAI: BigNumber,
  pairTotalSupplyUNI: BigNumber,
}

function AddLiquidity({
  userBalanceDED,
  userBalanceDAI,
  pairBalanceDED,
  pairBalanceDAI,
  pairTotalSupplyUNI,
}: AddliquidityProps) {
  const [amountDAI, setAmountDAI] = useState(new BigNumber(0));
  const [amountDED, setAmountDED] = useState(new BigNumber(0));
  const [amountUNI, setAmountUNI] = useState(new BigNumber(0));

  const DAIToDEDRatio = pairBalanceDAI.isZero() ? new BigNumber(1) : pairBalanceDAI.div(pairBalanceDED);
  const DEDToDAIRatio = pairBalanceDED.isZero() ? new BigNumber(1) : pairBalanceDED.div(pairBalanceDAI);

  const onChangeAmountDAI = (amountDAI) => {
    if (!amountDAI) {
      setAmountDED(new BigNumber(0));
      setAmountDAI(new BigNumber(0));
      setAmountUNI(new BigNumber(0));
      return;
    }

    const amountDAIBN = new BigNumber(amountDAI)
    setAmountDAI(amountDAIBN);

    const amountDAIBU = toBaseUnitBN(amountDAIBN, DAI.decimals);
    const newAmountDED = toTokenUnitsBN(
      amountDAIBU.multipliedBy(DEDToDAIRatio).integerValue(BigNumber.ROUND_FLOOR),
      DAI.decimals);
    setAmountDED(newAmountDED);

    const newAmountDEDBU = toBaseUnitBN(newAmountDED, DED.decimals);
    const pairTotalSupplyBU = toBaseUnitBN(pairTotalSupplyUNI, UNI.decimals);
    const pairBalanceDEDBU = toBaseUnitBN(pairBalanceDED, DED.decimals);
    const newAmountUNIBU = pairTotalSupplyBU.multipliedBy(newAmountDEDBU).div(pairBalanceDEDBU).integerValue(BigNumber.ROUND_FLOOR);
    const newAmountUNI = toTokenUnitsBN(newAmountUNIBU, UNI.decimals);
    setAmountUNI(newAmountUNI)
  };

  const onChangeAmountDED = (amountDED) => {
    if (!amountDED) {
      setAmountDED(new BigNumber(0));
      setAmountDAI(new BigNumber(0));
      setAmountUNI(new BigNumber(0));
      return;
    }

    const amountDEDBN = new BigNumber(amountDED)
    setAmountDED(amountDEDBN);

    const amountDEDBU = toBaseUnitBN(amountDEDBN, DED.decimals);
    const newAmountDAI = toTokenUnitsBN(
      amountDEDBU.multipliedBy(DAIToDEDRatio).integerValue(BigNumber.ROUND_FLOOR),
      DED.decimals);
    setAmountDAI(newAmountDAI);

    const newAmountDAIBU = toBaseUnitBN(newAmountDAI, DAI.decimals);
    const pairTotalSupplyBU = toBaseUnitBN(pairTotalSupplyUNI, UNI.decimals);
    const pairBalanceDAIBU = toBaseUnitBN(pairBalanceDAI, DAI.decimals);
    const newAmountUNIBU = pairTotalSupplyBU.multipliedBy(newAmountDAIBU).div(pairBalanceDAIBU).integerValue(BigNumber.ROUND_FLOOR);
    const newAmountUNI = toTokenUnitsBN(newAmountUNIBU, UNI.decimals);
    setAmountUNI(newAmountUNI)
  };

  return (
    <Box heading="Add Liquidity">
      <div style={{ display: 'flex' }}>
        {/* Pool Status */}
        <div style={{ width: '30%' }}>
          <BalanceBlock asset="DAI Balance" balance={userBalanceDAI} />
        </div>
        {/* Add liquidity to pool */}
        <div style={{ width: '70%', paddingTop: '2%' }}>
          <div style={{ display: 'flex' }}>
            <div style={{ width: '35%', marginRight: '5%' }}>
              <>
                <BigNumberInput
                  adornment="DED"
                  value={amountDED}
                  setter={onChangeAmountDED}
                />
                <MaxButton
                  onClick={() => {
                    onChangeAmountDED(userBalanceDED);
                  }}
                />
              </>
            </div>
            <div style={{ width: '35%', marginRight: '5%' }}>
              <BigNumberInput
                adornment="DAI"
                value={amountDAI}
                setter={onChangeAmountDAI}
              />
              <PriceSection label="Mint " amt={amountUNI} symbol=" Pool Tokens" />
            </div>
            <div style={{ width: '30%' }}>
              <Button
                wide
                icon={<IconCirclePlus />}
                label="Add Liquidity"
                onClick={() => {
                  const amountDEDBU = toBaseUnitBN(amountDED, DED.decimals);
                  const amountDAIBU = toBaseUnitBN(amountDAI, DAI.decimals);
                  addLiquidity(
                    amountDEDBU,
                    amountDAIBU,
                    SLIPPAGE,
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


export default AddLiquidity;
