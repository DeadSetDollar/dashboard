import BigNumber from 'bignumber.js';

// eslint-disable-next-line import/prefer-default-export
export const EPOCH_START = 1609459200;
export const EPOCH_PERIOD = 60 * 60;
export const EPOCH_ADVANCE_REWARD = 250;
export const MAX_UINT256 = new BigNumber(2).pow(256).minus(1);
export const GOVERNANCE_QUORUM = new BigNumber('0.20');
export const GOVERNANCE_PROPOSAL_THRESHOLD = new BigNumber('0.005');
export const COUPON_EXPIRATION = 90;
export const DAO_EXIT_LOCKUP_EPOCHS = 96;
export const POOL_EXIT_LOCKUP_EPOCHS = 48;
