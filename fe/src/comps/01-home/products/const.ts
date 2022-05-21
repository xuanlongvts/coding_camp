export interface I_UnitPay {
    sol: string;
    usdc: string;
}

export const unitPay: I_UnitPay = {
    sol: 'sol',
    usdc: 'usdc',
};

export const changeRate = (price: number, unit: string): number => {
    const hardRate = 70;
    const res = unit === unitPay.sol ? (price / hardRate).toFixed(1) : (price * hardRate).toFixed(1);

    return parseFloat(res);
};
