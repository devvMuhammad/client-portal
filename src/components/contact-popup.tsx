"use client";
/**
 * v0 by Vercel.
 * @see https://v0.dev/t/mQbb6tEmfY5
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { MailIcon, MapPinIcon, PhoneIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

export default function Component() {
  const [tab, setTab] = useState("questions");

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="px-6 bg-[#a855f7] hover:bg-beta rounded-2xl">
          Contact Us
        </Button>
      </DialogTrigger>
      <DialogContent className="p-0 max-w-3xl">
        <div className="grid grid-cols-2 gap gap-6">
          <div className="bg-muted overflow-hidden rounded-l-lg">
            {tab === "questions" ? (
              <Image
                src="/images/contact.webp"
                alt="Contact"
                className="h-full w-full object-cover"
                width="600"
                height="600"
                style={{ objectFit: "cover" }}
              />
            ) : (
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d805184.6331292129!2d144.49266890254657!3d-37.97123689954809!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad646b5d2ba4df7%3A0x4045675218ccd90!2sMelbourne%20VIC!5e0!3m2!1sen!2sau!4v1691981425175!5m2!1sen!2sau"
                height={600}
                width={600}
                // className="w-full"
                style={{ border: 0 }}
                aria-hidden="false"
              />
            )}
          </div>
          <div className="pt-10 pr-4 flex flex-col">
            <Tabs value={tab} onValueChange={setTab} className="h-full w-full">
              <TabsList className="bg-alpha text-white border-b w-full flex justify-between">
                <TabsTrigger value="questions" className="w-1/2">
                  Questions
                </TabsTrigger>
                <TabsTrigger value="information" className="w-1/2">
                  Information
                </TabsTrigger>
              </TabsList>
              <TabsContent value="questions" className="p-6 space-y-4">
                <div className="text-center space-y-1">
                  <h2 className="text-3xl font-bold">Get in Touch</h2>
                  <p className="text-muted-foreground">
                    Any questions or remarks? <br />
                    We&apos;ll get back you within 24 hours.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Enter your name" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Enter your message"
                    className="min-h-[100px]"
                  />
                </div>
                <Button type="submit">Send Message</Button>
              </TabsContent>
              <TabsContent value="information" className="p-6 space-y-4">
                <div className="text-center space-y-2">
                  <h2 className="text-2xl font-bold">Contact Details</h2>
                  <p className="text-muted-foreground">
                    Have some feedback for us? <br />
                    Give us a call or send an email.
                  </p>
                </div>
                <div className="grid grid-cols-1 gap-4">
                  <div className="flex items-center gap-3">
                    <MapPinIcon className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-medium">Address</div>
                      <p className="text-muted-foreground">
                        123 Main St, Anytown USA
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <PhoneIcon className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-medium">Phone</div>
                      <p className="text-muted-foreground">+(123) 456-7890</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MailIcon className="w-5 h-5 text-primary" />
                    <div>
                      <div className="font-medium">Email</div>
                      <p className="text-muted-foreground">info@example.com</p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
