import { Dialog, DialogContent } from "../ui/dialog";
import { useSecondModal } from "@/hooks/use-second-modal-store";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { useState } from "react";
import qs from "query-string";
import axios from "axios";
import { useToast } from "../ui/use-toast";

export const ReportModal = () => {
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const { isOpen, onClose, type, data } = useSecondModal();
  const { toast } = useToast();
  const postId: string = data;

  const isModalOpen = isOpen && type === "report";

  const handleClose = () => {
    onClose();
    setSelectedReason("");
  };

  const options = [
    "It's spam",
    "Nudity or sexual activity",
    "Hate speech or symbols",
    "Violence or dangerous organizations",
    "Safe of illegal or regulated goods",
    "Bullying or harassment",
    "Intellectual property violation",
    "Suicide or self-injury",
    "Eating disorders",
    "Scam or fraud",
    "False information",
    "I just don't like it",
  ];

  const onSelectChange = (value: string) => {
    setSelectedReason(value);
  };

  const onReport = async () => {
    try {
      const url = qs.stringifyUrl({
        url: "/api/report",
        query: {
          reason: selectedReason,
          postId,
        },
      });

      await axios.post(url);

      toast({
        title: "Reported successfully.",
        variant: "default",
        duration: 3000,
      });
    } catch (error: any) {
      console.error("error in client [REPORT-MODAL]", error);

      if (error.response.status === 429) {
        toast({
          title: "Rate limit exceeded, try again later.",
          variant: "default",
          duration: 3000,
        });
      }
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="w-[70%] sm:w-[25rem] py-3 px-0">
        <div className="flex flex-col">
          <div className="flex justify-center border-b-[1px] pb-[0.580rem]">
            <h1 className="font-semibold">Report</h1>
          </div>
          <div className="p-3 pb-0 flex flex-col gap-3">
            <h1 className="font-semibold">Why are you reporting this post?</h1>
            <Select onValueChange={onSelectChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a reason" />
              </SelectTrigger>
              <SelectContent>
                {options.map((option, index) => (
                  <SelectItem key={index} value={option.toLowerCase()}>
                    {option}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              onClick={onReport}
              disabled={!selectedReason}
              variant="destructive"
            >
              Report
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
