"use client";

import { FilesIcon } from "lucide-react";
import { Button } from "../ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { useRef, useState } from "react";
import { QuoteDetails } from "@/types";
import { useMutation } from "@tanstack/react-query";
import { requestQuoteAction } from "@/actions/request-quote";

type Delivery = "24 Hours" | "3 Days" | "7 Days" | "Other";

const allowedFileTypes = [
  "image/jpeg",
  "image/png",
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
];

const maxFileSize = 5 * 1024 * 1024; // 5 MB

export default function RequestQuote({
  sellerId,
  serviceId,
  serviceName,
}: {
  sellerId: string;
  serviceId: string;
  serviceName: string;
}) {
  const deliveries: Delivery[] = ["24 Hours", "3 Days", "7 Days", "Other"];

  const [delivery, setDelivery] = useState("24 Hours");
  const [budget, setBudget] = useState(0);
  const [description, setDescription] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const formValid = description.length > 0 && budget > 0;

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const newFiles = Array.from(files).filter((file) => {
        if (uploadedFiles.length + files.length > 3) {
          alert("You can only upload a maximum of 3 files.");
          return false;
        }
        if (!allowedFileTypes.includes(file.type)) {
          alert(`File type ${file.type} is not allowed.`);
          return false;
        }
        if (file.size > maxFileSize) {
          alert(`File ${file.name} exceeds the maximum size of 5 MB.`);
          return false;
        }
        return true;
      });
      setUploadedFiles([...uploadedFiles, ...newFiles]);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const removeFile = (index: number) => {
    const newFiles = [...uploadedFiles];
    newFiles.splice(index, 1);
    setUploadedFiles(newFiles);
  };

  function submitHandler(e: React.FormEvent) {
    e.preventDefault();
    const quoteDetails: QuoteDetails = {
      serviceId,
      serviceName,
      description,
      delivery: delivery as Delivery,
      budget,
      settled: false,
      status: "pending",
      // files: uploadedFiles,
    };
    console.log(quoteDetails);

    // create form data with array of files
    const fileFormData = new FormData();
    uploadedFiles.forEach((file) => {
      fileFormData.append("files", file);
    });
    // console.log(Array.from(fileFormData.values()));
    mutate({ sellerId, quoteDetails, serviceName, files: fileFormData });
  }

  const { mutate, isPending } = useMutation({
    mutationFn: requestQuoteAction,
    onSuccess: (data) => {
      if (data.error || !data.success) throw new Error(data.error as string);

      alert("quote sent successfully");
      // router.push(`/chats/${data.id}`); //! think about this later

      // reset everthing
      setDescription("");
      setBudget(0);
      setDelivery("24 Hours");
      setUploadedFiles([]);
    },
    onError: (err) => {
      console.log(err);
      alert(err.message);
    },
  });

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Send a Quote</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[700px] max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Request A Quote</DialogTitle>
          <DialogDescription>
            Please provide your request details below
          </DialogDescription>
        </DialogHeader>

        <form className="space-y-4" onSubmit={submitHandler}>
          <div className="space-y-2">
            <Label htmlFor="description">
              Describe the service you&apos;re looking to purchase - please be
              as detailed as possible:
            </Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              id="description"
              placeholder="Type your message here."
              className="min-h-[100px]"
              maxLength={2500}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <div>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={handleFileUpload}
                  multiple
                  accept={allowedFileTypes.join(",")}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={triggerFileUpload}
                >
                  <FilesIcon className="mr-2 h-4 w-4" />
                  Attach Files
                </Button>
                <div className="mt-2">
                  {uploadedFiles.map((file, index) => (
                    <div key={index} className="flex items-center">
                      <span
                        // href={file.webkitRelativePath}
                        className="text-blue-500 hover:underline mr-2"
                      >
                        {file.name}
                      </span>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-red-500"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              <span>{description.length}/2500</span>
            </div>
          </div>
          <div className="space-y-2">
            <Label>
              Once you place your order, when would you like your service
              delivered?
            </Label>
            <div className="flex space-x-2">
              {deliveries.map((d, i) => (
                <Button
                  key={i}
                  type="button"
                  variant={d === delivery ? "default" : "outline"}
                  onClick={() => setDelivery(d as Delivery)}
                >
                  {d}
                </Button>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="budget">
              What is your budget for this service?
            </Label>
            <Input
              value={budget}
              onChange={(e) => setBudget(+e.target.value)}
              type="number"
              min={1}
              id="budget"
              placeholder="A$"
            />
            <span className="text-sm text-muted-foreground">
              Convert to USD
            </span>
          </div>
          <DialogFooter>
            <Button
              className="ml-auto text-white"
              disabled={!formValid || isPending}
            >
              Submit Request
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
