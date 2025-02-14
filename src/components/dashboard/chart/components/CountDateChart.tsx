"use client";

import LineChart from "@/components/charts/LineChart/LineChart";
import { Card } from "@/components/ui/card";
import { HiChartBar } from "react-icons/hi2";
import { addDays, differenceInDays, format, eachDayOfInterval } from "date-fns";
import { useEffect, useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { DatePicker } from "@/components/date-picker/DatePicker";
import { DateRange } from "react-day-picker";
import { lineChartOptions } from "@/components/charts/LineChart/LineChartOptions";

interface CountDateResponse {
  result: {
    date: string;
    count: number;
  }[];
}

export default function CountDateChart() {
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: addDays(new Date(), -7),
    to: new Date(),
  });
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [chartData, setChartData] = useState<
    { name: string; data: number[] }[]
  >([
    {
      name: "Count",
      data: [],
    },
  ]);
  const [categories, setCategories] = useState<string[]>([]);
  const [hasNoData, setHasNoData] = useState(false);

  const fetchData = async (startDate: string, endDate: string) => {
    setIsLoading(true);
    setError("");
    setHasNoData(false);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/album/statistic/count-date?startDate=${startDate}&endDate=${endDate}`,
        {
          credentials: "include",
        }
      );
      const data: CountDateResponse = await response.json();

      if (!data.result || Object.keys(data.result).length === 0) {
        setHasNoData(true);
        setChartData([{ name: "Count", data: [] }]);
        setCategories([]);
        return;
      }

      const allDates = eachDayOfInterval({
        start: new Date(startDate),
        end: new Date(endDate),
      });
      const countMap = new Map(
        data.result.map((item) => [item.date, item.count])
      );
      const filledData = allDates.map((date) => {
        const dateStr = format(date, "yyyy-MM-dd");
        return {
          date: dateStr,
          count: countMap.get(dateStr) || 0,
        };
      });

      setChartData([
        {
          name: "Count",
          data: filledData.map((item) => item.count),
        },
      ]);

      setCategories(filledData.map((item) => item.date));
    } catch (err) {
      setError("데이터 조회 중 오류가 발생했습니다");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!dateRange?.from || !dateRange?.to) {
      setError("날짜를 선택해주세요");
      return;
    }

    const daysDiff = differenceInDays(dateRange.to, dateRange.from);
    if (daysDiff > 14) {
      setError("날짜 범위는 최대 2주까지만 조회 가능합니다");
      return;
    }

    const startDate = format(dateRange.from, "yyyy-MM-dd");
    const endDate = format(dateRange.to, "yyyy-MM-dd");
    await fetchData(startDate, endDate);
  };

  const chartOptions = {
    ...lineChartOptions,
    xaxis: {
      ...lineChartOptions.xaxis,
      categories: categories,
    },
  };

  useEffect(() => {
    if (dateRange?.from && dateRange?.to) {
      const startDate = format(dateRange.from, "yyyy-MM-dd");
      const endDate = format(dateRange.to, "yyyy-MM-dd");
      fetchData(startDate, endDate);
    }
  }, []);

  return (
    <Card className={"border-zinc-200 p-6 dark:border-zinc-800 w-full"}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-full border border-zinc-200 text-4xl dark:border-zinc-800 dark:text-white">
            <HiChartBar className="h-5 w-5" />
          </div>
          <div>
            <h5 className="text-sm font-medium leading-5 text-zinc-950 dark:text-white">
              날짜별 이미지
            </h5>
            <p className="mt-1 text-2xl font-bold leading-6 text-zinc-950 dark:text-white">
              {chartData[0].data.reduce((acc, curr) => acc + curr, 0)}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            <DatePicker
              dateRange={dateRange}
              onDateRangeChange={setDateRange}
              className="w-[300px]"
            />
            <Button onClick={handleSearch} disabled={isLoading}>
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-200 border-t-zinc-800" />
                  조회중
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  조회
                </div>
              )}
            </Button>
          </div>
          {error && (
            <Alert variant="destructive" className="mt-2">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>
      </div>

      {/* Charts */}
      <div className="flex h-[350px] w-full flex-row sm:flex-wrap lg:flex-nowrap 2xl:overflow-hidden">
        {hasNoData ? (
          <div className="flex h-full w-full items-center justify-center text-zinc-500">
            선택한 기간에 데이터가 없습니다
          </div>
        ) : (
          <div className="h-full w-full">
            <LineChart chartData={chartData} chartOptions={chartOptions} />
          </div>
        )}
      </div>
    </Card>
  );
}
