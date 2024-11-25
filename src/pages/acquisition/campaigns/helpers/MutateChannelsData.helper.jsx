export const MutateChannelsDataHelper = (data) => {
  if (Array.isArray(data))
    return data.map((item) => ({
      uuid: item.product_id,
      id: item.product_id,
      channel_uuid: item.product_id,
      description: item.description,
      credit: item.credit,
      title: item.title,
      product_id: item?.product_id || null,
      vendor_type: null, // ex 1
      vendor_id: null, // ex 2367
      vendor_cost: 0,
      logo: {
        logo: item?.logo_url?.[0]?.url,
        logo_square: item?.logo_square_url?.[0]?.url,
        logo_rectangle: item?.logo_rectangle_url?.[0]?.url,
      },
      period: item.time_to_process.period || '',
      range: item.time_to_process.range || '',
      final_cost: item?.price?.amount || 0,
      cost: item?.price?.amount || 0,
      duration: item.duration.period || '',
      type: item.type || null,
      channel: item.channel,
    }));

  return [];
};
