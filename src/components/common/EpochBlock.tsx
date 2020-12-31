import React from 'react';
import IconHeader from './IconHeader';
import MainButton from './MainButton';
import { useHistory } from 'react-router-dom';

type EpochBlockProps = {
  epoch: string
}

function EpochBlock({ epoch }: EpochBlockProps) {
  let history = useHistory();
  return (
    <MainButton
      title="Next Epoch"
      description={epoch}
      icon={<i className="fas fa-balance-scale"/>}
      onClick={() => {
        history.push('/governance/');
      }}
    />
  );
}

export default EpochBlock;
