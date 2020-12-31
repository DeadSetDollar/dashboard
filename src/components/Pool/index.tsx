import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import BigNumber from 'bignumber.js';
import {
  getPoolBalanceOfBonded, getPoolBalanceOfClaimable,
  getPoolBalanceOfRewarded,
  getPoolBalanceOfStaged,
  getPoolStatusOf, getPoolTotalBonded,
  getTokenAllowance,
  getTokenBalance,
  getPoolFluidUntil
} from '../../utils/infura';
import {DED, UNI, DAI} from "../../constants/tokens";
import {POOL_EXIT_LOCKUP_EPOCHS} from "../../constants/values";
import { toTokenUnitsBN } from '../../utils/number';
import { Header } from '@aragon/ui';

import WithdrawDeposit from "./WithdrawDeposit";
import BondUnbond from "./BondUnbond";
import PoolPageHeader from "./Header";
import Claim from "./Claim";
import Provide from "./Provide";
import IconHeader from "../common/IconHeader";
import Migrate from "./Migrate";
import {getPoolAddress} from "../../utils/pool";
import {DollarPool} from "../../constants/contracts";



function Pool({ user }: {user: string}) {
  const { override } = useParams();
  if (override) {
    user = override;
  }

  const [poolAddress, setPoolAddress] = useState("");
  const [poolTotalBonded, setPoolTotalBonded] = useState(new BigNumber(0));
  const [pairBalanceDED, setPairBalanceDED] = useState(new BigNumber(0));
  const [pairBalanceDAI, setPairBalanceDAI] = useState(new BigNumber(0));
  const [userUNIBalance, setUserUNIBalance] = useState(new BigNumber(0));
  const [userUNIAllowance, setUserUNIAllowance] = useState(new BigNumber(0));
  const [userDAIBalance, setUserDAIBalance] = useState(new BigNumber(0));
  const [userDAIAllowance, setUserDAIAllowance] = useState(new BigNumber(0));
  const [userStagedBalance, setUserStagedBalance] = useState(new BigNumber(0));
  const [userBondedBalance, setUserBondedBalance] = useState(new BigNumber(0));
  const [userRewardedBalance, setUserRewardedBalance] = useState(new BigNumber(0));
  const [userClaimableBalance, setUserClaimableBalance] = useState(new BigNumber(0));
  const [userStatus, setUserStatus] = useState(0);
  const [userStatusUnlocked, setUserStatusUnlocked] = useState(0);
  const [lockup, setLockup] = useState(0);

  //Update User balances
  useEffect(() => {
    if (user === '') {
      setPoolAddress("");
      setPoolTotalBonded(new BigNumber(0));
      setPairBalanceDED(new BigNumber(0));
      setPairBalanceDAI(new BigNumber(0));
      setUserUNIBalance(new BigNumber(0));
      setUserUNIAllowance(new BigNumber(0));
      setUserDAIBalance(new BigNumber(0));
      setUserDAIAllowance(new BigNumber(0));
      setUserStagedBalance(new BigNumber(0));
      setUserBondedBalance(new BigNumber(0));
      setUserRewardedBalance(new BigNumber(0));
      setUserClaimableBalance(new BigNumber(0));
      setUserStatus(0);
      setUserStatusUnlocked(0);
      return;
    }
    let isCancelled = false;

    async function updateUserInfo() {
      const poolAddressStr = await getPoolAddress();

      const [
        poolTotalBondedStr, pairBalanceDEDStr, pairBalanceDAIStr, balance, usdcBalance,
        allowance, usdcAllowance, stagedBalance, bondedBalance,
        rewardedBalance, claimableBalance, status, fluidUntilStr
      ] = await Promise.all([
        getPoolTotalBonded(poolAddressStr),
        getTokenBalance(DED.addr, UNI.addr),
        getTokenBalance(DAI.addr, UNI.addr),
        getTokenBalance(UNI.addr, user),
        getTokenBalance(DAI.addr, user),

        getTokenAllowance(UNI.addr, user, poolAddressStr),
        getTokenAllowance(DAI.addr, user, poolAddressStr),
        getPoolBalanceOfStaged(poolAddressStr, user),
        getPoolBalanceOfBonded(poolAddressStr, user),

        getPoolBalanceOfRewarded(poolAddressStr, user),
        getPoolBalanceOfClaimable(poolAddressStr, user),
        getPoolStatusOf(poolAddressStr, user),
        getPoolFluidUntil(poolAddressStr, user)
      ]);

      const poolTotalBonded = toTokenUnitsBN(poolTotalBondedStr, DED.decimals);
      const pairDEDBalance = toTokenUnitsBN(pairBalanceDEDStr, DED.decimals);
      const pairDAIBalance = toTokenUnitsBN(pairBalanceDAIStr, DAI.decimals);
      const userUNIBalance = toTokenUnitsBN(balance, UNI.decimals);
      const userDAIBalance = toTokenUnitsBN(usdcBalance, DAI.decimals);
      const userStagedBalance = toTokenUnitsBN(stagedBalance, UNI.decimals);
      const userBondedBalance = toTokenUnitsBN(bondedBalance, UNI.decimals);
      const userRewardedBalance = toTokenUnitsBN(rewardedBalance, DED.decimals);
      const userClaimableBalance = toTokenUnitsBN(claimableBalance, DED.decimals);
      const userStatus = parseInt(status, 10);
      const fluidUntil = parseInt(fluidUntilStr, 10);

      if (!isCancelled) {
        setPoolAddress(poolAddressStr);
        setPoolTotalBonded(new BigNumber(poolTotalBonded));
        setPairBalanceDED(new BigNumber(pairDEDBalance));
        setPairBalanceDAI(new BigNumber(pairDAIBalance));
        setUserUNIBalance(new BigNumber(userUNIBalance));
        setUserUNIAllowance(new BigNumber(allowance));
        setUserDAIAllowance(new BigNumber(usdcAllowance));
        setUserDAIBalance(new BigNumber(userDAIBalance));
        setUserStagedBalance(new BigNumber(userStagedBalance));
        setUserBondedBalance(new BigNumber(userBondedBalance));
        setUserRewardedBalance(new BigNumber(userRewardedBalance));
        setUserClaimableBalance(new BigNumber(userClaimableBalance));
        setUserStatus(userStatus);
        setUserStatusUnlocked(fluidUntil);
        setLockup(poolAddressStr === DollarPool ? POOL_EXIT_LOCKUP_EPOCHS : 1);
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
    <>
      <IconHeader icon={<i className="fas fa-parachute-box"/>} text="LP Reward Pool"/>

      <PoolPageHeader
        accountUNIBalance={userUNIBalance}
        accountBondedBalance={userBondedBalance}
        accountRewardedDEDBalance={userRewardedBalance}
        accountClaimableDEDBalance={userClaimableBalance}
        poolTotalBonded={poolTotalBonded}
        accountPoolStatus={userStatus}
        unlocked={userStatusUnlocked}
      />

      <WithdrawDeposit
        poolAddress={poolAddress}
        user={user}
        balance={userUNIBalance}
        allowance={userUNIAllowance}
        stagedBalance={userStagedBalance}
        status={userStatus}
      />

      <BondUnbond
        poolAddress={poolAddress}
        staged={userStagedBalance}
        bonded={userBondedBalance}
        status={userStatus}
        lockup={lockup}
      />

      <Claim
        poolAddress={poolAddress}
        rewarded={userRewardedBalance}
        claimable={userClaimableBalance}
        status={userStatus}
      />
    </>
  );
}

export default Pool;
