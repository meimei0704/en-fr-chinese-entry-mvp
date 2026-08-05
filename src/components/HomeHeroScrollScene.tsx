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
          <path d="M118 90c22 5 39 17 52 36" />
          <path d="M274 74c24 6 42 18 56 40" />
          <path d="M448 62c21 4 38 15 53 34" />
          <path d="M640 84c24 5 42 16 57 36" />
          <path d="M786 104c18 4 32 13 43 29" />
        </g>

        <g className="home-hero__scroll-track">
          <path d="M24 286c78-34 134-54 197-50 52 4 92 22 146 24 63 2 110-18 161-42 63-29 129-43 244-14" />
          <path d="M32 320c65-16 118-13 172-1 63 14 115 16 171 2 53-13 101-39 148-57 62-24 126-27 224-7" />
        </g>

        <g className="home-hero__scroll-accents">
          <ellipse cx="92" cy="114" rx="42" ry="42" fill="url(#homeHeroScrollWarm)" />
          <ellipse cx="214" cy="304" rx="40" ry="40" fill="url(#homeHeroScrollJade)" />
          <ellipse cx="776" cy="120" rx="44" ry="44" fill="url(#homeHeroScrollSky)" />
          <ellipse cx="846" cy="286" rx="38" ry="38" fill="url(#homeHeroScrollWarm)" />
        </g>

        <g className="home-hero__scroll-motifs">
          <g className="home-hero__scroll-motif home-hero__scroll-motif--wall">
            <path d="M56 116h78l-10 20H66z" />
            <path d="M84 136v22m18-22v22m18-22v22" />
          </g>

          <g className="home-hero__scroll-motif home-hero__scroll-motif--roof">
            <path d="M164 262h68l-8 18h-52z" />
            <path d="M176 280v18m16-18v18m16-18v18" />
          </g>

          <g className="home-hero__scroll-motif home-hero__scroll-motif--panda">
            <path d="M228 246c18-18 38-26 60-26 19 0 35 8 48 25-17 14-35 21-56 21-20 0-37-6-52-20z" />
          </g>

          <g className="home-hero__scroll-motif home-hero__scroll-motif--tea">
            <path d="M344 196h34c11 0 18 6 18 16 0 11-9 19-22 19h-30z" />
            <path d="M394 202c10 1 16 7 16 14 0 8-7 15-18 16" />
          </g>

          <g className="home-hero__scroll-motif home-hero__scroll-motif--music">
            <path d="M420 174v54" />
            <path d="M420 174c18-6 34-8 48-6v42" />
            <path d="M420 228c0 10-8 18-18 18-9 0-16-6-16-14 0-9 7-15 18-15" />
            <path d="M468 210c0 10-8 18-18 18-9 0-16-6-16-14 0-9 7-15 18-15" />
          </g>

          <g className="home-hero__scroll-motif home-hero__scroll-motif--tower">
            <path d="M602 96c26 0 46 14 61 39-18 14-38 21-61 21-26 0-47-8-63-25 13-23 34-35 63-35z" />
          </g>

          <g className="home-hero__scroll-motif home-hero__scroll-motif--lantern">
            <path d="M702 154h32l12 18-12 18h-32l-12-18z" />
            <path d="M718 190v18" />
          </g>

          <g className="home-hero__scroll-motif home-hero__scroll-motif--fan">
            <path d="M748 274c14-28 34-42 61-42 22 0 39 8 53 25-17 18-39 27-63 27-19 0-36-3-51-10z" />
          </g>

          <g className="home-hero__scroll-motif home-hero__scroll-motif--brush">
            <path d="M810 228l18 42 18-42" />
            <path d="M828 270v32" />
          </g>

          <g className="home-hero__scroll-motif home-hero__scroll-motif--knot">
            <path d="M866 170c16 0 28 8 36 24-9 9-21 14-35 14-16 0-28-5-36-16 8-14 19-22 35-22z" />
          </g>

          <g className="home-hero__scroll-motif home-hero__scroll-motif--bamboo">
            <path d="M128 206c12 10 20 22 24 38" />
            <path d="M144 198c16 10 28 24 34 42" />
          </g>

          <g className="home-hero__scroll-motif home-hero__scroll-motif--dumpling">
            <path d="M520 254c18 0 33 10 44 28-12 10-26 15-43 15-18 0-32-5-44-16 10-18 24-27 43-27z" />
          </g>
        </g>

        <rect className="home-hero__scroll-center-veil" x="252" y="72" width="456" height="244" rx="56" />
      </svg>
    </div>
  )
}
