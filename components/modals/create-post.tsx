import { useModal } from "@/hooks/use-modal-store";
import { Dialog, DialogClose, DialogContent } from "../ui/dialog";
import { X } from "lucide-react";
import { Button } from "../ui/button";
import { usePostDataStore } from "@/hooks/use-post-data-store";
import Image from "next/image";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useUser } from "@clerk/nextjs";
import { ProfilePicture } from "../profile-picture";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Textarea } from "../ui/textarea";
import { Input } from "../ui/input";
import { Switch } from "../ui/switch";
import { EmojiPicker } from "../emoji-pickers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useEffect, useState } from "react";
import axios from "axios";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  imageUrl: z.string().min(1, {
    message: "Image is somehow missing.",
  }),
  caption: z.string().max(2200, {
    message: "Caption should contain less that 2200 characters.",
  }),
  location: z.string().optional(),
  hideLikes: z.boolean().optional(),
  hideComments: z.boolean().optional(),
});

export const CreatePostModal = () => {
  const { isOpen, onClose, type } = useModal();
  const { uploadedData } = usePostDataStore();
  const storedData = localStorage.getItem("uploadedData");
  const data = storedData ? JSON.parse(storedData) : uploadedData;
  const { user } = useUser();
  const [locations, setLocations] = useState([]);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageUrl: uploadedData?.info?.secure_url || data?.info?.secure_url,
      caption: "",
      location: "",
      hideLikes: false,
      hideComments: false,
    },
  });

  useEffect(() => {
    // Fetch locations when the component mounts
    const fetchLocations = async () => {
      try {
        const response = await axios.get("https://restcountries.com/v3.1/all");

        // Extract locations from the response
        const filteredLocations = response.data.map(
          (country: { name: { common: string }; flags: { png: string } }) => ({
            name: country.name.common,
            flag: country.flags.png,
          })
        );

        // Update the state with the fetched locations
        setLocations(filteredLocations);
      } catch (error) {
        console.error("Error fetching locations:", error);
      }
    };

    fetchLocations();
  }, []);

  const { handleSubmit } = form;
  const isLoading = form.formState.isSubmitting;

  const isModalOpen = isOpen && type === "createPost";

  const handleClose = () => {
    onClose();
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.post("/api/posts/create", values);

      toast({
        description: "Posted successfully.",
        duration: 4000,
      });

      router.push(`/${user?.id}`);
      router.refresh();
    } catch (error) {
      console.log(error);
      toast({
        description: "Something went wrong.",
        duration: 4000,
      });
    }
  };

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent
        aria-disabled={isLoading}
        className="p-0 gap-0 sm:w-[30rem] w-[15rem] h-[95%] lg:w-[65rem] overflow-y-auto"
      >
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex justify-between items-center border-b-[1px]">
              <DialogClose className="pl-1">
                <X className="w-5 h-5 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground outline-none cursor-pointer" />
              </DialogClose>
              <h1 className="font-semibold font-lg pl-5 md:pl-10">
                Share to...
              </h1>
              <Button
                disabled={isLoading}
                type="submit"
                className="text-amber-600 p-3"
                variant="ghost"
              >
                Share
              </Button>
            </div>
            <div className="flex lg:flex-row flex-col">
              <div className="lg:w-[40rem] lg:h-[41.160rem] sm:h-[20rem] sm:w-[20rem] w-[10rem] h-[10rem] aspect-auto flex justify-center items-center bg-black relative mx-auto">
                <Image
                  src={uploadedData?.info?.secure_url || data?.info?.secure_url}
                  alt="Image"
                  fill
                  objectFit="cover"
                  className="object-cover"
                />
              </div>
              <div className="flex flex-col flex-1 overflow-y-auto">
                <div className="flex items-center p-3 gap-3">
                  <ProfilePicture className="w-8 h-8" />
                  <span className="font-semibold text-sm">
                    {user?.username}
                  </span>
                </div>
                <div>
                  <FormField
                    control={form.control}
                    name="caption"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl className="relative">
                          <Textarea
                            rows={6}
                            placeholder="Write a caption..."
                            {...field}
                          />
                        </FormControl>
                        <EmojiPicker
                          onChange={(emoji: string) =>
                            field.onChange(`${field.value} ${emoji}`)
                          }
                        />
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select onValueChange={field.onChange}>
                            <SelectTrigger>
                              <SelectValue placeholder="All location" />
                            </SelectTrigger>
                            <SelectContent>
                              {locations
                                .slice()
                                .sort(
                                  (a: { name: string }, b: { name: string }) =>
                                    a.name.localeCompare(b.name)
                                )
                                .map((loc: { flag: string; name: string }) => (
                                  <SelectItem key={loc.name} value={loc.name}>
                                    <Image
                                      src={loc.flag}
                                      alt="Flag"
                                      width={20}
                                      height={20}
                                      className="inline mr-2"
                                    />
                                    <span>{loc.name}</span>
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="flex flex-col gap-4 pb-4">
                    <FormField
                      control={form.control}
                      name="hideLikes"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between px-3 pt-3 gap-2">
                            <FormLabel className="font-normal">
                              Hide like counts on this post
                            </FormLabel>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </div>
                          <FormDescription className="text-xs text-muted-foreground p-3 py-0">
                            Only you will see the total number of likes and
                            views on this post. You can change this later by
                            going to the ··· menu at the top of the post. To
                            hide like counts on other people's posts, go to your
                            account settings.
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="hideComments"
                      render={({ field }) => (
                        <FormItem>
                          <div className="flex items-center justify-between px-3 pt-3 gap-2">
                            <FormLabel className="font-normal">
                              Turn off commenting
                            </FormLabel>
                            <FormControl>
                              <Switch
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </div>
                          <FormDescription className="text-xs text-muted-foreground p-3 py-0">
                            You can change this later by going to the ··· menu
                            at the top of your post.
                          </FormDescription>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
