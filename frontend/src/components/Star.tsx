/**
 * The signature five-point star. Per the identity guide it has ONLY two
 * sanctioned uses (booking-step indicator and "verified review" badge) plus
 * the logo lockup — never as decoration. Kept as a shared primitive so its
 * shape stays consistent everywhere it legitimately appears.
 */
export default function Star({
  size = 16,
  filled = true,
  className = '',
}: {
  size?: number;
  filled?: boolean;
  className?: string;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      className={className}
      aria-hidden="true"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth={filled ? 0 : 1.6}
    >
      <path d="M12 2l2.9 6.3 6.9.7-5.1 4.6 1.4 6.8L12 17.8 5.9 20.4l1.4-6.8L2.2 9l6.9-.7z" />
    </svg>
  );
}
