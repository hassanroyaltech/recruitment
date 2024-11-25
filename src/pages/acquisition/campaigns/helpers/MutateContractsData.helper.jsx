import moment from 'moment/moment';
import { GlobalDateFormat } from '../../../../helpers';

export const MutateContractsDataHelper = (data) => {
  if (Array.isArray(data))
    return data.map((item) => ({
      is_contract: true,
      uuid: item.contract_id,
      contract_id: item.contract_id,
      id: item.contract_id,
      channel_id: item.channel_id,
      channel: item.channel,
      product_id: item.product?.product_id || null,
      vendor_type: null, // ex 1
      vendor_id: null, // ex 2367
      title: item.product?.title || item.channel?.name || item.alias,
      description: null,
      // vendor_cost: item.purchase_price || 0,
      vendor_cost: 0,
      logo: {
        logo: item.channel?.logo_url?.[0]?.url,
        logo_square: item.channel?.logo_square_url?.[0]?.url,
        logo_rectangle: item.channel?.logo_rectangle_url?.[0]?.url,
      },
      type: item.channel?.type || null,
      period: null,
      range: 'days',
      expiry_date:
        (item.expiry_date
          && moment(item.expiry_date).locale('en').format(GlobalDateFormat))
        || null,
      // percentage_cost: item.purchase_price || null,
      // final_cost: item.purchase_price || null,
      percentage_cost: 0,
      final_cost: 0,
      credit: item.credits || null,
    }));

  return [];
};
