import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import VCover from "@/Pages/Villiage/VCover";
import VGallery from "@/Pages/Villiage/VGallery";

export default function Gallery() {
  return (
    <>
      <Tabs defaultValue="cover" className="w-full">
        <TabsList className="grid w-[50%] grid-cols-2 gap-6 bg-transparent !my-6 !m-auto">
          <TabsTrigger
            value="cover"
            className="rounded-[10px] border text-bg-primary !py-2 transition-all
              data-[state=active]:bg-bg-primary data-[state=active]:text-white
              hover:bg-teal-100 hover:text-teal-700"
          >
            Profile/Cover
          </TabsTrigger>

          <TabsTrigger
            value="profile"
            className="rounded-[10px] border text-bg-primary !py-2 transition-all
              data-[state=active]:bg-bg-primary data-[state=active]:text-white
              hover:bg-teal-100 hover:text-teal-700"
          >
            Gallery
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <VGallery />
        </TabsContent>

        <TabsContent value="cover">
          <VCover />
        </TabsContent>
      </Tabs>
    </>
  );
}
