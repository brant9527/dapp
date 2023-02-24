import style from "./index.module.scss";
const HomePriceMid = () => {
  const coins = [
    {
      coin: "BTC",
      baseCoin: "USDT",
      raise: 0.12,
      price: 23212,
    },
    {
      coin: "BTC",
      baseCoin: "USDT",
      raise: -0.12,
      price: 23212,
    },
    {
      coin: "BTC",
      baseCoin: "USDT",
      raise: -0.12,
      price: 23212,
    },
  ];
  return (
    <div className={style.root}>
      <div className="priceMid">
        {coins.map((item, i) => {
          return (
            <div className="item-wrap" key={i}>
              <div className="top">
                <div className="coin">{item.coin}</div>
                <div className="baseCoin">/{item.baseCoin}</div>
                <div
                  className={[item.raise > 0 ? "up" : "down", " raise"].join(
                    " "
                  )}
                >
                  {item.raise}%
                </div>
              </div>
              <div className={`center ${item.raise > 0 ? "up" : "down"}`}>
                {item.price}
              </div>
              <div className="bottom"></div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
export default HomePriceMid;
