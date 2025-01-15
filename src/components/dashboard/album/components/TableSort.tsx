import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface TableSortProps {
  sort: string;
  onSortChange: (sort: string) => void;
}

interface SortOption {
  value: string;
  label: string;
}

const sortOptions: SortOption[] = [
  { value: "dateTime", label: "촬영 시간" },
  { value: "dateTimeOriginal", label: "원본 촬영 시간" },
  { value: "dateTimeDigitized", label: "디지털화 시간" },
  { value: "createdAt", label: "생성시간" },
  { value: "updatedAt", label: "수정시간" },
];

export function TableSort({ sort, onSortChange }: TableSortProps) {
  // 현재 정렬 상태 파싱
  const currentSort = JSON.parse(sort)[0];
  const currentField = currentSort.orderBy;
  const currentOrder = currentSort.order;

  // 필드 변경 핸들러
  const handleFieldChange = (field: string) => {
    const newSort = JSON.stringify([
      {
        orderBy: field,
        order: currentOrder,
      },
    ]);
    onSortChange(newSort);
  };

  // 정렬 순서 변경 핸들러
  const handleOrderChange = (order: string) => {
    const newSort = JSON.stringify([
      {
        orderBy: currentField,
        order: order,
      },
    ]);
    onSortChange(newSort);
  };

  return (
    <div className="flex items-center gap-4">
      <Select value={currentField} onValueChange={handleFieldChange}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="정렬 기준 선택" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <RadioGroup
        value={currentOrder}
        onValueChange={handleOrderChange}
        className="flex items-center space-x-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="desc" id="desc" />
          <Label htmlFor="desc">내림차순</Label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="asc" id="asc" />
          <Label htmlFor="asc">오름차순</Label>
        </div>
      </RadioGroup>
    </div>
  );
}
