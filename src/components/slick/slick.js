import React from 'react';
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

/**
 * ref: https://github.com/Bytesu/react-slick
 * @returns {*}
 * @constructor
 */
export const Slick = () => {
    const settings = {
        accessibility: false, // to deny blue box
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1
    };
    return (
        <Slider {...settings}>
            <div className="plan">
                <h3>1</h3>
            </div>
            <div className="plan">
                <h3>2</h3>
            </div>

        </Slider>
    );
};

