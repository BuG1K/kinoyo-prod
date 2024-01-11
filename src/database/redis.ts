import Redis from "ioredis";

interface State<Data> {
  data: Data
  date: string
}

const redis = new Redis(process.env.REDIS_URL || "");

const onGetRedis = async <Data, >(
  key: string,
  days: number,
  cb: () => Promise<Data | null>,
) => {
  if (redis.status !== "ready") {
    const data = await cb();

    return data;
  }

  const json = await redis.get(key);
  const state = json ? JSON.parse(json) as State<Data> : null;
  const newDate = new Date(new Date().toISOString());

  const setStateRedis = async () => {
    const newData = await cb();

    redis.set(key, JSON.stringify({ date: newDate, data: newData }));

    return newData;
  };

  if (state) {
    const newDateTime = newDate.getTime();
    const stateDateTime = new Date(state.date).getTime();
    const diffTime = newDateTime - stateDateTime;
    const diffDays = Math.round(diffTime / (1000 * 3600 * 24));

    if (diffDays >= days) {
      setStateRedis();
    }

    return state.data;
  }

  const newData = await setStateRedis();

  return newData;
};

export { redis, onGetRedis };
