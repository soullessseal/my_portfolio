"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import type { MigratedFeaturedMedia, SiteAssets } from "@/sanity/lib/queries";

import CmsImage from "../ui/CmsImage";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export type FeaturedDetailProject = {
  key: string;
  title: string;
  imageSrc: string;
  tagLabels: string[];
};

type Props = {
  project: FeaturedDetailProject | null;
  siteAssets?: SiteAssets | null;
  onClose: () => void;
};

type DetailMedia = {
  caption: string;
  type: "image" | "video";
  fallbackSrc: string;
  alt: string;
  text: string;
};

type DetailContent = {
  englishTitle: string;
  title: string;
  heroCaption: string;
  heroFallbackSrc: string;
  heroAlt: string;
  projectType: string;
  projectBackground: string;
  goals: string[];
  strategies: DetailMedia[];
  processFlowItems?: DetailMedia[];
};

const IMAGE_PLACEHOLDER =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'%3E%3Crect width='16' height='16' fill='%23c9c0bb'/%3E%3C/svg%3E";
const MOBILE_MODAL_VISIBLE_HEIGHT = "calc(100dvh - 112px)";

const DEFAULT_SWISS_CONTENT: DetailContent = {
  englishTitle: "SWITZERLAND TRAVEL PROJECT",
  title: "瑞士旅遊專案",
  heroCaption: "hero",
  heroFallbackSrc: IMAGE_PLACEHOLDER,
  heroAlt: "瑞士旅遊專案 Hero 圖",
  projectType: "平面視覺設計",
  projectBackground:
    "本專案目的在為旗下的旅遊產品「瑞士旅遊專賣店」，打造系列完整的視覺識別與行銷素材，建立具吸引力的旅遊形象。",
  goals: [
    "建立「瑞士純鐵路旅遊」的品牌印象",
    "透過一致的視覺，提升使用者辨識度",
    "讓畫面維持乾淨、好閱讀、不雜亂",
  ],
  strategies: [
    {
      caption: "strategy-a1",
      type: "image",
      fallbackSrc: IMAGE_PLACEHOLDER,
      alt: "設計策略示意圖",
      text: "以較豐富的色彩層次，提升旅遊畫面的吸引力",
    },
    {
      caption: "strategy-a2",
      type: "image",
      fallbackSrc: IMAGE_PLACEHOLDER,
      alt: "設計策略示意圖",
      text: "主色採天空藍與瑞士紅，輔以自然綠與雪白",
    },
    {
      caption: "strategy-a3",
      type: "image",
      fallbackSrc: IMAGE_PLACEHOLDER,
      alt: "設計策略示意圖",
      text: "視覺以山峰與鐵路為核心，凸顯六大名峰、七大名列的行程特色",
    },
  ],
};

const INDIA_CONTENT: DetailContent = {
  englishTitle: "INDIA PILGRIMAGE PROJECT",
  title: "印度朝聖海外網專案",
  heroCaption: "hero",
  heroFallbackSrc: IMAGE_PLACEHOLDER,
  heroAlt: "印度朝聖海外網專案 Hero 圖",
  projectType: "網站視覺設計 | Prototype原型設計",
  projectBackground:
    "本專案目的在為旗下的朝聖產品「印度朝聖」製作海外網站，對象多為宗教朝聖者、年長者，需要清楚傳達朝聖旅程所蘊含的信仰感、莊重感與安心感。",
  goals: [
    "營造莊重、穩定且值得信賴的朝聖品牌形象",
    "清楚呈現行程內容的豐富度，同時強調客製化服務",
    "提供清楚直覺的聯繫方式，降低中高年齡族群的操作負擔，方便快速聯絡。",
  ],
  strategies: [
    {
      caption: "strategy-c1",
      type: "image",
      fallbackSrc: IMAGE_PLACEHOLDER,
      alt: "設計策略示意圖",
      text: "選用彩度較低的綠色色系，呼應修行、土地與信仰意象，避免過度刺激的視覺表現，降低長時間瀏覽的視覺負擔",
    },
    {
      caption: "strategy-c2",
      type: "video",
      fallbackSrc: "",
      alt: "設計策略示意影片",
      text: "設計固定顯示的聯絡與報名按鈕，確保使用者在各瀏覽階段皆能快速找到聯繫方式，提升操作直覺性",
    },
    {
      caption: "strategy-c3",
      type: "video",
      fallbackSrc: "",
      alt: "設計策略示意影片",
      text: "網站架構方面，除了規劃獨立的客製化頁面，也廣泛配置諮詢表單區塊，引導使用者進入訂製流程，強化客製化服務體驗",
    },
    {
      caption: "strategy-c4",
      type: "video",
      fallbackSrc: "",
      alt: "設計策略示意影片",
      text: "透過專家介紹與法師介紹區塊，清楚呈現團隊背景與專業角色，建立莊重、穩定且值得信賴的品牌形象",
    },
    {
      caption: "strategy-c5",
      type: "image",
      fallbackSrc: IMAGE_PLACEHOLDER,
      alt: "設計策略示意圖",
      text: "以模組化元件設計（行程卡、景點介紹卡、文章卡、CTA 按鈕），提升閱讀清晰度，同時保留後續頁面擴充與維護的彈性",
    },
  ],
};

