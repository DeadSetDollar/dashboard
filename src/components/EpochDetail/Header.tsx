import React from 'react';

import NumberBlock from "../common/NumberBlock";
import TextBlock from "../common/TextBlock";
import { EPOCH_PERIOD, EPOCH_ADVANCE_REWARD } from "../../constants/values";

type AccountPageHeaderProps = {
  epoch: number,
  epochTime: number,
};

const EpochPageHeader = ({
  epoch, epochTime,
}: AccountPageHeaderProps) => (
  <div style={{ padding: '2%', display: 'flex', alignItems: 'center' }}>
    <div style={{ width: '25%' }}>
      <NumberBlock title="Current" num={epoch} />
    </div>
    <div style={{ width: '25%' }}>
      <NumberBlock title="Available" num={epochTime} />
    </div>
    <div style={{ width: '25%' }}>
      <TextBlock label="Period" text={EPOCH_PERIOD/(60*60) > 1 ? (EPOCH_PERIOD/(60*60)).toString() + " hours" : "1 hour"}/>
    </div>
    <div style={{ width: '25%' }}>
      <TextBlock label="Advance Reward" text={EPOCH_ADVANCE_REWARD.toString() + " Ð"}/>
    </div>
  </div>
);


export default EpochPageHeader;
