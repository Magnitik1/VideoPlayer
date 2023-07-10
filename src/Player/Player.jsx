import React, { useState, useEffect, useRef } from "react";
import "./Player.css";
import vid from "./1.m4v";

var globalIsPlaying = false;
var loudness = 1;
function Player() {
  const videoRef = useRef(null);
  var [_, refresh] = useState();
  var [progress, setProgress] = useState(0);
  var [volumePic, setVolumePic] = useState("high");
  var [videoSpeed, setVideoSpeed] = useState(1);
  var [open, isOpen] = useState();

  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  useEffect(() => {
    let keyupHandler = (event) => {
      let vid = videoRef.current;
      if (
        event.key === "f" ||
        event.key === "а" ||
        event.key === "F" ||
        event.key === "А"
      ) {
        fullscreen();
      }
      if (event.key === " " || event.key === "з" || event.key === "З") {
        play_pause();
      }
      if (event.key === "ArrowRight") {
        if (vid.duration - vid.currentTime <= 5) {
          vid.currentTime = vid.duration;
        } else vid.currentTime += 5;
        console.log(vid.currentTime, "up");
      }
      if (event.key === "ArrowLeft") {
        if (vid.currentTime <= 5) {
          vid.currentTime = 0;
        } else vid.currentTime -= 5;
        console.log(vid.currentTime, "down");
      }
    };

    let keydownHandler = (event) => {
      let vid = videoRef.current;
      if (event.key === "ArrowUp") {
        if (vid.volume >= 0.95) {
          changeVolume(1);
          return;
        } else {
          changeVolume(vid.volume + 0.05);
          return;
        }
      }
      if (event.key === "ArrowDown") {
        if (vid.volume <= 0.05) {
          changeVolume(0);
          return;
        } else {
          changeVolume(vid.volume - 0.05);
          return;
        }
      }
    };
    let o = 0;
    let show = async (e) => {
      if (!globalIsPlaying || e.layerY > videoRef.current.clientHeight - 74) {
        document.querySelector(".controls").style.display = "block";
        return;
      }
      let t = 2200;
      o++;
      let r = o;
      if (document.querySelector(".controls").style.display === "none") t = 50;
      await delay(t);
      if (r === o) document.querySelector(".controls").style.display = "none";
      else document.querySelector(".controls").style.display = "block";
    };
    let scrolltime = (event) => {
      console.log(
        (event.layerX / document.getElementById("timeline").clientWidth) * 100
      );
      setProgress(
        (event.layerX / document.getElementById("timeline").clientWidth) * 100
      );
      videoRef.current.currentTime =
        videoRef.current.duration *
        (event.layerX / document.getElementById("timeline").clientWidth);
    };
    let clickHandler = (e) => {
      play_pause();
    };

    let breakButtonFocusHandler = (ev) => {
      ev.preventDefault();
    };

    function breakButtonFocus(button) {
      document
        .querySelector(button)
        .addEventListener("mousedown", breakButtonFocusHandler);
    }

    function cleanupBreakButtonFocus(button) {
      document
        .querySelector(button)
        .removeEventListener("mousedown", breakButtonFocusHandler);
    }

    breakButtonFocus(".fullscreen");
    breakButtonFocus(".volume");
    breakButtonFocus(".speed");
    breakButtonFocus(".play");
    breakButtonFocus(".volume-slider");
    document
      .getElementById("timeline")
      .addEventListener("mousedown", scrolltime);
    window.addEventListener("keyup", keyupHandler);
    window.addEventListener("keydown", keydownHandler);
    document.getElementById("myvideo").addEventListener("click", clickHandler);
    document.getElementById("myvideo").addEventListener("mousemove", show);
    return function cleanup() {
      document.getElementById("myvideo").removeEventListener("mousemove", show);
      window.removeEventListener("keyup", keyupHandler);
      window.removeEventListener("keydown", keyupHandler);
      document
        .getElementById("myvideo")
        .removeEventListener("click", clickHandler);
      document
        .getElementById("timeline")
        .removeEventListener("mousedown", scrolltime);
      cleanupBreakButtonFocus(".fullscreen");
      cleanupBreakButtonFocus(".volume");
      cleanupBreakButtonFocus(".speed");
      cleanupBreakButtonFocus(".play");
      cleanupBreakButtonFocus(".volume-slider");
    };
  }, []);

  var handleUpdate = () => {
    try {
      if (videoRef.current.duration <= videoRef.current.currentTime) {
        play_pause();
      }
      setProgress(
        (videoRef.current.currentTime / videoRef.current.duration) * 100
      );
    } catch {}
  };

  var mute = () => {
    if (volumePic === "muted") {
      videoRef.current.volume = loudness;
      document.getElementById("sound").value = loudness;
      changeVolume(loudness);
    } else {
      videoRef.current.volume = 0;
      document.getElementById("sound").value = 0;
      changeVolume(0);
    }
  };

  var changeVolume = (e) => {
    videoRef.current.volume = e;
    if (e >= 0.37) {
      setVolumePic("high");
    } else if (e == 0) {
      setVolumePic("muted");
    } else {
      setVolumePic("low");
    }
    if (e != 0) loudness = e;
    document.getElementById("sound").value = e;
  };

  var play_pause = () => {
    if (globalIsPlaying) {
      videoRef.current.pause();
      globalIsPlaying = !globalIsPlaying;
      refresh(2);
      document.querySelector(".controls").style.display = "block";
    } else if (!globalIsPlaying) {
      videoRef.current.play();
      globalIsPlaying = !globalIsPlaying;
      refresh(1);
      disapear();
    }
  };

  const disapear = async (e) => {
    await delay(2200);
    if (globalIsPlaying || e.layerY > videoRef.current.clientHeight - 74) {
      document.querySelector(".controls").style.display = "none";
    }
  };

  var fullscreen = () => {
    var conteiner = document.querySelector(".container");
    if (document.fullscreenElement === null) {
      conteiner.requestFullscreen();
    } else {
      document.exitFullscreen();
    }
    console.log(!open);
    open = !open;
    isOpen(open);
  };

  var time = () => {
    var s = "";
    var minutes = 0,
      seconds = 0,
      minutes2 = 0,
      seconds2 = 0;
    try {
      minutes = Math.floor(videoRef.current.currentTime / 60);
      seconds = Math.floor(videoRef.current.currentTime) % 60;
      minutes2 = Math.floor(videoRef.current.duration / 60);
      seconds2 = Math.floor(videoRef.current.duration) % 60;
    } catch {}
    if (minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;
    s += minutes;
    s += ":";
    s += seconds;

    if (minutes2 < 10) minutes2 = "0" + minutes2;
    if (seconds2 < 10) seconds2 = "0" + seconds2;
    s += " / ";
    s += minutes2;
    s += ":";
    s += seconds2;
    return s;
  };

  return (
    <div className="container">
      <video
        id="myvideo"
        src={vid}
        className="vid"
        ref={videoRef}
        onTimeUpdate={handleUpdate}
      />
      <div className="controls">
        <div id="timeline" className="timeline_container">
          <progress className="timeline" value={progress} max="100" />
        </div>
        <button className="play" onClick={play_pause} tabIndex="-1">
          {globalIsPlaying ? (
            <svg className="pause-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M14,19H18V5H14M6,19H10V5H6V19Z" />
            </svg>
          ) : (
            <svg className="play-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M8,5.14V19.14L19,12.14L8,5.14Z" />
            </svg>
          )}
        </button>
        <span className="volume-conteiner" tabIndex="-1">
          <button className="volume" onClick={mute}>
            {volumePic === "high" ? (
              <svg className="volume-high-icon" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z"
                />
              </svg>
            ) : volumePic === "low" ? (
              <svg className="volume-low-icon" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M5,9V15H9L14,20V4L9,9M18.5,12C18.5,10.23 17.5,8.71 16,7.97V16C17.5,15.29 18.5,13.76 18.5,12Z"
                />
              </svg>
            ) : (
              <svg className="volume-muted-icon" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M12,4L9.91,6.09L12,8.18M4.27,3L3,4.27L7.73,9H3V15H7L12,20V13.27L16.25,17.53C15.58,18.04 14.83,18.46 14,18.7V20.77C15.38,20.45 16.63,19.82 17.68,18.96L19.73,21L21,19.73L12,10.73M19,12C19,12.94 18.8,13.82 18.46,14.64L19.97,16.15C20.62,14.91 21,13.5 21,12C21,7.72 18,4.14 14,3.23V5.29C16.89,6.15 19,8.83 19,12M16.5,12C16.5,10.23 15.5,8.71 14,7.97V10.18L16.45,12.63C16.5,12.43 16.5,12.21 16.5,12Z"
                />
              </svg>
            )}
          </button>
          <input
            id="sound"
            className="volume-slider"
            type="range"
            min="0"
            max="1"
            step="any"
            defaultValue={1}
            onChange={(e) => {
              changeVolume(e.target.value);
            }}
          />
        </span>
        <button
          className="speed"
          tabIndex="-1"
          onClick={() => {
            if (videoSpeed == 2) videoSpeed = 0;
            videoRef.current.playbackRate = videoSpeed + 0.25;
            setVideoSpeed(videoSpeed + 0.25);
          }}>
          {videoSpeed}X
        </button>
        <button className="time" tabIndex="-1">
          {time()}
        </button>
        <button className="fullscreen" onClick={fullscreen} tabIndex="-1">
          {open ? (
            <svg className="close" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"
              />
            </svg>
          ) : (
            <svg className="open" viewBox="0 0 24 24">
              <path
                fill="currentColor"
                d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"
              />
            </svg>
          )}
        </button>
      </div>
    </div>
  );
}
export default Player;
