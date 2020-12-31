import React, { useState, useEffect } from 'react';
import { Header } from '@aragon/ui';

import {
  getCouponPremium,
  getPoolTotalClaimable, getPoolTotalRewarded, getTokenBalance,
  getTokenTotalSupply, getTotalBonded, getTotalCoupons, getTotalDebt, getTotalRedeemable, getTotalStaged,
} from '../../utils/infura';
import {DED, DEDS, UNI} from "../../constants/tokens";
import {toTokenUnitsBN} from "../../utils/number";
import BigNumber from "bignumber.js";
import RegulationHeader from "./Header";
import RegulationHistory from "./RegulationHistory";
import IconHeader from "../common/IconHeader";
import {getPoolAddress} from "../../utils/pool";

const ONE_COUPON = new BigNumber(10).pow(18);

function Regulation({ user }: {user: string}) {

  const [totalSupply, setTotalSupply] = useState(new BigNumber(0));
  const [totalBonded, setTotalBonded] = useState(new BigNumber(0));
  const [totalStaged, setTotalStaged] = useState(new BigNumber(0));
  const [totalRedeemable, setTotalRedeemable] = useState(new BigNumber(0));
  const [poolLiquidity, setPoolLiquidity] = useState(new BigNumber(0));
  const [poolTotalRewarded, setPoolTotalRewarded] = useState(new BigNumber(0));
  const [poolTotalClaimable, setPoolTotalClaimable] = useState(new BigNumber(0));
  const [totalDebt, setTotalDebt] = useState(new BigNumber(0));
  const [totalCoupons, setTotalCoupons] = useState(new BigNumber(0));
  const [couponPremium, setCouponPremium] = useState(new BigNumber(0));

  useEffect(() => {
    let isCancelled = false;

    async function updateUserInfo() {
      const poolAddress = await getPoolAddress();

      const [
        totalSupplyStr,
        totalBondedStr, totalStagedStr, totalRedeemableStr,
        poolLiquidityStr, poolTotalRewardedStr, poolTotalClaimableStr,
        totalDebtStr, totalCouponsStr
      ] = await Promise.all([
        getTokenTotalSupply(DED.addr),

        getTotalBonded(DEDS.addr),
        getTotalStaged(DEDS.addr),
        getTotalRedeemable(DEDS.addr),

        getTokenBalance(DED.addr, UNI.addr),
        getPoolTotalRewarded(poolAddress),
        getPoolTotalClaimable(poolAddress),

        getTotalDebt(DEDS.addr),
        getTotalCoupons(DEDS.addr),
      ]);

      if (!isCancelled) {
        setTotalSupply(toTokenUnitsBN(totalSupplyStr, DED.decimals));

        setTotalBonded(toTokenUnitsBN(totalBondedStr, DED.decimals));
        setTotalStaged(toTokenUnitsBN(totalStagedStr, DED.decimals));
        setTotalRedeemable(toTokenUnitsBN(totalRedeemableStr, DED.decimals));

        setPoolLiquidity(toTokenUnitsBN(poolLiquidityStr, DED.decimals));
        setPoolTotalRewarded(toTokenUnitsBN(poolTotalRewardedStr, DED.decimals));
        setPoolTotalClaimable(toTokenUnitsBN(poolTotalClaimableStr, DED.decimals));

        setTotalDebt(toTokenUnitsBN(totalDebtStr, DED.decimals));
        setTotalCoupons(toTokenUnitsBN(totalCouponsStr, DED.decimals));

        if (new BigNumber(totalDebtStr).isGreaterThan(ONE_COUPON)) {
          const couponPremiumStr = await getCouponPremium(DEDS.addr, ONE_COUPON)
          setCouponPremium(toTokenUnitsBN(couponPremiumStr, DED.decimals));
        } else {
          setCouponPremium(new BigNumber(0));
        }
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
      <IconHeader icon={<i className="fas fa-chart-area"/>} text="Supply Distribution"/>

      <RegulationHeader
        totalSupply={totalSupply}

        totalBonded={totalBonded}
        totalStaged={totalStaged}
        totalRedeemable={totalRedeemable}

        poolLiquidity={poolLiquidity}
        poolRewarded={poolTotalRewarded}
        poolClaimable={poolTotalClaimable}

        totalDebt={totalDebt}
        totalCoupons={totalCoupons}
        couponPremium={couponPremium}
      />

      <Header primary="Supply History" />

      <RegulationHistory
        user={user}
      />
    </>
  );
}

export default Regulation;
