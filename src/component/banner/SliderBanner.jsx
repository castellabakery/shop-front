import React, {useEffect, useState} from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

// import AwesomeSlider from "react-awesome-slider";
// import withAutoplay from 'react-awesome-slider/dist/autoplay';
// import 'react-awesome-slider/dist/styles.css'
import './SliderBanner.css';

const SliderBanner = function (props) {

    const {
        sliderBannerName,
        renderArray,
        sliderWidth,
        sliderHeight,
        intervalSecond,
        isAutoPlay,
        isBullets,
        slidesCount
    } = props;

    const [isInitialize, setIsInitialize] = useState(false);

    useEffect(() => {
        if (!isInitialize) {
            setIsInitialize(true);
        }
    }, [isInitialize, setIsInitialize]);

    return (
        <div className="slider-banner-component">

            {
                renderArray && renderArray.length > 0 &&
                <div className={"slider-layout"} style={{width: sliderWidth, height: sliderHeight}}>

                    {/* id 유동적으로 주게 */}
                    <Slider
                        id={sliderBannerName + "-slider"}
                        dots={true}
                        key={sliderBannerName + "-slider"}
                        // arrows={true}
                        className={'react__slick__slider__parent'}
                        // infinite={true}
                        autoplay={isAutoPlay}
                        // speed={500}

                        //    slidesToScroll={3}
                        slidesToShow={slidesCount}
                        // autoplaySpeed={2000}
                        // cssEase={"linear"}

                    >
                        {
                            renderArray.map((m, idx) => (
                                <div key={"slider-render-item-" + idx}>
                                    {m.renderTag()}
                                </div>
                            ))
                        }


                    </Slider>
                </div>
            }

        </div>
    );
};

export default SliderBanner;
