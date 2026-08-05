export function HomeHeroScrollScene() {
  return (
    <div className="home-hero__scroll-scene" aria-hidden="true">
      <svg
        className="home-hero__scroll-svg"
        viewBox="0 0 960 420"
        focusable="false"
        preserveAspectRatio="xMidYMax slice"
      >
        <defs>
          <radialGradient id="homeHeroScrollWarm" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#b86d55" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#b86d55" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="homeHeroScrollSky" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#5f8ff7" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#5f8ff7" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="homeHeroScrollJade" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#5a8d79" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#5a8d79" stopOpacity="0" />
          </radialGradient>
        </defs>

        <g className="home-hero__scroll-clouds">
          <path d="M42 98c12-15 31-14 39 1 9-8 26-5 29 8h23" />
          <path d="M250 82c11-14 29-13 37 1 8-7 23-4 27 8h22" />
          <path d="M624 78c11-14 28-13 36 1 8-7 23-4 27 8h20" />
          <path d="M812 112c10-13 26-12 34 1 8-6 21-3 25 8h20" />
        </g>

        <g className="home-hero__scroll-track">
          <path d="M8 326c72-40 142-56 211-42 62 13 104 38 165 34 78-5 118-58 197-63 65-5 120 27 183 36 65 9 120 1 188-24" />
          <path d="M0 354c69-23 131-27 194-10 68 19 125 24 190 6 62-18 108-55 169-64 70-10 129 22 196 36 68 14 133 7 211-21" />
        </g>

        <g className="home-hero__scroll-accents">
          <ellipse cx="122" cy="176" rx="74" ry="74" fill="url(#homeHeroScrollWarm)" />
          <ellipse cx="244" cy="306" rx="62" ry="62" fill="url(#homeHeroScrollJade)" />
          <ellipse cx="744" cy="166" rx="68" ry="68" fill="url(#homeHeroScrollSky)" />
          <ellipse cx="864" cy="308" rx="62" ry="62" fill="url(#homeHeroScrollWarm)" />
        </g>

        <g className="home-hero__scroll-motifs">
          <g
            className="home-hero__scroll-motif home-hero__scroll-motif--bamboo"
            data-home-hero-motif="bamboo"
          >
            <path d="M24 338c8-46 12-86 11-122m28 118c-2-43 0-79 8-110" />
            <path d="M35 260c-15-16-28-22-38-17 12 17 24 24 38 23" />
            <path d="M38 238c17-17 32-22 44-15-13 17-27 23-44 21" />
            <path d="M66 278c-16-15-29-20-40-14 13 16 26 21 40 20" />
            <path d="M70 251c16-14 31-17 42-9-14 14-27 18-42 15" />
            <path d="M30 303h11m23-1h12" />
          </g>

          <g
            className="home-hero__scroll-motif home-hero__scroll-motif--palace"
            data-home-hero-motif="palace"
          >
            <path
              className="home-hero__scroll-wash home-hero__scroll-wash--clay"
              d="M44 190c25 1 45-8 68-30 23 22 45 31 75 30l-12 15H56z"
            />
            <path d="M38 191c30 2 51-8 74-31 24 23 47 33 80 31" />
            <path d="M56 205h116l-10 18H66z" />
            <path d="M73 223v72m25-72v72m28-72v72m28-72v72" />
            <path d="M64 295h102M84 256h56v39H84z" />
            <circle cx="106" cy="274" r="2.5" />
            <circle cx="118" cy="274" r="2.5" />
          </g>

          <g
            className="home-hero__scroll-motif home-hero__scroll-motif--great-wall"
            data-home-hero-motif="great-wall"
          >
            <path d="M6 331 48 299l39 9 37-31 41 12 42-28 44 14 48-28" />
            <path d="M10 346 51 315l39 9 37-31 39 12 42-28 45 14 50-29" />
            <path d="M43 284h34v34H43zM40 284v-10h9v6h8v-6h9v6h8v-6h8v10" />
            <path d="M112 262h35v36h-35zM109 262v-10h9v6h8v-6h9v6h8v-6h8v10" />
            <path d="M218 248h37v35h-37zM215 248v-10h9v6h9v-6h9v6h9v-6h8v10" />
            <path d="M55 296v14m69-36v14m107-28v14" />
          </g>

          <g
            className="home-hero__scroll-motif home-hero__scroll-motif--panda"
            data-home-hero-motif="panda"
          >
            <ellipse
              className="home-hero__scroll-wash home-hero__scroll-wash--paper"
              cx="252"
              cy="316"
              rx="43"
              ry="39"
            />
            <circle className="home-hero__scroll-ink-fill" cx="224" cy="286" r="14" />
            <circle className="home-hero__scroll-ink-fill" cx="280" cy="286" r="14" />
            <ellipse
              className="home-hero__scroll-ink-fill"
              cx="235"
              cy="309"
              rx="10"
              ry="15"
              transform="rotate(28 235 309)"
            />
            <ellipse
              className="home-hero__scroll-ink-fill"
              cx="269"
              cy="309"
              rx="10"
              ry="15"
              transform="rotate(-28 269 309)"
            />
            <circle className="home-hero__scroll-paper-dot" cx="238" cy="306" r="2.5" />
            <circle className="home-hero__scroll-paper-dot" cx="266" cy="306" r="2.5" />
            <path d="M248 322c3-3 6-3 9 0-2 5-7 5-9 0zM242 331c7 6 14 6 21 0" />
            <path d="M219 340c-8 5-13 13-16 24m82-24c8 5 13 13 16 24" />
          </g>

          <g
            className="home-hero__scroll-motif home-hero__scroll-motif--oriental-pearl"
            data-home-hero-motif="oriental-pearl"
          >
            <path d="M748 70v36m0 30v29m0 53v88" />
            <path d="M744 70h8l-4-22z" />
            <circle
              className="home-hero__scroll-wash home-hero__scroll-wash--sky"
              cx="748"
              cy="120"
              r="17"
            />
            <circle
              className="home-hero__scroll-wash home-hero__scroll-wash--sky"
              cx="748"
              cy="190"
              r="27"
            />
            <circle cx="748" cy="235" r="8" />
            <path d="M738 136h20m-21 82h22M731 306l17-88 17 88M704 306h88M724 286h48" />
            <path d="M730 164h36M726 306v16m44-16v16" />
          </g>

          <g
            className="home-hero__scroll-motif home-hero__scroll-motif--lantern"
            data-home-hero-motif="lantern"
          >
            <path d="M862 66v35m-18 0h36m-31 9h26" />
            <path
              className="home-hero__scroll-wash home-hero__scroll-wash--clay"
              d="M849 110c-13 15-13 45 0 60h26c13-15 13-45 0-60z"
            />
            <path d="M849 110c-13 15-13 45 0 60h26c13-15 13-45 0-60z" />
            <path d="M856 111c-6 16-6 43 0 59m12-59c6 16 6 43 0 59m-25 9h38" />
            <path d="M862 179v30m-9-17 9 17 9-17" />
          </g>

          <g
            className="home-hero__scroll-motif home-hero__scroll-motif--fan"
            data-home-hero-motif="fan"
          >
            <path
              className="home-hero__scroll-wash home-hero__scroll-wash--gold"
              d="M813 352c11-52 46-80 99-75 7 30-2 62-26 91z"
            />
            <path d="M813 352c11-52 46-80 99-75 7 30-2 62-26 91z" />
            <path d="m813 352 38-63m-38 63 61-71m-61 71 82-68m-82 68 98-48m-98 48 99-18" />
            <path d="m807 359 12-14 72 27-7 14z" />
            <circle cx="815" cy="354" r="5" />
          </g>
        </g>

        <rect className="home-hero__scroll-center-veil" x="270" y="74" width="420" height="250" rx="64" />
      </svg>
    </div>
  )
}
