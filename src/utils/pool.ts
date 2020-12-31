import { getPool } from "./infura";
import { DEDS } from "../constants/tokens";
import {DollarPool} from "../constants/contracts";

export async function getPoolAddress(): Promise<string> {
  const pool = await getPool(DEDS.addr);
  if (pool.toLowerCase() === DollarPool.toLowerCase()) {
    return DollarPool;
  }

  throw new Error("Unrecognized Pool Address");
}
