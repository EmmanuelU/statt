import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { styles } from "../styles/styles";
import { fadeIn, } from "../utils/motion";
import Image from "next/image"


const cardMotion = {
  rest: {
    //x: 0,
    transition: {
      duration: 2,
      type: "tween",
      ease: "easeIn",
    },
  },
  hover: {
    //x: 30,
    scale: 0.98,
    transition: {
      duration: 0.4,
      type: "tween",
      ease: "easeOut",
    },
  },
};

const GoBack = (props) => {
  if (props.onClick)
    return (<motion.h2
      variants={fadeIn("up", "spring", 1 * 0.5, 0.75)}
      whileHover={{ scale: 1.05, color: "#FFF" }}
      whileTap={{ scale: 0.9, color: "#FFF" }}
      whileInView={{ color: "#FFF" }}
      className={styles.sectionHeadText}
      onClick={props.onClick}
    >
      Go Back.
    </motion.h2>)
  else
    return (<motion.h2
      variants={fadeIn("up", "spring", 1 * 0.5, 0.75)}
      whileHover={{ scale: 1.05, color: "#FFF" }}
      whileTap={{ scale: 0.9, color: "#FFF" }}
      whileInView={{ color: "#FFF" }}
      className={styles.sectionHeadText}
      onClick={() => {
        document.location.href = "/";
      }}
    >
      Go Back.
    </motion.h2>)
}

const fetchClock = () => {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
  })
    .format(new Date())
    .toString();
};

const Stamp = () => {
  const [_stamp, _setStamp] = useState(fetchClock());

  useEffect(() => {
    const intervalId = setInterval(() => {

      _setStamp(fetchClock());
    }, 1000);

    return () => clearInterval(intervalId);
  }, []);
  return (
    <>
      <motion.div className="fixed left-0 top-0 z-50 m-0 p-1">
        <center>
          <motion.h2
            variants={fadeIn("right", "spring", 1 * 0.1, 0.45)}
            whileHover={{ scale: 1.01, color: "#FFF" }}
            whileTap={{ scale: 0.99, color: "#FFF" }}
            whileInView={{ color: "#F0D0D0" }}
            className={styles.sectionLilHeadText}
          >
            <p suppressHydrationWarning>{_stamp}</p>
          </motion.h2>
        </center>
      </motion.div>
    </>
  );
};

const LanderButton = (props) => {
  return (
    <motion.h2

      variants={fadeIn("up", "spring", props.delay, props.duration)}
      whileHover={{ scale: 1.05, color: "#FFF", textDecoration: "underline" }}
      whileTap={{ scale: 0.9, color: "#FFF" }}
      whileInView={{ color: "#FFF" }}
      className={styles.sectionHeadText}
      onClick={props.onClick}
      style={{ ...props.style }}
    >
      {props.children}
    </motion.h2>
  );
};

const HelpText = (props) => {
  return (
    <center>
      <motion.div
        id="intro"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: 15, animationDelay: 1.5, duration: 1 }}
        //variants={fadeIn("down", "", 0.1, 1)}
        transition={{
          type: "spring",
          bounce: 0.25,
          repeat: 1,
          repeatType: "reverse",
          duration: 2,
        }}
        className="mt-4 text-secondary text-[17px] max-w-3xl leading-[30px] p-8"
      >
        <p className={styles.sectionSubText}>{props.children}</p>
      </motion.div>
    </center>
  );
};

const LilButton = (props) => {
  return (
    <motion.h6
      variants={fadeIn("up", "spring", 1 * props.delay, 0.75)}
      whileHover={{ scale: 1.05, color: "#FFF", textDecoration: "underline" }}
      whileTap={{ scale: 0.9, color: "#FFF" }}
      whileInView={{ color: "#FFF" }}
      className={styles.sectionHeadLilText}
      onClick={props.onClick}
      style={{ ...props.style }}
    >
      {props.children}
    </motion.h6>
  );
};


const LilText = (props) => {
  return (
    <motion.h6
      variants={fadeIn("right", "spring", 1 * 0.1, 0.45)}
      whileHover={{ scale: 1.01, color: "#FFF" }}
      whileTap={{ scale: 0.99, color: "#FFF" }}
      whileInView={{ color: "#F0D0D0" }}
      onClick={props.onClick}
      style={props.style}
    >
      <p >{props.children}</p>
    </motion.h6>
  );
};

/**
 * 
 font-     letter-spacing: .02em;
      font-family: Neue Montreal, sans-serif;
      font-size: 20px;
      font-weight: 400;
      line-height: 28px;
 * @returns 
 */

const Paragraph = (props) => {
  return (
    <motion.h6
      variants={fadeIn("down", "spring", props.delay, props.duration)}
      whileHover={{ scale: 1.01, color: "#F0D0D0" }}
      whileTap={{ scale: 0.99, color: "#F0D0D0" }}
      whileInView={{ color: "#FFF" }}
      className="max-w-[540px] text-[20px] tracking-[.2em] leading-[28px]"

      onClick={props.onClick}
      style={props.style}
    >
      <p >{props.children}</p>
    </motion.h6>
  );
};




