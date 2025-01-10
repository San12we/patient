import React, { useState } from "react";
import { onBoardingSlides } from "@/config/constants";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Slider from "../../components/onboardig/slider";
import Slide from "../../components/onboardig/slide";


export default function OnboardingScreen() {
  const [index, setIndex] = useState(0);
  const prev = onBoardingSlides[index - 1];
  const next = onBoardingSlides[index + 1];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Slider
        key={index}
        index={index}
        setIndex={setIndex}
        prev={
          prev && (
            <Slider
              index={index}
              setIndex={setIndex}
              slide={prev}
              totalSlides={onBoardingSlides.length}
            />
          )
        }
        next={
          next && (
            <Slide
              index={index}
              setIndex={setIndex}
              slide={next}
              totalSlides={onBoardingSlides.length}
            />
          )
        }
      >
        <Slide
          slide={onBoardingSlides[index]}
          index={index}
          setIndex={setIndex}
          totalSlides={onBoardingSlides.length}
        />
      </Slider>
    </GestureHandlerRootView>
  );
}