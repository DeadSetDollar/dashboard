import React, { useState } from 'react';
import {
  Box, Button, IconArrowUp, IconCirclePlus
} from '@aragon/ui';
import BigNumber from 'bignumber.js';
import {
  BalanceBlock, MaxButton, PriceSection,
} from '../common/index';
import {approve, providePool} from '../../utils/web3';
import {isPos, toBaseUnitBN, toTokenUnitsBN} from '../../utils/number';
import {DED, DAI} from "../../constants/tokens";
import {MAX_UINT256} from "../../constants/values";
import BigNumberInput from "../common/BigNumberInput";

type ProvideProps = {
  poolAddress: string,
  user: string,
  rewarded: BigNumber,
  pairBalanceDED: BigNumber,
  pairBalanceDAI: BigNumber,
  userDAIBalance: BigNumber,
  userDAIAllowance: BigNumber,
  status: number,
};

function Provide({
  poolAddress, user, rewarded, pairBalanceDED, pairBalanceDAI, userDAIBalance, userDAIAllowance, status
}: ProvideProps) {
  const [provideAmount, setProvideAmount] = useState(new BigNumber(0));
  const [usdcAmount, setUsdcAmount] = useState(new BigNumber(0));

  const DAIToDEDRatio = pairBalanceDAI.isZero() ? new BigNumber(1) : pairBalanceDAI.div(pairBalanceDED);

  const onChangeAmountDED = (amountDED) => {
    if (!amountDED) {
      setProvideAmount(new BigNumber(0));
      setUsdcAmount(new BigNumber(0));
      return;
    }

    const amountDEDBN = new BigNumber(amountDED)
    setProvideAmount(amountDEDBN);

    const amountDEDBU = toBaseUnitBN(amountDEDBN, DED.decimals);
    const newAmountDAI = toTokenUnitsBN(
      amountDEDBU.multipliedBy(DAIToDEDRatio).integerValue(BigNumber.ROUND_FLOOR),
      DED.decimals);
    setUsdcAmount(newAmountDAI);
  };

  return (
    <Box heading="Provide">
      {userDAIAllowance.comparedTo(MAX_UINT256.dividedBy(2)) > 0 ?
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
          {/* total rewarded */}
          <div style={{flexBasis: '32%'}}>
            <BalanceBlock asset="Rewarded" balance={rewarded} suffix={"DED"} />
          </div>
          <div style={{flexBasis: '33%'}}>
            <BalanceBlock asset="DAI Balance" balance={userDAIBalance} suffix={"DAI"} />
          </div>
          <div style={{flexBasis: '2%'}}/>
          {/* Provide liquidity using Pool rewards */}
          <div style={{flexBasis: '33%', paddingTop: '2%'}}>
            <div style={{display: 'flex'}}>
              <div style={{width: '60%', minWidth: '6em'}}>
                <>
                  <BigNumberInput
                    adornment="DED"
                    value={provideAmount}
                    setter={onChangeAmountDED}
                    disabled={status === 1}
                  />
                  <PriceSection label="Requires " amt={usdcAmount} symbol=" DAI"/>
                  <MaxButton
                    onClick={() => {
                      onChangeAmountDED(rewarded);
                    }}
                  />
                </>
              </div>
              <div style={{width: '40%', minWidth: '6em'}}>
                <Button
                  wide
                  icon={<IconArrowUp/>}
                  label="Provide"
                  onClick={() => {
                    providePool(
                      poolAddress,
                      toBaseUnitBN(provideAmount, DED.decimals),
                      (hash) => setProvideAmount(new BigNumber(0))
                    );
                  }}
                  disabled={poolAddress === '' || status !== 0 || !isPos(provideAmount) || usdcAmount.isGreaterThan(userDAIBalance)}
                />
              </div>
            </div>
          </div>
        </div>
        :
        <div style={{display: 'flex', flexWrap: 'wrap'}}>
          {/* total rewarded */}
          <div style={{flexBasis: '32%'}}>
            <BalanceBlock asset="Rewarded" balance={rewarded} suffix={"DED"} />
          </div>
          <div style={{flexBasis: '33%'}}>
            <BalanceBlock asset="DAI Balance" balance={userDAIBalance} suffix={"DAI"} />
          </div>
          <div style={{flexBasis: '2%'}}/>
          {/* Approve Pool to spend DAI */}
          <div style={{flexBasis: '33%', paddingTop: '2%'}}>
            <Button
              wide
              icon={<IconCirclePlus/>}
              label="Approve"
              onClick={() => {
                approve(DAI.addr, poolAddress);
              }}
              disabled={poolAddress === '' || user === ''}
            />
          </div>
        </div>
      }
      <div style={{width: '100%', paddingTop: '2%', textAlign: 'center'}}>
        <span style={{ opacity: 0.5 }}> Zap your rewards directly to LP by providing more DAI </span>
      </div>
    </Box>
  );
}

export default Provide;
