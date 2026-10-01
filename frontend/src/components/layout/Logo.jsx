// Logo DHIKI : cercles concentriques terracotta / sauge.
export default function Logo({ size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 34 34" fill="none" aria-hidden="true">
      <circle cx="17" cy="17" r="16" fill="#C2623F" />
      <circle cx="17" cy="17" r="12.5" fill="#F5EFE6" />
      <circle cx="17" cy="17" r="10" fill="#6B8F71" />
      <circle cx="17" cy="17" r="6" fill="#FAF3E8" />
      <circle cx="17" cy="17" r="3.5" fill="#C2623F" />
    </svg>
  );
}
