export default function AppFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-primary bg-primary/95 px-4 pt-2 pb-[calc(72px_+_env(safe-area-inset-bottom)_+_16px)] text-center text-[11px] text-word2 lg:flex lg:h-[40px] lg:items-center lg:justify-center lg:px-4 lg:py-0 lg:text-xs">
      <p>Copyright © {year} Betty. All rights reserved.</p>
    </footer>
  );
}
