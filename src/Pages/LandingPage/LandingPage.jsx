import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useEffect, useRef, useState } from "react";
import AppleStoreImage from "@/assets/App Store Container.png";
import GooglePlayImage from "@/assets/Google Play Container.png";
import { useParams } from "react-router-dom";
import axios from "axios";
import Loading from "@/components/Loading";
import NotFound from "../NotFound";
import FadeInSection from "@/components/FadeInSection";

export default function LandingPage() {
  const autoplay = useRef(Autoplay({ delay: 3000, stopOnInteraction: false }));
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaApi, setEmblaApi] = useState(null);
  const { id } = useParams();
  const [villageData, setVillageData] = useState(null);
  const [loading, setLoading] = useState(true);
const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    const getVillageData = async () => {
      try {
        const res = await axios.get(`https://bcknd.sea-go.org/village/landing_page/village/${id}`);
        setVillageData(res.data.village);
      } catch (err) {
        console.error("Error fetching village data:", err);
      } finally {
        setLoading(false);
      }
    };
    getVillageData();
  }, [id]);
useEffect(() => {
  const sections = document.querySelectorAll("section[id]");

  const observer = new IntersectionObserver(
    (entries) => {
      let mostVisibleEntry = null;
      let maxRatio = 0;

      entries.forEach((entry) => {
        if (entry.intersectionRatio > maxRatio) {
          maxRatio = entry.intersectionRatio;
          mostVisibleEntry = entry;
        }
      });

      if (mostVisibleEntry?.isIntersecting) {
        setActiveSection(mostVisibleEntry.target.id);
      }
    },
    {
      root: null,
      rootMargin: "0px",
      threshold: [0.25, 0.5, 0.75, 1], // نراقب أكثر من مستوى رؤية
    }
  );

  sections.forEach((section) => observer.observe(section));

  return () => {
    sections.forEach((section) => observer.unobserve(section));
  };
}, []);

  if (loading) return <div className="text-center !p-10"><Loading /></div>;
  if (!villageData) return <div className="text-center !p-10 text-red-500"><NotFound/></div>;

  return (
    <div className="font-sans">
      {/* Navbar */}
      <NavigationMenu className="fixed right-0 left-0 top-0 z-50 bg-white shadow-md !px-8 !py-4">
        <div className="flex justify-between items-center w-full">
          <h1 className="text-2xl font-bold text-bg-primary">Sea Go</h1>
          <NavigationMenuList className="flex !gap-6 text-gray-700 font-medium">
           {["Home", "Gallery", "Location", "Download App"].map((item) => {
  const sectionId = item.toLowerCase().replace(/\s+/g, "");
  const isActive = activeSection === sectionId;

  return (
    <NavigationMenuItem key={item}>
      <NavigationMenuLink
        href={`#${sectionId}`}
        className={`transition-colors ${isActive ? "text-bg-primary font-semibold" : "text-gray-700"}`}
      >
        {item}
      </NavigationMenuLink>
    </NavigationMenuItem>
  );
})}
</NavigationMenuList>
        </div>
      </NavigationMenu>

      {/* Hero Section */}
      <FadeInSection>
      <section id="home" className="relative !mt-16 ">
        <img src={villageData.cover_image_link} alt="Hero" className="w-full h-[300px] object-cover" />
        <div className="absolute top-[110%] left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <Card className="w-full border-none text-center shadow-none overflow-hidden">
            <CardContent className="!p-4">
              <img src={villageData.image_link} alt={villageData.name} className="!mx-auto !mb-4 w-55 h-55" />
              <h2 className="text-xl font-semibold !mb-2">{villageData.name}</h2>
              <p className="text-gray-600 lg:pb-0 !pb-10">{villageData.description}</p>
            </CardContent>
          </Card>
        </div>
      </section>
</FadeInSection>
<FadeInSection>
      {/* Gallery */}
      <section id="gallery" className="text-center !py-12 !mt-32 md:!mt-48">
        <h2 className="text-2xl font-semibold !my-10 lg:!mb-10">
          Photo <span className="text-bg-primary">Gallery</span>
        </h2>
        <div className="max-w-6xl !mx-auto relative">
          {villageData.gallery?.length > 0 ? (
            <>
              <Carousel
                plugins={[autoplay.current]}
                className="w-full max-w-5xl !mx-auto overflow-hidden"
                setApi={setEmblaApi}
                opts={{
                  align: "center",
                  loop: true,
                  slidesToScroll: 1,
                  containScroll: "trimSnaps",
                }}
              >
                <CarouselContent className="!-ml-2 flex items-center">
                  {villageData.gallery.map((src, index) => (
                    <CarouselItem
                      key={index}
                      className={`!pl-2 basis-full sm:basis-1/2 md:basis-1/3 flex justify-center items-center transition-all duration-500 ease-out ${
                        selectedIndex === index
                          ? "scale-105 opacity-100 z-20 shadow-2xl"
                          : "scale-90 opacity-60 z-0"
                      }`}
                    >
                      <div className="w-full h-full rounded-2xl overflow-hidden">
                        <img
                          src={src}
                          alt={`Gallery Image ${index + 1}`}
                          className="w-full h-[280px] md:h-[320px] object-cover hover:scale-110 transition-transform"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious className="absolute left-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/90 hover:bg-white border-2 border-blue-200 hover:border-blue-400 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110" />
                <CarouselNext className="absolute right-4 top-1/2 -translate-y-1/2 z-30 w-12 h-12 bg-white/90 hover:bg-white border-2 border-blue-200 hover:border-blue-400 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110" />
              </Carousel>

              <div className="flex justify-center gap-3 !mt-8">
                {emblaApi &&
                  villageData.gallery.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => emblaApi.scrollTo(index)}
                      className={`transition-all duration-300 rounded-full ${
                        selectedIndex === index
                          ? "w-8 h-3 bg-bg-primary shadow-lg scale-110"
                          : "w-3 h-3 bg-gray-300 hover:bg-gray-400 hover:scale-105"
                      }`}
                    />
                  ))}
              </div>

              <div className="text-center !mt-4">
                <span className="text-sm text-gray-500 bg-gray-100 !px-3 !py-1 rounded-full">
                  {selectedIndex + 1} / {villageData.gallery.length}
                </span>
              </div>
            </>
          ) : (
            <p className="text-gray-400">No images available for this village.</p>
          )}
        </div>
      </section>
</FadeInSection>
<FadeInSection>
      {/* Location Map Section */}
      <section id="location" className="text-center !py-12 !mt-16">
        <h2 className="text-2xl font-semibold !mb-8">
          Our <span className="text-bg-primary">Location</span>
        </h2>
        <div className="max-w-5xl !mx-auto !p-4 bg-white rounded-lg shadow-xl">
          <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
            <iframe
              src={villageData.location_map}
              style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Location Map"
            ></iframe>
          </div>
        </div>
      </section>
</FadeInSection>
<FadeInSection>
      {/* Download App */}
      <section id="downloadapp" className="text-center bg-teal-50 w-[90%] !mx-auto !py-12 !mt-16">
        <h2 className="text-2xl font-semibold !mb-8">
          Download Our <span className="text-bg-primary">App</span>
        </h2>
        <p className="text-gray-600 !mb-6">
          Stay updated and book your unit through our app, available on Android and iOS.
        </p>
        <div className="flex justify-center !gap-4 !mt-8">
          <a href={villageData.apple_app} target="_blank" rel="noopener noreferrer">
            <img src={AppleStoreImage} alt="Download on App Store" />
          </a>
          <a href={villageData.android_app} target="_blank" rel="noopener noreferrer">
            <img src={GooglePlayImage} alt="Get it on Google Play" />
          </a>
        </div>
      </section>
      </FadeInSection>

      {/* Footer */}
      <footer className="bg-bg-primary text-white !py-12 !mt-16">
        <div className="max-w-6xl !mx-auto !px-4 grid grid-cols-1 md:grid-cols-3 !gap-8 text-left">
          <div>
            <h3 className="text-2xl font-bold !mb-2">Sea Go</h3>
            <p className="text-sm text-gray-200">
              A luxury seaside village combining serene nature, elegant design, and premium facilities.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold !mb-4">Follow Us</h4>
            <ul className="!space-y-2 text-sm">
              <li><a href={villageData.apple_app} className="hover:text-gray-300 transition-colors">App Store</a></li>
              <li><a href={villageData.android_app}className="hover:text-gray-300 transition-colors">Play Store</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold !mb-4">Quick Links</h4>
            <ul className="!space-y-2 text-sm">
              <li><a href="#home" className="hover:text-gray-300 transition-colors">Home</a></li>
              <li><a href="#gallery" className="hover:text-gray-300 transition-colors">Gallery</a></li>
              <li><a href="#location" className="hover:text-gray-300 transition-colors">Location</a></li>
              <li><a href="#downloadapp" className="hover:text-gray-300 transition-colors">Download App</a></li>
            </ul>
          </div>
        </div>
      </footer>

      {/* Copyright */}
      <div className="!p-2 text-sm text-gray-400 text-center !mx-auto !mt-4">
        &copy; {new Date().getFullYear()} Sea Go. All rights reserved.
      </div>
    </div>
  );
}
