import React from 'react';
import { Box } from '@aragon/ui';
import Governance from '../Governance';
import EpochDetail from '../EpochDetail';

type GovernanceEpochProps = {
  user: string
};

function GovernanceEpoch({user}: GovernanceEpochProps) {
  return (
    <>
      <div style={{ padding: '1%', display: 'flex', flexWrap: 'wrap', alignItems: 'top' }}>
        <div style={{ flexBasis: '20%', flexGrow: 1, marginRight: '2%', textAlign: 'right'}}>
          <Box>
            <Governance user={user}/>
          </Box>
        </div>
        <div style={{ flexBasis: '20%', flexGrow: 1, marginRight: '2%', textAlign: 'right'}}>
          <Box>
            <EpochDetail user={user}/>
          </Box>
        </div>
      </div>
    </>
  );
}

export default GovernanceEpoch;
