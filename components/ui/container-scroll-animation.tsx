"use client";
import React, { useRef } from "react";
import { useScroll, useTransform, motion, MotionValue } from "framer-motion";

export const ContainerScroll = ({
    titleComponent,
    children,
}: {
    titleComponent: string | React.ReactNode;
    children: React.ReactNode;
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
    });
    const [isMobile, setIsMobile] = React.useState(false);
    const [isTablet, setIsTablet] = React.useState(false);

    React.useEffect(() => {
        const checkDevice = () => {
            const width = window.innerWidth;
            setIsMobile(width <= 640);
            setIsTablet(width > 640 && width <= 1024);
        };
        checkDevice();
        window.addEventListener("resize", checkDevice);
        return () => {
            window.removeEventListener("resize", checkDevice);
        };
    }, []);

    const scaleDimensions = () => {
        if (isMobile) return [0.65, 0.85];
        if (isTablet) return [0.8, 0.95];
        return [1.05, 1];
    };

    const rotate = useTransform(scrollYProgress, [0, 1], isMobile ? [15, 0] : [20, 0]);
    const scale = useTransform(scrollYProgress, [0, 1], scaleDimensions());
    const translate = useTransform(scrollYProgress, [0, 1], isMobile ? [0, -50] : [0, -100]);

    return (
        <div
            className="h-[45rem] sm:h-[55rem] md:h-[65rem] lg:h-[75rem] xl:h-[80rem] flex items-center justify-center relative px-2 sm:px-4 md:px-8 lg:px-16 xl:px-20 py-4 sm:py-8 md:py-12 lg:py-16 xl:py-20"
            ref={containerRef}
        >
            <div
                className="py-6 sm:py-10 md:py-16 lg:py-24 xl:py-40 w-full relative"
                style={{
                    perspective: "1000px",
                }}
            >
                <Header translate={translate} titleComponent={titleComponent} />
                <Card rotate={rotate} translate={translate} scale={scale} isMobile={isMobile} isTablet={isTablet}>
                    {children}
                </Card>
            </div>
        </div>
    );
};

export const Header = ({ translate, titleComponent }: any) => {
    return (
        <motion.div
            style={{
                translateY: translate,
            }}
            className="div max-w-5xl mx-auto text-center px-4 sm:px-6"
        >
            {titleComponent}
        </motion.div>
    );
};

export const Card = ({
    rotate,
    scale,
    children,
    isMobile,
    isTablet,
}: {
    rotate: MotionValue<number>;
    scale: MotionValue<number>;
    translate: MotionValue<number>;
    children: React.ReactNode;
    isMobile?: boolean;
    isTablet?: boolean;
}) => {
    return (
        <motion.div
            style={{
                rotateX: rotate,
                scale,
                boxShadow:
                    "0 0 #0000004d, 0 9px 20px #0000004a, 0 37px 37px #00000042, 0 84px 50px #00000026, 0 149px 60px #0000000a, 0 233px 65px #00000003",
            }}
            className={`max-w-5xl mx-auto w-full border-2 sm:border-4 border-[#6C6C6C] bg-[#222222] rounded-xl sm:rounded-2xl md:rounded-[30px] shadow-2xl
                ${isMobile
                    ? 'h-[20rem] -mt-4 p-1.5'
                    : isTablet
                        ? 'h-[28rem] -mt-8 p-3'
                        : 'h-[30rem] md:h-[40rem] -mt-12 p-2 md:p-6'
                }`}
        >
            <div className="h-full w-full overflow-hidden rounded-lg sm:rounded-xl md:rounded-2xl bg-gray-100 dark:bg-zinc-900 p-1 sm:p-2 md:p-4">
                {children}
            </div>
        </motion.div>
    );
};

