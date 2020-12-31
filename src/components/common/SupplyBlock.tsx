import React from 'react';
import MainButton from './MainButton';
import { useHistory } from 'react-router-dom';

type SupplyBlockProps = {
  supply: string
}

function SupplyBlock({ supply }: SupplyBlockProps) {
  let history = useHistory();
  return (
    <>
      <MainButton
            title="Total Supply"
            description={"Ð " + supply}
            icon={<i className="fas fa-circle-notch"/>}
            onClick={() => {
              history.push('/supply/');
            }}
          />
    </>
  );
}

export default SupplyBlock;
