import type { SVGProps } from "react";
import React from "react";

export const Loading = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 512 512"
    width="16"
    height="16"
    fill="currentColor"
    {...props}
  >
    <g>
      <path d="M268.078,512C126.693,511.962,12.108,397.316,12.146,255.932S126.83-0.038,268.215,0   c96.559,0.026,184.888,54.38,228.428,140.565c7.695,15.91,1.035,35.046-14.875,42.74c-15.501,7.497-34.155,1.384-42.213-13.834   C391.771,74.81,276.296,36.808,181.634,84.592S48.97,247.851,96.754,342.513s163.259,132.664,257.921,84.88   c36.48-18.414,66.133-47.987,84.646-84.417c8.018-15.753,27.287-22.023,43.04-14.005c15.753,8.018,22.023,27.287,14.005,43.04l0,0   C452.852,458.077,364.519,512.244,268.078,512z" />
      <animateTransform
        attributeName="transform"
        attributeType="XML"
        type="rotate"
        from="0 256 256"
        to="360 256 256"
        dur="2s"
        repeatCount="indefinite"
      />
    </g>
  </svg>
);
