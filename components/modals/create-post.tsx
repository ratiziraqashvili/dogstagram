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

const formSchema = z.object({
  imageUrl: z.string(),
  caption: z.string().max(2200, {
    message: "Caption should contain less that 2200 characters.",
  }),
  location: z.string().max(40, {
    message: "Location is too long.",
  }),
  hideLikes: z.boolean().optional(),
  hideComments: z.boolean().optional(),
});

export const CreatePostModal = () => {
  const { isOpen, onClose, type } = useModal();
  const { uploadedData } = usePostDataStore();
  const storedData = localStorage.getItem("uploadedData");
  const data = storedData ? JSON.parse(storedData) : uploadedData;
  const { user } = useUser();

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

  const { handleSubmit } = form;

  const isModalOpen = isOpen && type === "createPost";

  const handleClose = () => {
    onClose();
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent className="p-0 gap-0 w-10 sm:w-[65rem]">
        <div className="flex justify-between items-center border-b-[1px]">
          <DialogClose className="pl-1">
            <X className="w-5 h-5 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground outline-none cursor-pointer" />
          </DialogClose>
          <h1 className="font-semibold font-lg pl-5 md:pl-14">Share to...</h1>
          <Button className="text-amber-600 p-3" variant="ghost">
            Share
          </Button>
        </div>
        <div className="flex">
          <div className="w-[40rem] h-[40rem] aspect-auto flex justify-center items-center bg-black relative">
            <Image
              src={uploadedData?.info?.secure_url || data?.info?.secure_url}
              alt="Image"
              fill
              objectFit="cover"
              className="object-cover"
            />
          </div>
          <div className="flex flex-col flex-1">
            <div className="flex items-center p-3 gap-3">
              <ProfilePicture className="w-8 h-8" />
              <span className="font-semibold text-sm">{user?.username}</span>
            </div>
            <div className="">
              <Form {...form}>
                <form className="" onSubmit={handleSubmit(onSubmit)}>
                  <FormField
                    control={form.control}
                    name="caption"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            placeholder="Write a caption..."
                            {...field}
                          />
                        </FormControl>
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
                          <Input
                            className="relative"
                            placeholder="Add location"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
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
                          <FormMessage />
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
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
