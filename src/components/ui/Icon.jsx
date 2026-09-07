const paths = {
  shield: "M12 3l7 3v6c0 4.5-3 7.6-7 9-4-1.4-7-4.5-7-9V6l7-3z",
  bug: "M8 8a4 4 0 018 0v4a4 4 0 01-8 0V8zM3 10h3M18 10h3M4 15h3M17 15h3M5 20l3-2M19 20l-3-2M9 5L7 3M15 5l2-2",
  droplet: "M12 3s6 6.4 6 10.4A6 6 0 016 13.4C6 9.4 12 3 12 3z",
  roller: "M4 5h11v5H4zM15 7.5h4v4h-6v3M10 14.5h6V21h-6z",
  users: "M16 20v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 10a4 4 0 100-8 4 4 0 000 8M22 20v-2a4 4 0 00-3-3.9M16 3.1a4 4 0 010 7.8",
  layers: "M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5M3 17l9 5 9-5",
  sliders: "M4 6h16M4 12h16M4 18h16M9 4v4M15 10v4M7 16v4",
  headset: "M4 14v-2a8 8 0 1116 0v2M4 14a2 2 0 002 2h1v-5H6a2 2 0 00-2 2zM20 14a2 2 0 00-2-2h-1v5h1a2 2 0 002-2zM17 17v1a3 3 0 01-3 3h-2",
  briefcase: "M3 8h18v12H3zM8 8V5h8v3M3 13h18",
  building: "M4 21V4h10v17M14 10h6v11M7 8h4M7 12h4M7 16h4M17 14h1M17 18h1",
  home: "M4 11l8-7 8 7v9a1 1 0 01-1 1h-5v-6H10v6H5a1 1 0 01-1-1z",
  store: "M3 9l1.5-5h15L21 9M3 9h18v11H3zM9 20v-6h6v6",
  factory: "M3 21V10l6 4V10l6 4V7l6 4v10zM7 17h2M13 17h2M18 17h1",
  box: "M3 8l9-4 9 4-9 4-9-4zM3 8v8l9 4 9-4V8M12 12v8",
  school: "M12 3l10 5-10 5L2 8l10-5zM6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5",
  cross: "M4 4h16v16H4zM12 8v8M8 12h8",
  cart: "M3 4h2l2.6 11h9.8L20 7H6M9 20a1 1 0 100-2 1 1 0 000 2M18 20a1 1 0 100-2 1 1 0 000 2",
  bed: "M3 18v-9M3 13h18v5M21 18v-4a3 3 0 00-3-3h-7M7 11a2 2 0 100-4 2 2 0 000 4",
  cone: "M12 3l6 15H6L12 3zM4 21h16M8.5 13h7",
  phone: "M5 4h4l2 5-2.5 1.5a12 12 0 005 5L15 13l5 2v4a1 1 0 01-1.1 1A16 16 0 014 5.1 1 1 0 015 4z",
  mail: "M3 6h18v12H3zM3 7l9 6 9-6",
  pin: "M12 21s7-6 7-11a7 7 0 10-14 0c0 5 7 11 7 11zM12 12a2.5 2.5 0 100-5 2.5 2.5 0 000 5",
  clock: "M12 21a9 9 0 100-18 9 9 0 000 18zM12 7v5l3 2",
  check: "M4 12.5l5 5L20 6.5",
  star: "M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1L3.2 9.5l6.1-.9L12 3z",
  arrow: "M5 12h14M13 6l6 6-6 6",
  close: "M6 6l12 12M18 6L6 18",
  menu: "M4 7h16M4 12h16M4 17h16",
  chart: "M4 20V10M10 20V4M16 20v-7M22 20H2",
  inbox: "M3 13h5l2 3h4l2-3h5M3 13l3-8h12l3 8v7H3z",
  file: "M6 3h8l4 4v14H6zM14 3v4h4",
  gear: "M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.6 1.6 0 00.3 1.8l.1.1a2 2 0 11-2.8 2.8l-.1-.1a1.6 1.6 0 00-2.7 1.1V21a2 2 0 11-4 0v-.1A1.6 1.6 0 005.9 19.7l-.1.1a2 2 0 11-2.8-2.8l.1-.1A1.6 1.6 0 003 14.6H3a2 2 0 110-4h.1A1.6 1.6 0 004.3 8L4.2 8a2 2 0 112.8-2.8l.1.1A1.6 1.6 0 009.4 4.3V4a2 2 0 114 0v.1a1.6 1.6 0 002.7 1.1l.1-.1A2 2 0 1119 7.9l-.1.1a1.6 1.6 0 001.1 2.7H21a2 2 0 110 4h-.1a1.6 1.6 0 00-1.5 1z",
  logout: "M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9",
  plus: "M12 5v14M5 12h14",
  edit: "M4 20h4l10-10-4-4L4 16zM14 6l4 4",
  trash: "M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13",
  info: "M12 21a9 9 0 100-18 9 9 0 000 18zM12 11v5M12 8h.01",
  quote: "M7 7h5v5c0 3-2 5-5 5V7zM14 7h5v5c0 3-2 5-5 5V7z",
};

export default function Icon({ name, className = "h-5 w-5", strokeWidth = 1.7 }) {
  const d = paths[name] || paths.check;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  );
}
