import fetch from '@/utils/request';

// 可提现金额提现信息
export const drawinfo = () => {
    return fetch.get('api/admin/v1/store/withdrawMsg');
};
// 待结算金额
export const walletinfo = () => {
    return fetch.get('api/admin/v1/store/storeWalletMsg');
};
// 提现
export const deposit = (params) => {
    return fetch.post('api/admin/v1/store/withdraw', params);
};

// 店铺金额明细
// export const listWalletFlow = (params) => {
//     return fetch.get('api/admin/v1/store/listWalletFlow', params);
// };
// 店铺金额明细查询
export const searchlistflow = (params) => {
    return fetch.get('api/admin/v1/store/listWalletFlow', params);
};


// 银行卡信息
export const bankinfo = (id) => {
    return fetch.get('api/admin/v1/store/storeBank/get', { id });
};
// 新增银行卡
export const addbankcard = (params) => {
    return fetch.post('api/admin/v1/store/storeBank/insert', params);
};
// 修改银行卡信息
export const updatabank = (params) => {
    return fetch.post('api/admin/v1/store/storeBank/update', params);
};