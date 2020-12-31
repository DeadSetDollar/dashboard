import BigNumber from 'bignumber.js';
import React from 'react';
import { formatBN } from '../../utils/number';
import { useHistory } from 'react-router-dom';
import MainButton from './MainButton';

type PriceBlockProps = {
  balance: BigNumber | string | number
  suffix?: string
}

function PriceBlock({ balance, suffix=""}: PriceBlockProps) {
  let history = useHistory();

  let integer = '0';
  let digits = '0';
  const balanceBN = new BigNumber(balance);
  if (balanceBN.gte(new BigNumber(0))) {
    const tokens = formatBN(balanceBN, 2).split('.')
    integer = tokens[0];
    digits = tokens[1];
  }

  return (
    <MainButton
      title="Current Price"
      description={integer + "." + digits + " " + suffix}
      icon={"Ð"}
      onClick={() => {
        history.push('/trade/');
      }}
    />
  );
}

export default PriceBlock;
