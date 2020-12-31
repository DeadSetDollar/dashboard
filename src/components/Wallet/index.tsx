import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import BigNumber from 'bignumber.js';
import {
  getBalanceBonded,
  getBalanceOfStaged, getFluidUntil, getLockedUntil,
  getStatusOf, getTokenAllowance,
  getTokenBalance, getTokenTotalSupply,
} from '../../utils/infura';
import {DED, DEDS} from "../../constants/tokens";
import {DAO_EXIT_LOCKUP_EPOCHS} from "../../constants/values";
import { toTokenUnitsBN } from '../../utils/number';

import AccountPageHeader from "./Header";
import WithdrawDeposit from "./WithdrawDeposit";
import BondUnbond from "./BondUnbond";
import IconHeader from "../common/IconHeader";
import {getPoolAddress} from "../../utils/pool";
import {DollarPool} from "../../constants/contracts";

function Wallet({ user }: {user: string}) {
  const { override } = useParams();
  if (override) {
    user = override;
  }

  const [userDEDBalance, setUserDEDBalance] = useState(new BigNumber(0));
  const [userDEDAllowance, setUserDEDAllowance] = useState(new BigNumber(0));
  const [userDEDSBalance, setUserDEDSBalance] = useState(new BigNumber(0));
  const [totalDEDSSupply, setTotalDEDSSupply] = useState(new BigNumber(0));
  const [userStagedBalance, setUserStagedBalance] = useState(new BigNumber(0));
  const [userBondedBalance, setUserBondedBalance] = useState(new BigNumber(0));
  const [userStatus, setUserStatus] = useState(0);
  const [userStatusUnlocked, setUserStatusUnlocked] = useState(0);
  const [lockup, setLockup] = useState(0);

  //Update User balances
  useEffect(() => {
    if (user === '') {
      setUserDEDBalance(new BigNumber(0));
      setUserDEDAllowance(new BigNumber(0));
      setUserDEDSBalance(new BigNumber(0));
      setTotalDEDSSupply(new BigNumber(0));
      setUserStagedBalance(new BigNumber(0));
      setUserBondedBalance(new BigNumber(0));
      setUserStatus(0);
      return;
    }
    let isCancelled = false;

    async function updateUserInfo() {
      const [
        dedBalance, dedAllowance, dedsBalance, dedsSupply, stagedBalance, bondedBalance, status, poolAddress,
        fluidUntilStr, lockedUntilStr
      ] = await Promise.all([
        getTokenBalance(DED.addr, user),
        getTokenAllowance(DED.addr, user, DEDS.addr),
        getTokenBalance(DEDS.addr, user),
        getTokenTotalSupply(DEDS.addr),
        getBalanceOfStaged(DEDS.addr, user),
        getBalanceBonded(DEDS.addr, user),
        getStatusOf(DEDS.addr, user),
        getPoolAddress(),

        getFluidUntil(DEDS.addr, user),
        getLockedUntil(DEDS.addr, user),
      ]);

      const userDEDBalance = toTokenUnitsBN(dedBalance, DED.decimals);
      const userDEDSBalance = toTokenUnitsBN(dedsBalance, DEDS.decimals);
      const totalDEDSSupply = toTokenUnitsBN(dedsSupply, DEDS.decimals);
      const userStagedBalance = toTokenUnitsBN(stagedBalance, DEDS.decimals);
      const userBondedBalance = toTokenUnitsBN(bondedBalance, DEDS.decimals);
      const userStatus = parseInt(status, 10);
      const fluidUntil = parseInt(fluidUntilStr, 10);
      const lockedUntil = parseInt(lockedUntilStr, 10);

      if (!isCancelled) {
        setUserDEDBalance(new BigNumber(userDEDBalance));
        setUserDEDAllowance(new BigNumber(dedAllowance));
        setUserDEDSBalance(new BigNumber(userDEDSBalance));
        setTotalDEDSSupply(new BigNumber(totalDEDSSupply));
        setUserStagedBalance(new BigNumber(userStagedBalance));
        setUserBondedBalance(new BigNumber(userBondedBalance));
        setUserStatus(userStatus);
        setUserStatusUnlocked(Math.max(fluidUntil, lockedUntil))
        setLockup(poolAddress === DollarPool ? DAO_EXIT_LOCKUP_EPOCHS : 1);
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
      <IconHeader icon={<i className="fas fa-dot-circle"/>} text="DAO"/>

      <AccountPageHeader
        accountDEDBalance={userDEDBalance}
        accountDEDSBalance={userDEDSBalance}
        totalDEDSSupply={totalDEDSSupply}
        accountStagedBalance={userStagedBalance}
        accountBondedBalance={userBondedBalance}
        accountStatus={userStatus}
        unlocked={userStatusUnlocked}
      />

      <WithdrawDeposit
        user={user}
        balance={userDEDBalance}
        allowance={userDEDAllowance}
        stagedBalance={userStagedBalance}
        status={userStatus}
      />

      <BondUnbond
        staged={userStagedBalance}
        bonded={userBondedBalance}
        status={userStatus}
        lockup={lockup}
      />
    </>
  );
}

export default Wallet;
