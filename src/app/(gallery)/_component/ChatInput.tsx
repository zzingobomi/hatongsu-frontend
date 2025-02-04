import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { cn } from "@/lib/utils";
import { useChatStore } from "@/app/stores/ChatStore";

export function ChatInput() {
  const { register, handleSubmit, reset } = useForm<{ message: string }>();

  const onSubmit = ({ message }: { message: string }) => {
    if (message.trim()) {
      useChatStore.getState().sendMessage(message);
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-2 items-center">
      <Input
        {...register("message", { required: true })}
        placeholder="Type a message..."
        className={cn(
          "flex-1 bg-background/95 backdrop-blur-sm",
          "border-primary/20 hover:border-primary/30",
          "focus-visible:ring-primary/30"
        )}
      />
      <Button type="submit" className="bg-primary/90 hover:bg-primary/80">
        Send
      </Button>
    </form>
  );
}
