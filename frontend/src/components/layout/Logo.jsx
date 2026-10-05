// Logo DHIKI : cercles concentriques au trait, monochrome.
export default function Logo({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="17" cy="17" r="15" />
      <circle cx="17" cy="17" r="9.5" />
      <circle cx="17" cy="17" r="3.5" fill="currentColor" />
    </svg>
  );
}
