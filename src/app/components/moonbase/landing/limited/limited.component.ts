import { Component, OnInit } from '@angular/core';
import SwiperCore, { EffectCoverflow, Swiper } from 'swiper';
import { SwiperOptions } from 'swiper/types/swiper-options';
import 'swiper/scss';
SwiperCore.use([EffectCoverflow]);

@Component({
  selector: 'app-limited',
  templateUrl: './limited.component.html',
  styleUrls: ['./limited.component.scss']
})
export class LimitedComponent implements OnInit {


  slides: any[] = [
    {
      "img": "assets/media/images/moonbox/landing/322.jpg",
      "name": "The Moonshooter",
    },
    {
      "img": "assets/media/images/moonbox/landing/950.jpg",
      "name": "The Moonshooter",
    },
    {
      "img": "assets/media/images/moonbox/landing/951.jpg",
      "name": "The Moonshooter",
    },
    {
      "img": "assets/media/images/moonbox/landing/068.jpg",
      "name": "The Moonshooter",
    },
    {
      "img": "assets/media/images/moonbox/landing/372.jpg",
      "name": "The Moonshooter",
    },
    {
      "img": "assets/media/images/moonbox/landing/741.jpg",
      "name": "The Moonshooter",
    },
    {
      "img": "assets/media/images/moonbox/landing/575.jpg",
      "name": "The Moonshooter",
    },
  ];

  initialSlideStartIndex = Math.floor((this.slides.length - 1) / 2);
  sliderIndex = this.initialSlideStartIndex;
  currentSliderName = this.slides[this.sliderIndex].name;

  config: SwiperOptions = {
    slidesPerView: 3,
    effect: 'coverflow',
    direction: 'horizontal',
    centeredSlides: true,
    autoplay: {
      delay: 2000,
      disableOnInteraction: false,
    },
    speed: 1000,
    centerInsufficientSlides: true,
    freeMode: {
      enabled: false,
      sticky: true,
    },
    grabCursor: true,
    initialSlide: this.initialSlideStartIndex,
    loop: false,
    coverflowEffect: {
      depth: 400,
      slideShadows: false,
      rotate: 0,
      stretch: 0,
    },
    breakpoints: {
      700: {
        slidesPerView: 3,
      },
      600: {
        slidesPerView: 3,
      },
      500: {
        slidesPerView: 3,
      },
      300: {
        slidesPerView: 1.76,
      }

    }

  };
  constructor() {
  }
  ngOnInit(): void {

  }


  onSlideChange(index: any): void {
    if (index.swipeDirection == "next") {
      this.sliderIndex++;

    } else if (index.swipeDirection == "prev") {
      this.sliderIndex--;
    }
    this.sliderIndex = (this.sliderIndex) % (this.slides.length);
    this.currentSliderName = this.slides[this.sliderIndex].name;

  }

  scrollToElement(page: string, fragment: string): void {
    const element = document.querySelector(`#${fragment}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }
}