const PORTFOLIO_CONTENT: DetailContent = {
  englishTitle: "PORTFOLIO WEBSITE PROJECT",
  title: "個人作品集網站",
  heroCaption: "hero",
  heroFallbackSrc: IMAGE_PLACEHOLDER,
  heroAlt: "個人作品集網站 Hero 圖",
  projectType: "UI/UX 介面設計｜網站視覺設計｜Prototype 原型設計",
  projectBackground:
    "本專案為個人設計作品集網站，主要用於整理與展示過往的 UI/UX 與視覺設計專案，並作為求職與專業展示的平台。在設計上除了呈現作品內容，也希望透過清晰的資訊架構與簡潔的視覺風格，讓瀏覽者能快速理解設計能力與專案經驗。",
  goals: [
    "建立清晰且具有個人風格的作品展示平台",
    "透過良好的資訊層級，讓瀏覽者能快速理解作品內容與設計能力",
    "提供直覺的瀏覽與作品分類方式，提升整體閱讀流暢度",
  ],
  strategies: [
    {
      caption: "strategy-b1",
      type: "image",
      fallbackSrc: IMAGE_PLACEHOLDER,
      alt: "設計策略示意圖",
      text: "採用簡潔且低彩度的視覺風格，以米色與灰階色系建立沉穩且一致的網站調性，避免過度干擾作品內容",
    },
    {
      caption: "strategy-b2",
      type: "image",
      fallbackSrc: IMAGE_PLACEHOLDER,
      alt: "設計策略示意圖",
      text: "規劃清楚的作品分類（UI/UX、平面設計、其他），讓瀏覽者可以快速找到感興趣的作品類型",
    },
    {
      caption: "strategy-b3",
      type: "image",
      fallbackSrc: IMAGE_PLACEHOLDER,
      alt: "設計策略示意圖",
      text: "透過卡片式作品版型設計，讓不同專案在視覺上保持一致性，同時方便後續新增與擴充作品",
    },
    {
      caption: "strategy-b4",
      type: "image",
      fallbackSrc: IMAGE_PLACEHOLDER,
      alt: "設計策略示意圖",
      text: "採用響應式設計（RWD），確保網站在桌機與手機裝置上皆能維持良好的閱讀體驗",
    },
  ],
  processFlowItems: [
    {
      caption: "step-b1",
      type: "image",
      fallbackSrc: IMAGE_PLACEHOLDER,
      alt: "Step 1",
      text: "分析需求並繪製網站心智圖(Mind Map)",
    },
    {
      caption: "step-b2",
      type: "image",
      fallbackSrc: IMAGE_PLACEHOLDER,
      alt: "Step 2",
      text: "整理內容層級並規劃網站地圖(Site Map)",
    },
    {
      caption: "step-b3",
      type: "image",
      fallbackSrc: IMAGE_PLACEHOLDER,
      alt: "Step 3",
      text: "繪製線框稿架構(Wireframe)",
    },
    {
      caption: "step-b4",
      type: "image",
      fallbackSrc: IMAGE_PLACEHOLDER,
      alt: "Step 4",
      text: "製作元件/變體(Components/Varients)，建立UI System(元件系統規範)",
    },
    {
      caption: "step-b5",
      type: "image",
      fallbackSrc: IMAGE_PLACEHOLDER,
      alt: "Step 5",
      text: "串接設計(Figma MCP)與AI程式模型(Codex)，以及後台Sanity(CMS)",
    },
  ],
};

