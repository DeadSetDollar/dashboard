import React, {useEffect, useState} from 'react';
import { useHistory } from 'react-router-dom';
import { Box, LinkBase, Tag } from '@aragon/ui';

import BigNumber from 'bignumber.js';
import { getTokenBalance, getTokenTotalSupply } from '../../utils/infura';
import { toTokenUnitsBN } from '../../utils/number';

import {DED, UNI, DAI} from "../../constants/tokens";

import {EPOCH_START, EPOCH_PERIOD} from "../../constants/values";
import EpochBlock from "../common/EpochBlock";
import PriceBlock from '../common/PriceBlock';
import SupplyBlock from '../common/SupplyBlock';

function epochformatted() {
  const epochStart = EPOCH_START;
  const epochPeriod = EPOCH_PERIOD;
  const hour = 60 * 60;
  const minute = 60;
  const unixTimeSec = Math.floor(Date.now() / 1000);

  let epochRemainder = unixTimeSec - epochStart
  const epoch = Math.floor(epochRemainder / epochPeriod);
  epochRemainder -= epoch * epochPeriod;
  const epochHour = Math.floor(epochRemainder / hour);
  epochRemainder -= epochHour * hour;
  const epochMinute = Math.floor(epochRemainder / minute);
  epochRemainder -= epochMinute * minute;
  return `${epoch}\n${epochMinute > 9 ? epochMinute : "0" + epochMinute.toString()}:${epochRemainder > 9 ? epochRemainder : "0" + epochRemainder.toString()}`;
}

type HomePageProps = {
  user: string
};

function HomePage({user}: HomePageProps) {
  const history = useHistory();

  const [epochTime, setEpochTime] = useState("00:00");
  const [totalSupply, setTotalSupply] = useState(new BigNumber(0));
  const [pairBalanceDED, setPairBalanceDED] = useState(new BigNumber(0));
  const [pairBalanceDAI, setPairBalanceDAI] = useState(new BigNumber(0));

  useEffect(() => {
    let isCancelled = false;

    async function updateUserInfo() {
      const [
        totalSupplyStr, pairBalanceDEDStr, pairBalanceDAIStr,
      ] = await Promise.all([
        getTokenTotalSupply(DED.addr),
        getTokenBalance(DED.addr, UNI.addr),
        getTokenBalance(DAI.addr, UNI.addr),
      ]);

      if (!isCancelled) {
        setEpochTime(epochformatted())
        setTotalSupply(toTokenUnitsBN(totalSupplyStr, DED.decimals));
        setPairBalanceDED(toTokenUnitsBN(pairBalanceDEDStr, DED.decimals));
        setPairBalanceDAI(toTokenUnitsBN(pairBalanceDAIStr, DAI.decimals));
      }
    }
    updateUserInfo();
    const id = setInterval(updateUserInfo, 1000);

    // eslint-disable-next-line consistent-return
    return () => {
      isCancelled = true;
      clearInterval(id);
    };
  }, [user]);

  return (
    <>
      <div style={{ padding: '1%', display: 'flex', flexWrap: 'wrap', alignItems: 'top' }}>
        <div style={{ flexBasis: '30%', flexGrow: 1, marginRight: '2%', textAlign: 'right'}}>
          <EpochBlock epoch={epochTime}/>
        </div>
        <div style={{ flexBasis: '30%', flexGrow: 1, marginRight: '2%', textAlign: 'right'}}>
          <SupplyBlock supply={totalSupply.toNumber().toFixed(2)}/>
        </div>
        <div style={{ flexBasis: '30%', flexGrow: 1, marginRight: '2%', textAlign: 'right'}}>
          <PriceBlock balance={pairBalanceDAI.dividedBy(pairBalanceDED)} suffix={"DAI"}/>
        </div>
      </div>
    </>
  );
}

type MainButtonPropx = {
  title: string,
  description: string,
  icon: any,
  onClick: Function,
  tag?:string
}

function MainButton({
  title, description, icon, onClick, tag,
}:MainButtonPropx) {
  return (
    <LinkBase onClick={onClick} style={{ width: '100%' }}>
      <Box>
        <div style={{ padding: 10, fontSize: 18 }}>
          {title}
          {tag ? <Tag>{tag}</Tag> : <></>}
        </div>
        <span style={{ fontSize: 48 }}>
          {icon}
        </span>
        {/*<img alt="icon" style={{ padding: 10, height: 64 }} src={iconUrl} />*/}
        <div style={{ fontSize: 20, paddingTop: 5 }}>
          {' '}
          {description}
          {' '}
        </div>

      </Box>
    </LinkBase>
  );
}

export default HomePage;
