export const toPriceYuan = (value: number, cent: number = 2): string => {
  let price = value / 100;
  return price.toFixed(cent);
};