const PROJECT_DETAIL_CONTENT: Record<string, DetailContent> = {
  "project-1": DEFAULT_SWISS_CONTENT,
  "project-2": PORTFOLIO_CONTENT,
  "project-3": INDIA_CONTENT,
};

function findFeaturedSet(siteAssets: SiteAssets | null | undefined, projectKey: string) {
  return siteAssets?.featuredDetails?.find((item) => item.projectKey === projectKey);
}

function findMigratedImage(images: MigratedFeaturedMedia[] | undefined, caption: string) {
  return images?.find((item) => item.caption === caption);
}

function getFeaturedImage(image?: MigratedFeaturedMedia) {
  if (image?.image) return image.image;
  if (image?.asset && image._type === "featuredImageAsset") {
    return {
      asset: image.asset,
      hotspot: image.hotspot,
      crop: image.crop,
    };
  }
  return undefined;
}

function getFeaturedVideoUrl(image?: MigratedFeaturedMedia) {
  if (image?.video?.asset?.url) return image.video.asset.url;
  if (image?._type === "featuredVideoAsset" && image.asset?.url) return image.asset.url;
  return undefined;
}

function StrategyMedia({
  image,
  alt,
  fallbackSrc,
  type,
}: {
  image?: MigratedFeaturedMedia;
  alt: string;
  fallbackSrc: string;
  type: "image" | "video";
}) {
  const videoUrl = getFeaturedVideoUrl(image);

  if (videoUrl) {
    return (
      <video
        src={videoUrl}
        autoPlay
        loop
        muted
        playsInline
        className="h-full w-full object-cover"
        aria-label={alt}
      />
    );
  }

  if (type === "video") {
    if (fallbackSrc) {
      return (
        <video
          src={fallbackSrc}
          autoPlay
          loop
          muted
          playsInline
          className="h-full w-full object-cover"
          aria-label={alt}
        />
      );
    }

    return <div className="h-full w-full bg-secondary-50" aria-label={alt} />;
  }

  const cmsImage = getFeaturedImage(image);

  if (cmsImage) {
    return (
      <CmsImage
        image={cmsImage}
        alt={image?.alt || alt}
        width={1200}
        sizes="(min-width: 768px) 36vw, 100vw"
        className="h-full w-full object-cover"
      />
    );
  }

  return (
    <Image
      src={fallbackSrc}
      alt={alt}
      width={1200}
      height={800}
      sizes="(min-width: 768px) 36vw, 100vw"
      className="h-full w-full object-cover"
      draggable={false}
      onContextMenu={(event) => event.preventDefault()}
    />
  );
}

