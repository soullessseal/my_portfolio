export default function AppFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="hidden border-t border-primary bg-primary/95 lg:flex lg:h-[40px] lg:items-center lg:justify-center lg:px-4 lg:text-xs lg:text-word2">
      <p>Copyright © {year} Betty. All rights reserved.</p>
    </footer>
  );
}
