import React, {useEffect, useState} from 'react';
import BigNumber from "bignumber.js";
import {
  getBalanceBonded,
  getBalanceOfStaged,
  getPoolBalanceOfBonded, getPoolBalanceOfClaimable, getPoolBalanceOfRewarded, getPoolBalanceOfStaged,
  getTokenBalance,
  getTokenTotalSupply
} from "../../utils/infura";
import {DED, DEDS, UNI} from "../../constants/tokens";
import {formatBN, toTokenUnitsBN} from "../../utils/number";
import {getPoolAddress} from "../../utils/pool";

type TotalBalanceProps = {
  user: string,
}

function TotalBalance({ user }: TotalBalanceProps) {
  const [totalBalance, setTotalBalance] = useState(new BigNumber(0));

  //Update User balances
  useEffect(() => {
    if (user === '') {
      setTotalBalance(new BigNumber(0));
      return;
    }
    let isCancelled = false;

    async function updateUserInfo() {
      const poolAddress = await getPoolAddress();

      const [
        dedBalance, stagedBalance, bondedBalance,
        pairBalanceDEDStr, pairTotalSupplyUNIStr, userUNIBalanceStr,
        userPoolBondedBalanceStr, userPoolStagedBalanceStr,
        userPoolRewardedBalanceStr, userPoolClaimableBalanceStr,
      ] = await Promise.all([
        getTokenBalance(DED.addr, user),
        getBalanceOfStaged(DEDS.addr, user),
        getBalanceBonded(DEDS.addr, user),

        getTokenBalance(DED.addr, UNI.addr),
        getTokenTotalSupply(UNI.addr),
        getTokenBalance(UNI.addr, user),
        getPoolBalanceOfBonded(poolAddress, user),
        getPoolBalanceOfStaged(poolAddress, user),
        getPoolBalanceOfRewarded(poolAddress, user),
        getPoolBalanceOfClaimable(poolAddress, user),
      ]);

      const userBalance = toTokenUnitsBN(new BigNumber(dedBalance), DED.decimals);
      const userStagedBalance = toTokenUnitsBN(new BigNumber(stagedBalance), DEDS.decimals);
      const userBondedBalance = toTokenUnitsBN(new BigNumber(bondedBalance), DEDS.decimals);

      const userUNIBalance = toTokenUnitsBN(new BigNumber(userUNIBalanceStr), DEDS.decimals);
      const userPoolBondedBalance = toTokenUnitsBN(new BigNumber(userPoolBondedBalanceStr), DEDS.decimals);
      const userPoolStagedBalance = toTokenUnitsBN(new BigNumber(userPoolStagedBalanceStr), DEDS.decimals);
      const userPoolRewardedBalance = toTokenUnitsBN(new BigNumber(userPoolRewardedBalanceStr), DEDS.decimals);
      const userPoolClaimableBalance = toTokenUnitsBN(new BigNumber(userPoolClaimableBalanceStr), DEDS.decimals);

      const UNItoDED = new BigNumber(pairBalanceDEDStr).dividedBy(new BigNumber(pairTotalSupplyUNIStr));

      const daoTotalBalance = userStagedBalance.plus(userBondedBalance);
      const poolTotalBalance = UNItoDED.multipliedBy(userPoolStagedBalance.plus(userPoolBondedBalance))
        .plus(userPoolRewardedBalance.plus(userPoolClaimableBalance));
      const circulationBalance = UNItoDED.multipliedBy(userUNIBalance).plus(userBalance)

      const totalBalance = daoTotalBalance.plus(poolTotalBalance).plus(circulationBalance)

      if (!isCancelled) {
        setTotalBalance(totalBalance);
      }
    }

    updateUserInfo();
    const id = setInterval(updateUserInfo, 15000);

    // eslint-disable-next-line consistent-return
    return () => {
      isCancelled = true;
      clearInterval(id);
    };
  }, [user]);

  return (
    <div style={{ fontSize: 14, padding: 3, fontWeight: 400, lineHeight: 1.5, fontFamily: 'aragon-ui-monospace, monospace'}}>
      Ð{formatBN(totalBalance, 2)}
    </div>
  );
}


export default TotalBalance;
