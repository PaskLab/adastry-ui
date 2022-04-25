<script lang="ts">
  import config from '$lib/config.json';
  import { getContext, onDestroy, onMount } from 'svelte';
  import { getMonthlyStakeStats } from '$lib/api/stats';
  import { formatThousand, toAda } from '$lib/utils/helper.utils';
  import type { Writable } from 'svelte/store';
  import type { Unsubscriber } from 'svelte/store';

  const unsubscribers: Unsubscriber[] = [];

  let element;
  const fromDate = new Date();
  fromDate.setUTCMonth(fromDate.getUTCMonth() - 11);

  // Events
  const addAccountEvent = getContext<Writable<Date>>('add-account');

  onMount(async () => {
    const ApexModule = await import('apexcharts');
    const ApexCharts = ApexModule.default;

    let height = '350px';
    let labelColor = '#b5b5c3';
    let borderColor = '#b5b5c3';
    let baseColor = '#6610f2';
    let lightColor = '#ceb0ff';

    let options = {
      noData: {
        text: 'No Data',
        style: {
          color: labelColor,
        },
      },
      series: [],
      chart: {
        fontFamily: 'inherit',
        type: 'area',
        height: height,
        toolbar: {
          show: false,
        },
      },
      plotOptions: {},
      dataLabels: {
        enabled: false,
      },
      fill: {
        type: 'solid',
        opacity: 0.75,
      },
      stroke: {
        curve: 'smooth',
        show: true,
        width: 3,
        colors: [baseColor],
      },
      xaxis: {
        axisBorder: {
          show: false,
        },
        axisTicks: {
          show: true,
        },
        labels: {
          show: true,
          rotate: -60,
          rotateAlways: true,
          style: {
            colors: labelColor,
            fontSize: '12px',
          },
        },
        crosshairs: {
          position: 'front',
          stroke: {
            color: baseColor,
            width: 1,
            dashArray: 3,
          },
        },
        tooltip: {
          enabled: true,
          formatter: undefined,
          offsetY: 0,
          style: {
            fontSize: '12px',
          },
        },
      },
      yaxis: {
        title: {
          text: 'Total Stake (₳)',
          style: {
            color: labelColor,
          },
        },
        labels: {
          style: {
            colors: labelColor,
            fontSize: '12px',
          },
          formatter: (val) => formatThousand(val.toFixed(0)),
        },
      },
      states: {
        normal: {
          filter: {
            type: 'none',
            value: 0,
          },
        },
        hover: {
          filter: {
            type: 'none',
            value: 0,
          },
        },
        active: {
          allowMultipleDataPointsSelection: false,
          filter: {
            type: 'none',
            value: 0,
          },
        },
      },
      tooltip: {
        style: {
          fontSize: '12px',
        },
        y: {
          formatter: function (val) {
            return formatThousand(val) + ' ₳';
          },
        },
      },
      colors: [lightColor],
      grid: {
        borderColor: borderColor,
        strokeDashArray: 4,
        yaxis: {
          lines: {
            show: true,
          },
        },
      },
      markers: {
        strokeColor: baseColor,
        strokeWidth: 3,
      },
    };

    let chart = new ApexCharts(element, options);
    chart.render();

    function updateChart() {
      const pMonthlyStake = getMonthlyStakeStats(
        fromDate.getUTCFullYear(),
        fromDate.getUTCMonth() + 1,
      );

      pMonthlyStake
        .then(async (res) => {
          const data = res.data.map((v) => toAda(v.value));
          const categories = res.data.map(
            (v) => config.theme.shortMonths[parseInt(v.month.slice(-2)) - 1],
          );
          const newSeries = data.map((v, i) => ({ x: categories[i], y: v }));

          chart.updateSeries([
            {
              name: 'Active Stake (avg)',
              data: newSeries,
            },
          ]);
        })
        .catch(console.log);
    }

    unsubscribers.push(addAccountEvent.subscribe(() => updateChart()));
  });

  onDestroy(() => {
    for (const unsubscribe of unsubscribers) {
      unsubscribe();
    }
  });
</script>

<div bind:this="{element}" style="height: 350px;"></div>