export default function FeaturedDetailModal({ project, siteAssets, onClose }: Props) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const heroRef = useRef<HTMLElement | null>(null);
  const goalsRef = useRef<HTMLElement | null>(null);
  const strategyRef = useRef<HTMLElement | null>(null);
  const processFlowRef = useRef<HTMLElement | null>(null);
  const heroTitleRef = useRef<HTMLDivElement | null>(null);
  const heroImageRef = useRef<HTMLDivElement | null>(null);
  const heroDetailRef = useRef<HTMLDivElement | null>(null);
  const goalsTitleRef = useRef<HTMLHeadingElement | null>(null);
  const goalsContentRef = useRef<HTMLDivElement | null>(null);
  const strategyContentRef = useRef<HTMLDivElement | null>(null);
  const strategyTrackRef = useRef<HTMLDivElement | null>(null);
  const processFlowContentRef = useRef<HTMLDivElement | null>(null);
  const processFlowTrackRef = useRef<HTMLDivElement | null>(null);
  const detail = project ? PROJECT_DETAIL_CONTENT[project.key] ?? DEFAULT_SWISS_CONTENT : DEFAULT_SWISS_CONTENT;
  const featuredImages = project ? findFeaturedSet(siteAssets, project.key)?.images : undefined;
  const heroImage = findMigratedImage(featuredImages, detail.heroCaption);
  const handleScrollToGoals = () => {
    if (!wrapperRef.current || !goalsRef.current) return;
    wrapperRef.current.scrollTo({
      top: goalsRef.current.offsetTop,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    if (!project) return;

    const equalizeTextHeights = () => {
      const strategyTexts = strategyTrackRef.current
        ? Array.from(strategyTrackRef.current.querySelectorAll<HTMLElement>("[data-strategy-text]"))
        : [];
      const processTexts = processFlowTrackRef.current
        ? Array.from(processFlowTrackRef.current.querySelectorAll<HTMLElement>("[data-process-text]"))
        : [];

      const applyGroupMinHeight = (elements: HTMLElement[]) => {
        if (!elements.length) return;
        elements.forEach((element) => {
          element.style.minHeight = "0px";
        });
        const maxHeight = Math.max(...elements.map((element) => element.getBoundingClientRect().height));
        elements.forEach((element) => {
          element.style.minHeight = `${Math.ceil(maxHeight)}px`;
        });
      };

      applyGroupMinHeight(strategyTexts);
      applyGroupMinHeight(processTexts);
    };

    const rafId = window.requestAnimationFrame(equalizeTextHeights);
    window.addEventListener("resize", equalizeTextHeights);

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener("resize", equalizeTextHeights);
    };
  }, [project, detail.strategies.length, detail.processFlowItems?.length]);

  useEffect(() => {
    if (!project) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    wrapperRef.current?.scrollTo({ top: 0, behavior: "auto" });

    return () => {
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [project, onClose]);

  useEffect(() => {
    if (!project) return;
    if (!wrapperRef.current || !contentRef.current) return;
    if (!heroRef.current || !goalsRef.current || !strategyRef.current) return;
    if (!heroTitleRef.current || !heroImageRef.current || !heroDetailRef.current || !goalsTitleRef.current || !goalsContentRef.current || !strategyContentRef.current || !strategyTrackRef.current) return;

    const ctx = gsap.context(() => {
      const smoother = ScrollSmoother.create({
        wrapper: wrapperRef.current!,
        content: contentRef.current!,
        smooth: 0.72,
        normalizeScroll: true,
        smoothTouch: 0.03,
      });
      smoother.scrollTop(0);
      wrapperRef.current!.scrollTop = 0;
      ScrollTrigger.refresh();

      const mm = gsap.matchMedia();

      mm.add("(max-width: 767px)", () => {
        const heroEnglishTitle = heroTitleRef.current?.querySelector("p");

        gsap.set(heroImageRef.current, {
          width: "200vw",
          height: MOBILE_MODAL_VISIBLE_HEIGHT,
          x: 0,
          yPercent: 0,
          scale: 1,
          transformOrigin: "center top",
        });
        if (heroEnglishTitle) {
          gsap.set(heroEnglishTitle, { scale: 1, transformOrigin: "center top" });
        }
        gsap.set(heroDetailRef.current, { autoAlpha: 0, x: 0, y: 24 });

        const heroTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            start: "bottom bottom",
            end: "+=170%",
            pin: true,
            scrub: 1.4,
          },
        });

        heroTimeline.to(heroTitleRef.current, {
          y: -28,
          autoAlpha: 0,
          ease: "power2.out",
          duration: 0.8,
        });
        heroTimeline.fromTo(
          heroImageRef.current,
          { scale: 1, yPercent: 0 },
          {
            scale: 0.5,
            yPercent: 28,
            xPercent: 0,
            ease: "power2.inOut",
            duration: 1.25,
          },
          0.08,
        );
        if (heroEnglishTitle) {
          heroTimeline.to(heroEnglishTitle, { scale: 0.78, ease: "power2.inOut", duration: 1.25 }, 0.08);
        }
        heroTimeline.to(
          heroDetailRef.current,
          { autoAlpha: 1, x: 0, y: -72, ease: "power2.out", duration: 0.9 },
          1.12,
        );
      });

      mm.add("(min-width: 768px)", () => {
        gsap.set(heroImageRef.current, {
          width: "100%",
          height: "100dvh",
          x: 0,
          yPercent: 4,
          scale: 1,
          transformOrigin: "left center",
        });
        gsap.set(heroDetailRef.current, { autoAlpha: 0, x: 36, yPercent: 0 });

        const heroTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: heroRef.current,
            start: "bottom bottom",
            end: "+=170%",
            pin: true,
            scrub: true,
          },
        });

        heroTimeline.to(heroTitleRef.current, {
          y: -28,
          autoAlpha: 0,
          ease: "power2.out",
          duration: 0.8,
        });
        heroTimeline.fromTo(
          heroImageRef.current,
          { scale: 1, yPercent: 4 },
          {
            scale: 0.62,
            xPercent: 0,
            yPercent: 7,
            ease: "power2.inOut",
            duration: 1.25,
          },
          0.08,
        );
        heroTimeline.to(
          heroDetailRef.current,
          { autoAlpha: 1, x: 0, yPercent: 0, ease: "power2.out", duration: 0.9 },
          0.72,
        );
      });

      const goalCards = gsap.utils.toArray<HTMLElement>("[data-goal-card]");
      const isMobileViewport = window.matchMedia("(max-width: 767px)").matches;
      const goalsTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: goalsRef.current,
          start: "top top",
          end: "+=280%",
          pin: true,
          scrub: 1.6,
        },
      });

      goalsTimeline.to({}, { duration: 0.28 });
      goalsTimeline.fromTo(
        goalCards,
        { autoAlpha: 0, y: 56, scale: 0.84, rotate: (index) => (index - 1) * 10 },
        {
          autoAlpha: 1,
          y: (index) => (isMobileViewport ? 0 : index * -10),
          scale: (index) => 1 - index * 0.03,
          rotate: (index) => (index - 1) * 4,
          stagger: { each: 0.2, from: "start" },
          ease: "back.out(1.4)",
          duration: 1.05,
        },
        ">-0.08",
      );
      goalsTimeline.to(goalsTitleRef.current, { y: -24, autoAlpha: 0, ease: "power2.in", duration: 0.35 }, ">+0.1");
      goalsTimeline.to(
        goalCards,
        {
          autoAlpha: 0,
          y: (index) => -140 - index * 24,
          scale: (index) => 0.82 - index * 0.05,
          rotate: (index) => (index - 1) * -12,
          stagger: { each: 0.14, from: "end" },
          ease: "power4.in",
          duration: 0.95,
        },
        "cardsExit",
      );
      goalsTimeline.addLabel("cardsGone", "cardsExit+=1.3");
      goalsTimeline.to(goalsContentRef.current, { y: -72, autoAlpha: 0, ease: "power2.in", duration: 0.45 }, "cardsGone+=0.25");

      gsap.fromTo(
        strategyContentRef.current,
        { y: 90, autoAlpha: 0, scale: 0.97 },
        {
          y: 0,
          autoAlpha: 1,
          scale: 1,
          ease: "none",
          immediateRender: false,
          scrollTrigger: {
            trigger: strategyRef.current,
            start: "top 90%",
            end: "top 55%",
            scrub: 1.2,
          },
        },
      );

      const strategyCount = detail.strategies.length;
      const strategyMaxShiftPercent = strategyCount > 1 ? -((strategyCount - 1) / strategyCount) * 100 : 0;
      const strategyTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: strategyRef.current,
          start: "top top",
          end: isMobileViewport
            ? `+=${Math.round(145 * Math.max(1, (strategyCount - 1) / 2))}%`
            : `+=${Math.round(130 * Math.max(1, (strategyCount - 1) / 2))}%`,
          pin: true,
          scrub: isMobileViewport ? 1.1 : 1.2,
        },
      });
      strategyTimeline.to({}, { duration: 0.08 }).to(strategyTrackRef.current, { xPercent: strategyMaxShiftPercent, ease: "none", duration: 0.86 }).to({}, { duration: 0.08 });

      if (
        project.key === "project-2" &&
        detail.processFlowItems?.length &&
        processFlowRef.current &&
        processFlowContentRef.current &&
        processFlowTrackRef.current
      ) {
        gsap.fromTo(
          processFlowContentRef.current,
          { y: 90, autoAlpha: 0, scale: 0.97 },
          {
            y: 0,
            autoAlpha: 1,
            scale: 1,
            ease: "none",
            immediateRender: false,
            scrollTrigger: {
              trigger: processFlowRef.current,
              start: "top 90%",
              end: "top 55%",
              scrub: 1.2,
            },
          },
        );

        const processFlowCount = detail.processFlowItems.length;
        const processFlowMaxShiftPercent =
          processFlowCount > 1 ? -((processFlowCount - 1) / processFlowCount) * 100 : 0;
        const processFlowTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: processFlowRef.current,
            start: "top top",
            end: isMobileViewport
              ? `+=${Math.round(145 * Math.max(1, (processFlowCount - 1) / 2))}%`
              : `+=${Math.round(130 * Math.max(1, (processFlowCount - 1) / 2))}%`,
            pin: true,
            scrub: isMobileViewport ? 1.1 : 1.2,
          },
        });

        processFlowTimeline
          .to({}, { duration: 0.08 })
          .to(processFlowTrackRef.current, { xPercent: processFlowMaxShiftPercent, ease: "none", duration: 0.86 })
          .to({}, { duration: 0.08 });
      }
    });

    return () => {
      ctx.revert();
    };
  }, [project, detail.strategies.length, detail.processFlowItems?.length]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button type="button" onClick={onClose} className="absolute inset-0 bg-black-50" aria-label="Close featured modal" />

      <div className="absolute inset-x-0 bottom-0 top-[56px] md:top-[80px]">
        <div className="relative h-full w-full overflow-hidden rounded-t-[22px] rounded-b-none border border-secondary-50 border-b-0 bg-primary shadow-[0px_0px_8px_var(--color-word1-50)] md:rounded-t-[26px]">
          <button
            type="button"
            onClick={onClose}
            aria-label="Close featured modal"
            className="absolute right-[10px] top-[10px] z-40 inline-flex h-[32px] w-[32px] items-center justify-center rounded-[999px] border border-word1-50 bg-primary-50 text-word2 shadow-[0px_0px_4px_var(--color-word1-50)] transition-[background-color,color] duration-150 ease-out hover:bg-word2-50 hover:text-primary"
          >
            <span className="leading-none">×</span>
          </button>

          <div ref={wrapperRef} className="absolute inset-0 overflow-hidden [contain:layout_paint] [clip-path:inset(56px_0_0_0)] md:[clip-path:inset(80px_0_0_0)]">
            <div ref={contentRef} className="min-h-full w-full">
              <div className="w-full">
                <section ref={heroRef} className="relative min-h-[calc(100dvh-112px)] w-full px-[16px] pb-[16px] pt-[96px] md:min-h-screen md:px-[24px] md:pb-[20px] md:pt-[120px]">
                  <div className="relative z-20 mx-auto flex w-full max-w-[1440px] flex-col items-center">
                    <div ref={heroTitleRef} className="mt-[20px] flex flex-col items-center text-center md:mt-[28px]">
                      <p className="whitespace-nowrap text-gsap-hero-title text-gsap-hero-title-mobile text-highlight md:whitespace-normal" style={{ letterSpacing: "0px" }}>
                        {detail.englishTitle}
                      </p>
                      <h2
                        className="mt-[12px] font-[var(--font-design-sans)] text-[clamp(34px,5.8vw,80px)] leading-none font-bold text-word1 [letter-spacing:2px] md:mt-[24px] md:[letter-spacing:8px]"
                      >
                        {detail.title}
                      </h2>
                      <button
                        type="button"
                        onClick={handleScrollToGoals}
                        className="group mt-[28px] inline-flex items-center gap-[10px] rounded-[999px] bg-highlight px-[14px] py-[7px] text-work text-primary shadow-[0px_0px_4px_var(--color-word1-50)] transition-[background-color,box-shadow] duration-150 ease-out hover:bg-word2 active:bg-word2 md:mt-[72px] md:gap-[12px] md:px-[24px] md:py-[12px] md:text-pc-work"
                        aria-label="向下滑動"
                      >
                        <span>向下滑動</span>
                        <span className="relative h-[12px] w-[8px] rotate-90 md:h-[17px] md:w-[11px]">
                          <Image
                            alt=""
                            src="/figma-assets/4be1f9eed94356903838c5ac6d2df5050fca6f70.svg"
                            fill
                            sizes="(min-width: 768px) 11px, 8px"
                            className="object-contain brightness-0 invert transition-[opacity] duration-150 ease-out group-hover:opacity-90 group-active:opacity-90"
                          />
                        </span>
                      </button>
                    </div>

                    <div ref={heroImageRef} className="mt-[16px] h-[calc(100dvh-112px)] w-[200vw] min-w-0 self-center overflow-hidden md:h-[100dvh] md:w-full md:self-start">
                      {getFeaturedImage(heroImage) ? (
                        <CmsImage
                          image={getFeaturedImage(heroImage)}
                          alt={heroImage?.alt || detail.heroAlt}
                          width={1800}
                          sizes="100vw"
                          maxWidth={1800}
                          quality={84}
                          className="h-full w-full max-w-full object-cover"
                          priority
                        />
                      ) : (
                        <Image
                          src={detail.heroFallbackSrc}
                          alt={detail.heroAlt}
                          width={1200}
                          height={800}
                          sizes="100vw"
                          className="h-full w-full max-w-full object-cover"
                          draggable={false}
                          onContextMenu={(event) => event.preventDefault()}
                        />
                      )}
                    </div>
                  </div>

                  <div ref={heroDetailRef} className="relative z-30 mx-auto -mt-[56px] w-full max-w-full rounded-[14px] bg-[var(--color-primary-85)] p-[10px] md:absolute md:left-[calc(62%_+_32px)] md:top-[61%] md:mt-0 md:max-h-[44%] md:w-[clamp(260px,32vw,520px)] md:max-w-none md:-translate-y-1/2 md:overflow-y-auto md:p-[14px]">
                    <p className="text-h3 text-word2">專案類型：</p>
                    <p className="mt-[4px] text-h4 text-word1">{detail.projectType}</p>
                    <p className="mt-[24px] text-h3 text-word2">專案背景：</p>
                    <p className="mt-[4px] text-h4 text-word1">{detail.projectBackground}</p>
                  </div>
                </section>

                <section ref={goalsRef} className="h-[calc(100dvh-112px)] w-full overflow-hidden bg-highlight px-[16px] pb-[24px] pt-[80px] md:h-screen md:px-[24px] md:pb-[30px] md:pt-[110px]">
                  <div ref={goalsContentRef} className="mx-auto flex h-full w-full max-w-[1440px] flex-col">
                    <h3 ref={goalsTitleRef} className="mt-[56px] text-center text-gsap-section-title text-primary md:mt-[72px]">設計目標</h3>
                    <div className="mt-[18px] grid h-full min-h-0 w-full min-w-0 flex-1 grid-cols-1 items-center gap-[28px] md:grid-cols-3 md:gap-[16px]">
                      {detail.goals.map((goal, index) => (
                        <article key={goal} data-goal-card className="flex h-full w-[88%] min-w-0 justify-self-center flex-col items-center justify-center gap-[16px] overflow-hidden rounded-[14px] border-[3px] border-primary bg-[var(--color-primary-85)] p-[10px] text-center shadow-[0px_10px_24px_var(--color-black-50)] md:h-full md:max-h-[340px] md:w-full md:gap-[20px] md:p-[14px]">
                          <p className="text-gsap-goal-number text-highlight">{`0${index + 1}`}</p>
                          <p className="mx-auto text-center text-[16px] leading-[1.35] text-word2 md:text-[clamp(20px,1.8vw,28px)]">{goal}</p>
                        </article>
                      ))}
                    </div>
                  </div>
                </section>

                <section ref={strategyRef} className="h-[calc(100dvh-112px)] w-full overflow-hidden px-[16px] pb-[24px] pt-[80px] md:h-screen md:px-[24px] md:pb-[30px] md:pt-[110px]">
                  <div ref={strategyContentRef} className="relative h-full w-full min-w-0">
                    <h3 className="pointer-events-none absolute left-1/2 top-[56px] z-20 -translate-x-1/2 text-gsap-section-title text-word2 md:top-[72px]">設計策略</h3>
                    <div className="relative flex h-full w-full min-w-0 items-start overflow-hidden pt-[96px] md:pt-[128px]">
                      <div ref={strategyTrackRef} className="flex h-full gap-0" style={{ width: `${detail.strategies.length * 100}vw` }}>
                        {detail.strategies.map((item) => {
                          const migratedImage = findMigratedImage(featuredImages, item.caption);

                          return (
                            <article key={item.caption} className="flex h-full w-screen min-w-0 shrink-0 items-center justify-center px-[12px] md:px-[20px]">
                              <div className="mx-auto grid h-[min(64vh,100%)] w-full max-w-[1360px] grid-cols-1 items-center gap-[18px] md:grid-cols-2 md:gap-[56px]">
                                <div className="h-[min(60vh,100%)] w-full max-w-[85vw] min-w-0 overflow-hidden rounded-[12px] md:max-w-none">
                                  <StrategyMedia image={migratedImage} alt={migratedImage?.alt || item.alt} fallbackSrc={item.fallbackSrc} type={item.type} />
                                </div>
                                <div className="w-full max-w-[85vw] min-w-0 md:max-w-none">
                                  <p data-strategy-text className="min-w-0 text-[16px] leading-[1.35] text-word2 md:text-[clamp(20px,1.8vw,28px)]">{item.text}</p>
                                </div>
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </section>

                {project.key === "project-2" && detail.processFlowItems?.length ? (
                  <section ref={processFlowRef} className="h-[calc(100dvh-112px)] w-full overflow-hidden px-[16px] pb-[24px] pt-[80px] md:h-screen md:px-[24px] md:pb-[30px] md:pt-[110px]">
                    <div ref={processFlowContentRef} className="relative flex h-full w-full min-w-0 flex-col">
                      <h3 className="pointer-events-none z-20 mt-[56px] text-center text-gsap-section-title text-word2 md:mt-[72px]">
                        <span className="md:hidden">
                          流程規劃
                          <br />
                          與系統規劃
                        </span>
                        <span className="hidden md:inline">設計流程與系統規劃</span>
                      </h3>
                      <div className="relative flex h-full min-h-0 w-full min-w-0 items-start overflow-hidden pt-[18px] md:pt-[56px]">
                        <div ref={processFlowTrackRef} className="flex h-full items-center gap-[32px]" style={{ width: "max-content" }}>
                          {detail.processFlowItems.map((item, index) => {
                            const migratedImage = findMigratedImage(featuredImages, item.caption);

                            return (
                              <article key={item.caption} className="flex h-full w-[calc(100vw-32px)] min-w-[calc(100vw-32px)] shrink-0 items-center justify-center">
                                <div className="mx-auto flex h-[min(64vh,100%)] w-full max-w-[980px] flex-col items-center justify-center gap-[10px] md:gap-[14px]">
                                  <div className="h-[min(60vh,100%)] w-full min-w-0 overflow-hidden rounded-[12px] border border-secondary-50">
                                    {getFeaturedImage(migratedImage) ? (
                                      <CmsImage image={getFeaturedImage(migratedImage)} alt={migratedImage?.alt || item.alt} width={1200} sizes="100vw" className="h-full w-full object-cover" />
                                    ) : (
                                      <Image src={item.fallbackSrc} alt={item.alt} width={1200} height={800} sizes="100vw" className="h-full w-full object-cover" draggable={false} onContextMenu={(event) => event.preventDefault()} />
                                    )}
                                  </div>
                                  <p data-process-text className="min-w-0 text-center text-[16px] leading-[1.35] text-word2 md:text-[clamp(20px,1.8vw,28px)]">
                                    {`Step ${index + 1}. ${item.text}`}
                                  </p>
                                </div>
                              </article>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </section>
                ) : null}

                <section className="w-full bg-highlight px-[16px] py-[20px] md:px-[24px] md:py-[24px]">
                  <div className="mx-auto w-full max-w-[1440px] text-center">
                    <Link href="/page-about" onClick={onClose} className="group inline-flex items-center gap-[8px] text-h4 text-primary transition-all duration-150 hover:text-word2 hover:opacity-100 active:scale-[0.97] active:text-word2 active:opacity-100">
                      DESIGN BY BETTY CHOU{" "}
                      <span aria-hidden="true" className="transition-transform duration-150 group-hover:translate-x-[4px] group-active:translate-x-[2px]">
                        →
                      </span>
                    </Link>
                  </div>
                </section>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
