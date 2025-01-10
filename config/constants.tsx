
import { Dimensions, Image } from "react-native";
import { scale, verticalScale } from "react-native-size-matters";
//@ts-ignore
import One from "@/assets/images/onboarding/quan.png";
//@ts-ignore
import Two from "@/assets/images/onboarding/tow.png";
//@ts-ignore
import Three from "@/assets/images/onboarding/tree.png";
import { IsIPAD } from "@/theme/app.constant";

export const onBoardingSlides: onBoardingSlidingTypes[] = [
  {
    color: "#40E0D0",
    title: "Welcome to MedPlus",
    image: (
      <Image
        source={One}
        style={{
          width: IsIPAD ? verticalScale(285) : verticalScale(320),
          height: IsIPAD ? verticalScale(345) : verticalScale(330),
        }}
      />
    ),
    description: "Your Partner in Wellness",
    subTitle:
      "Discover a seamless way to connect with trusted medical professionals and manage your healthcare journey.",
  },
  {
    color: "#A7F893",
    title: "Effortless Scheduling",
    image: (
      <Image
        source={Two}
        style={{
          width: IsIPAD ? scale(285) : scale(320),
          height: IsIPAD ? verticalScale(345) : verticalScale(330),
        }}
      />
    ),
    description: "Plan with Ease",
    subTitle:
      "View available slots and set up appointments with just a few taps. Say goodbye to long waits!",
  },
  {
    color: "#FFC0CB",
    image: (
      <Image
        source={Three}
        style={{
          width: IsIPAD ? scale(285) : scale(320),
          height: IsIPAD ? verticalScale(345) : verticalScale(330),
        }}
      />
    ),
    title: "Your Health, Simplified",
    description: "",
    subTitle:
      "Keep track of your health records, receive real-time notifications, and enjoy personalized care—all in one place.",
  },
];


// onboarding variables
export enum Side {
  LEFT,
  RIGHT,
  NONE,
}
export const MIN_LEDGE = 25;
export const { width: WIDTH, height: HEIGHT } = Dimensions.get("screen");
export const MARGIN_WIDTH = MIN_LEDGE + 50;
export const PREV = WIDTH;
export const NEXT = 0;
export const LEFT_SNAP_POINTS = [MARGIN_WIDTH, PREV];
export const RIGHT_SNAP_POINTS = [NEXT, WIDTH - MARGIN_WIDTH];

// banner data
export const bannerData = [
  {
    image:
      "https://res.cloudinary.com/dws2bgxg4/image/upload/v1732089208/medplus/qsed9b2jolllobsxdlpz.jpg",
    url: "https://react-native.becodemy.com",
  },
  {
    image:
      "https://res.cloudinary.com/dwp4syk3r/image/upload/v1713574008/WhatsApp_Image_2024-02-29_at_2.00.10_AM_zpk4qe.jpg",
    url: "https://youtu.be/BrrwtCt7d-Y",
  },
  {
    image:
      "https://res.cloudinary.com/dkg6jv4l0/image/upload/v1723424082/WhatsApp_Image_2024-08-09_at_5.00.52_AM_wzokd1.jpg",
    url: "https://youtu.be/4aS7g8OYHbg",
  },
];

