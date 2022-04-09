<script lang="ts">
  import config from '$lib/config.json';
  import { onMount } from 'svelte';
  import { getMonthlyRewardsStats } from '$lib/api/stats';
  import type { MonthlyStatsListType } from '$lib/api/types/monthly-stats.type';
  import Skeleton from '$lib/components/global/skeleton.svelte';
  import { formatThousand, toAda } from '$lib/utils/helper.utils';

  let element;
  const fromDate = new Date();
  fromDate.setUTCMonth(fromDate.getUTCMonth() - 12);

  let pMonthlyRewards: Promise<MonthlyStatsListType> = Promise.reject();

  onMount(async () => {
    pMonthlyRewards = getMonthlyRewardsStats(fromDate.getUTCFullYear(), fromDate.getUTCMonth() + 1);

    const ApexModule = await import('apexcharts');
    const ApexCharts = ApexModule.default;

    let height = '350px';
    let labelColor = '#b5b5c3';
    let borderColor = '#b5b5c3';
    let baseColor = '#7cb342';
    let lightColor = '#c5e1a5';

    let options = {
      series: [],
      chart: {
        fontFamily: 'inherit',
        type: 'area',
        height: height,
        toolbar: {
          show: false
        }
      },
      plotOptions: {},
      dataLabels: {
        enabled: false
      },
      fill: {
        type: 'solid',
        opacity: 0.75
      },
      stroke: {
        curve: 'smooth',
        show: true,
        width: 3,
        colors: [baseColor]
      },
      xaxis: {
        axisBorder: {
          show: false
        },
        axisTicks: {
          show: true
        },
        labels: {
          style: {
            colors: labelColor,
            fontSize: '12px'
          }
        },
        crosshairs: {
          position: 'front',
          stroke: {
            color: baseColor,
            width: 1,
            dashArray: 3
          }
        },
        tooltip: {
          enabled: true,
          formatter: undefined,
          offsetY: 0,
          style: {
            fontSize: '12px'
          }
        }
      },
      yaxis: {
        labels: {
          style: {
            colors: labelColor,
            fontSize: '12px'
          },
          formatter: (val) => formatThousand(val.toFixed(0))
        }
      },
      states: {
        normal: {
          filter: {
            type: 'none',
            value: 0
          }
        },
        hover: {
          filter: {
            type: 'none',
            value: 0
          }
        },
        active: {
          allowMultipleDataPointsSelection: false,
          filter: {
            type: 'none',
            value: 0
          }
        }
      },
      tooltip: {
        style: {
          fontSize: '12px'
        },
        y: {
          formatter: function (val) {
            return formatThousand(val) + ' ₳';
          }
        }
      },
      colors: [lightColor],
      grid: {
        borderColor: borderColor,
        strokeDashArray: 4,
        yaxis: {
          lines: {
            show: true
          }
        }
      },
      markers: {
        strokeColor: baseColor,
        strokeWidth: 3
      }
    };

    pMonthlyRewards
      .then(async (res) => {
        const data = res.data.map((v) => toAda(v.value));
        const categories = res.data.map(
          (v) => config.theme.shortMonths[parseInt(v.month.slice(-2)) - 1]
        );
        const newSeries = data.map((v, i) => ({ x: categories[i], y: v }));
        options.series = [
          {
            name: 'Rewards',
            data: newSeries
          }
        ];

        let chart = new ApexCharts(element, options);
        chart.render();
      })
      .catch(console.log);
  });
</script>

{#await pMonthlyRewards}
  <Skeleton height="350px" />
{:then data}
  <div bind:this="{element}" style="height: 350px;"></div>
{:catch error}
  <div class="text-center text-danger p-20">{config.messages.failedFetch}</div>
{/await}
