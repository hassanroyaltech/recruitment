import { AnalyticsChartTypesEnum } from '../../../enums';

export const colorPallete = [
  '#4851C8',
  '#5159CB',
  '#5A61CE',
  '#6369D1',
  '#6C71D4',
  '#7579D7',
  '#7E81DA',
  '#8789DD',
  '#9091E0',
  '#9999E3',
  '#A2A1E6',
  '#A2A1E6',
  '#B4B1EC',
  '#BDB9EF',
  '#C6C1F2',
  '#CFC9F5',
  '#D8D1F8',
  '#DADCF4',
];

export const colors_array = ['#4851C8', '#9492FA', '#DADCF4'];

export const getColorsPerLabel = (labels) => {
  const intervalVal = Math.ceil(colorPallete.length / labels.length);
  return labels.map(
    (label, idx) =>
      colorPallete[idx * intervalVal] || colorPallete[colorPallete.length - 1],
  );
};

export const ChartOptions = {
  [AnalyticsChartTypesEnum.DOUGHNUT.value]: {
    responsive: true,
    aspectRatio: 1.7,
  },
  [AnalyticsChartTypesEnum.LINE.value]: {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          display: false,
        },
        grid: {
          display: false,
        },
      },
    },
  },
  [AnalyticsChartTypesEnum.BAR.value]: {
    responsive: true,
    legend: {
      display: false,
    },
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        ticks: {
          display: false,
        },
        grid: {
          display: false,
        },
      },
    },
  },
};

export const GetDataFormatFromChartType = ({ chart_type, data, t }) => {
  if (
    AnalyticsChartTypesEnum.CARD.value === chart_type
    || AnalyticsChartTypesEnum.MULTIPLE_CARDS.value === chart_type
    || AnalyticsChartTypesEnum.TABLE.value === chart_type
  )
    return data;
  else if (
    AnalyticsChartTypesEnum.DOUGHNUT.value === chart_type
    || AnalyticsChartTypesEnum.BAR.value === chart_type
  )
    return {
      labels: data.labels
        ? data.labels.map((it) => t(it))
        : Object.keys(data).map((it) => t(it)),
      datasets: [
        {
          data: data.values
            ? data.values?.map((it) => parseInt(it))
            : Object.values(data),
          backgroundColor: getColorsPerLabel(
            data.labels ? data.labels : Object.keys(data),
          ),
        },
      ],
    };
  else if (AnalyticsChartTypesEnum.LINE.value === chart_type)
    return {
      labels: data.labels.map((it) => t(it)),
      datasets: data.values.map((it, idx) => ({
        ...it,
        borderColor: colors_array[idx],
        fill: false,
        label: t(it.label),
        tension: 0.4,
      })),
    };
};
