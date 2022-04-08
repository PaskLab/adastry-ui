<svg
  css="{css`
    position: absolute;
    bottom: 0;
    left: 0px;
    display: block;
    width: 100%;
    max-height: 48px;
    margin: 0;
    z-index: 1;
  `}"
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 24 150 28"
  preserveAspectRatio="none"
  role="img"
  ariaLabel="Animating waves dividing two sections."
>
  <defs>
    <path
      id="gentle-wave"
      d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z"
    >
    </path>
  </defs>
  <g
    css="{css`
      -webkit-animation: ${wave} 10s linear infinite;
      animation: ${wave} 10s linear infinite;
    `}"
    className="text-primary-600"
  >
    <use xlinkHref="#gentle-wave" x="48" y="3" fill="currentColor"> </use>
  </g>
  <g
    css="{css`
      -webkit-animation: ${wave} 8s linear infinite;
      animation: ${wave} 8s linear infinite;
    `}"
    className="text-primary-400"
  >
    <use xlinkHref="#gentle-wave" x="48" y="0" fill="currentColor"></use>
  </g>
  <g
    css="{css`
      -webkit-animation: ${wave} 6s linear infinite;
      animation: ${wave} 6s linear infinite;
    `}"
    className="text-primary-500"
  >
    <use xlinkHref="#gentle-wave" x="48" y="9" fill="currentColor"></use>
  </g>
  <g
    css="{css`
      -webkit-animation: ${wave} 4s linear infinite;
      animation: ${wave} 4s linear infinite;
    `}"
    className="text-gray-50 dark:text-gray-800"
  >
    <use xlinkHref="#gentle-wave" x="48" y="6" fill="currentColor"></use>
  </g>
</svg>
