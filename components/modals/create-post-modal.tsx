import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";
import { useModal } from "@/hooks/use-modal-store";
import { usePostDataStore } from "@/hooks/use-post-data-store";
import { useUser } from "@clerk/nextjs";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Dialog, DialogClose, DialogContent } from "../ui/dialog";
import { Button } from "../ui/button";
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
import { Switch } from "../ui/switch";
import { EmojiPicker } from "../emoji-pickers";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useToast } from "../ui/use-toast";
import { X } from "lucide-react";
import { CldImage } from "next-cloudinary";
import { SinglePost } from "@/types";
import qs from "query-string";

const formSchema = z.object({
  imageUrl: z.string().min(1, {
    message: "Image is somehow missing.",
  }),
  caption: z
    .string()
    .max(100, {
      message: "Caption should contain less that 100 characters.",
    })
    .optional(),
  location: z.string().optional(),
  hideLikes: z.boolean().optional(),
  hideComments: z.boolean().optional(),
  isDog: z.boolean(),
});

interface UploadResultsTags {
  dog?: Array<object>;
}

export const CreatePostModal = () => {
  const { isOpen, onClose, type, data } = useModal();
  const { uploadedData } = usePostDataStore();
  const { user } = useUser();
  const [locations, setLocations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const post: SinglePost = data;

  const image = post?.imageUrl || uploadedData?.info?.secure_url;
  const uploadResultsTags: UploadResultsTags =
    uploadedData.info?.info?.detection?.object_detection?.data?.coco?.tags;
  const isDog = !!uploadResultsTags?.["dog"] ?? false;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageUrl: image,
      caption: post?.caption ?? "",
      location: post?.location ?? "",
      hideLikes: post?.hideLikes ?? false,
      hideComments: post?.hideComments ?? false,
      isDog: post ? true : isDog,
    },
  });

  useEffect(() => {
    // Fetch locations when the component mounts
    const fetchLocations = async () => {
      try {
        const response = await axios.get(
          "https://restcountries.com/v3.1/all?fields=name,flags"
        );

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

  const { handleSubmit, setValue } = form;
  const isModalOpen = isOpen && type === "createPost";

  useEffect(() => {
    setValue("imageUrl", image);
    setValue("isDog", isDog);
    setValue("caption", post?.caption ?? "");
    setValue("location", post?.location ?? "");
    setValue("hideLikes", post?.hideLikes ?? false);
    setValue("hideComments", post?.hideComments ?? false);
  }, [image, isDog, setValue]);

  const handleClose = () => {
    onClose();
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);

      if (!post) {
        if (!values.isDog) {
          toast({
            description:
              "We appreciate your participation, but we kindly request that only photos featuring dogs be posted.",
            duration: 3000,
          });
          return;
        }

        await axios.post("/api/posts/create", values);

        toast({
          description: "Posted successfully.",
          duration: 3000,
        });
      } else {
        const url = qs.stringifyUrl({
          url: "/api/posts/update",
          query: {
            postId: post.id,
            authorId: post.userId,
          },
        });

        await axios.patch(url, values);

        toast({
          description: "Updated successfully.",
          duration: 3000,
        });
      }
      handleClose();
      router.push(`/${user?.id}`);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast({
        description: "Something went wrong, try again.",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isModalOpen} onOpenChange={handleClose}>
      <DialogContent className="p-0 gap-0 sm:w-[30rem] w-[80%] h-[95%] lg:w-[65rem] overflow-y-auto border-0">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="flex justify-between items-center border-b-[1px]">
              <DialogClose className="pl-1">
                <X className="w-5 h-5 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground outline-none cursor-pointer" />
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
                {post ? "Edit" : "Share"}
              </Button>
            </div>
            <div className="flex lg:flex-row flex-col">
              <div className="aspect-auto flex justify-center items-center bg-black relative mx-auto z-50">
                <CldImage
                  key={image}
                  src={image}
                  alt="Image"
                  width="600"
                  height="658"
                  crop="fill"
                  className="object-cover relative"
                  priority
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
                            disabled={isLoading}
                            rows={6}
                            placeholder="Write a caption..."
                            {...field}
                          />
                        </FormControl>
                        <EmojiPicker
                          className="text-muted-foreground h-6 w-6 cursor-pointer hover:opacity-95 transition ml-2 pb-1"
                          onChange={(emoji: string) =>
                            field.onChange(`${field.value} ${emoji}`)
                          }
                        />
                        <FormMessage className="pl-3 pb-3" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Select
                            disabled={isLoading}
                            onValueChange={field.onChange}
                          >
                            <SelectTrigger>
                              <SelectValue
                                placeholder={
                                  post ? post.location : "All location"
                                }
                              />
                            </SelectTrigger>
                            <SelectContent>
                              {locations
                                .slice()
                                .sort(
                                  (a: { name: string }, b: { name: string }) =>
                                    a.name.localeCompare(b.name)
                                )
                                .map(
                                  (loc: { flag: string; name: string }, i) => (
                                    <SelectItem key={i} value={loc.name}>
                                      <Image
                                        src={loc.flag}
                                        alt="Flag"
                                        width={20}
                                        height={20}
                                        className="inline mr-2"
                                      />
                                      <span>{loc.name}</span>
                                    </SelectItem>
                                  )
                                )}
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
                                disabled={isLoading}
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
                                disabled={isLoading}
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