const ServiceCard = ({ id, index, href, desc, icon, background, color }) => {
  const [descInView, setdescInView] = useState(false);

  const title = desc ? desc : href ? href : "";

  return (
    <div id={id} className="xs:w-[250px]">
      <motion.div
        title={title}
        style={{ backgroundColor: "#00000020" }}
        whileTap={{ scale: 0.95 }}
        variants={cardMotion}
        whileHover="hover"
        onClick={(e) => {
          if (typeof window !== "undefined" && href)
            window.location.href = href;
        }}
        //variants={fadeIn("right", "spring", index * 1, 0.75)}
        className="p-[1px] rounded-[20px] shadow-card"
      >
        <ImageAsync
          alt={title}
          src={icon}
          width={500}
          height={500}
          className={`object-cover max-h-[500px]`}
        />
        {/**
          {desc && (
            <p className="relative inset-x-0 bottom-0 bg-[#0000009F] sm:text-[18px] text-[14px] uppercase">
              {desc}
            </p>
          )}
  
           */}
      </motion.div>
    </div>
  );
};

export const ImageAsync = ({ src, alt, ...props }) => {
  const [reveal, setReveal] = useState(false);
  const visibility = reveal ? "visible" : "hidden";
  const loader = reveal ? "none" : "inline-block";

  return (
    <div>
      <Image
        src={src}
        width={500}
        height={500}
        className={`object-cover max-h-[500px]`}
        onError={() => setReveal(true)}
        style={{ ...props.style, visibility }}
        onLoadingComplete={() => setReveal(true)}
        {...props}
      />
      <span
        style={{
          display: loader,
          position: "absolute",
          top: 0,
        }}
      ></span>
    </div>
  );
};


const GalleryCard = ({ id, index, href, desc, icon, background, color }) => {
  const [descInView, setdescInView] = useState(false);

  const title = desc ? desc : href ? href : "";

  return (
    <div id={id} className="xs:w-[250px]">
      <motion.div
        title={title}
        style={{ backgroundColor: "#00000020" }}
        whileTap={{ scale: 0.95 }}
        variants={cardMotion}
        whileHover="hover"
        onClick={(e) => {
          if (typeof window !== "undefined" && href)
            window.location.href = href;
        }}
        //variants={fadeIn("right", "spring", index * 1, 0.75)}
        className="p-[1px] rounded-[20px] shadow-card"
      >
        <ImageAsync
          src={icon}
          width={500}
          height={500}
          className={`object-cover max-h-[500px]`}
        />
        {/**
          {desc && (
            <p className="relative inset-x-0 bottom-0 bg-[#0000009F] sm:text-[18px] text-[14px] uppercase">
              {desc}
            </p>
          )}
  
           */}
      </motion.div>
    </div>
  );
};

const EventCard = ({
  id,
  index,
  date,
  href,
  title,
  desc,
  icon,
  background,
  color,
  button,
}) => {
  const [descInView, setdescInView] = useState(false);

  const header = title ? title : desc ? desc : href ? href : "";

  return (
    <div
      onClick={(e) => {
        if (typeof window !== "undefined" && href) window.location.href = href;
      }}
      id={id}
      className="xs:w-[250px] my-10"
    >
      <motion.div
        title={header}
        style={{ backgroundColor: "#00000020" }}
        whileTap={{ scale: 0.95 }}
        onTap={() => {
          if (typeof window !== "undefined" && href)
            window.location.href = href;
        }}
        variants={cardMotion}
        whileHover="hover"
        //variants={fadeIn("right", "spring", index * 1, 0.75)}
        className="p-[1px] rounded-[20px] shadow-card"
      >
        {icon && (
          <ImageAsync
            alt={header}
            src={icon}
            width={500}
            height={500}
            className={`object-cover max-h-[500px]`}
          />
        )}
        <div className="max-w-[500px] outline">
          <div class="grid grid-flow-row-dense grid-cols-2 md:grid-cols-2 grid-rows-1">
            <span className="text-left ">
              <h2 className="p-1 text-[#F0D0D0] font-black text-[14px] whitespace-nowrap select-all pointer-events-auto">
                {date}
                <br />
              </h2>

              <p className="p-1 bg-[#0000009F] sm:text-[12px] text-[12px] uppercase w-full whitespace-nowrap">
                {header}
              </p>
            </span>
            {button && (
              <span className="text-right text-[#FFD833]">
                <h2 className="p-1 font-black text-[14px] w-full whitespace-nowrap uppercase mr-1">
                  {button}
                </h2>
                <p className="p-1 sm:text-[8px] text-[8px] uppercase w-full">
                  + more information
                </p>
              </span>
            )}
          </div>
        </div>

        {/**
          {!icon && header && (
            <p className="relative inset-x-0 bottom-0 bg-[#0000009F] sm:text-[18px] text-[14px] uppercase">
              {header}
            </p>
          )}
           */}
      </motion.div>
    </div>
  );
};

export { fetchClock, GoBack, Stamp, LanderButton, HelpText, LilButton, LilText, Paragraph, ServiceCard, EventCard, GalleryCard }