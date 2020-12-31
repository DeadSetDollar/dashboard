import React, { useState } from 'react';
import {
  Box, Button, IconCirclePlus,
} from '@aragon/ui';
import BigNumber from 'bignumber.js';
import {mintTestnetUSDC} from '../../utils/web3';

import { BalanceBlock } from '../common/index';
import {isPos, toBaseUnitBN} from '../../utils/number';
import {DAI} from "../../constants/tokens";
import BigNumberInput from "../common/BigNumberInput";

type MintDAIProps = {
  user: string,
  userBalanceDAI: BigNumber,
}


function MintDAI({
  user, userBalanceDAI
}: MintDAIProps) {
  const [mintAmount, setMintAmount] = useState(new BigNumber(0));

  return (
    <Box heading="Mint">
      <div style={{ display: 'flex' }}>
        {/* DAI balance */}
        <div style={{ width: '30%' }}>
          <BalanceBlock asset="DAI Balance" balance={userBalanceDAI} />
        </div>
        {/* Mint */}
        <div style={{ width: '38%'}} />
        <div style={{ width: '32%', paddingTop: '2%'}}>
          <div style={{display: 'flex'}}>
            <div style={{width: '60%'}}>
              <BigNumberInput
                adornment="DAI"
                value={mintAmount}
                setter={setMintAmount}
              />
            </div>
            <div style={{width: '40%'}}>
              <Button
                wide
                icon={<IconCirclePlus />}
                label="Mint"
                onClick={() => {
                  mintTestnetUSDC(toBaseUnitBN(mintAmount, DAI.decimals));
                }}
                disabled={user === '' || !isPos(mintAmount)}
              />
            </div>
          </div>
        </div>
      </div>
    </Box>
  );
}

export default MintDAI;
