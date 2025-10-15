"use client";

import { motion } from "framer-motion";
import { Github, Linkedin, Mail, Music, Activity, BookOpen, Book } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

interface SpotifyData {
  isPlaying: boolean;
  title: string;
  artist: string;
  album?: string;
  albumImageUrl?: string;
  songUrl?: string;
}

interface ReadingData {
  isReading: boolean;
  title: string;
  author: string;
  bookUrl: string;
  coverImage: string;
}

export default function Home() {
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [spotifyData, setSpotifyData] = useState<SpotifyData>({
    isPlaying: false,
    title: "Loading...",
    artist: "",
  });
  const [readingData, setReadingData] = useState<ReadingData>({
    isReading: false,
    title: "Loading...",
    author: "",
    bookUrl: "",
    coverImage: "",
  });
  const [isLoadingSpotify, setIsLoadingSpotify] = useState(true);
  const [isLoadingReading, setIsLoadingReading] = useState(true);
  const [isLoadingLastUpdated, setIsLoadingLastUpdated] = useState(true);

useEffect(() => {
    // Fetch last updated from git
    fetch("/api/last-updated")
      .then((res) => res.json())
      .then((data) => {
        setLastUpdated(data.lastUpdated);
        setIsLoadingLastUpdated(false);
      })
      .catch(() => {
        const now = new Date();
        setLastUpdated(
          now.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          }),
        );
        setIsLoadingLastUpdated(false);
      });

    // Fetch Spotify data
    fetch("/api/spotify")
      .then((res) => res.json())
      .then((data) => {
        setSpotifyData(data);
        setIsLoadingSpotify(false);
      })
      .catch(() => {
        setSpotifyData({
          isPlaying: false,
          title: "The Way You Look Tonight",
          artist: "Frank Sinatra",
        });
        setIsLoadingSpotify(false);
      });

    // Fetch reading data
    fetch("/api/reading")
      .then((res) => res.json())
      .then((data) => {
        setReadingData(data);
        setIsLoadingReading(false);
      })
      .catch(() => {
        setReadingData({
          isReading: false,
          title: "Nothing currently",
          author: "",
          bookUrl: "",
          coverImage: "",
        });
        setIsLoadingReading(false);
      });
  }, []);

  return (
    <div className="min-h-screen px-6 py-20">
      <div className="max-w-6xl mx-auto">
        {/* Hero Section with Profile */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-20"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 items-start">
            {/* Profile Card */}
            <div className="md:col-span-1">
              <div className="bg-zinc-100 dark:bg-zinc-900 rounded-2xl p-8 border border-zinc-200 dark:border-zinc-800 transition-transform hover:scale-[1.02] duration-300">
                <div className="relative w-48 h-48 mx-auto mb-6 rounded-full overflow-hidden bg-zinc-200 dark:bg-zinc-800">
                  <Image
                    src="/images/pfp.png"
                    alt="Allen Liu"
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
                <h1 className="text-3xl font-bold text-center mb-2 text-zinc-900 dark:text-zinc-100">
                  Allen Liu
                </h1>
                <p className="text-center text-zinc-600 dark:text-zinc-400 mb-6">
                  Junior at Princeton University
                </p>

                {/* Social Links */}
                <div className="space-y-3">
                  <Link
                    href="https://github.com/wildwastaken"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all duration-300 hover:scale-105 hover:translate-x-1"
                  >
                    <Github className="w-4 h-4" />
                    <span>GitHub</span>
                  </Link>
                  <Link
                    href="https://www.linkedin.com/in/allenliuct/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 text-zinc-600 dark:text-zinc-400 hover:text-[#0A66C2] dark:hover:text-[#0A66C2] transition-all duration-300 hover:scale-105 hover:translate-x-1"
                  >
                    <Linkedin className="w-4 h-4" />
                    <span>LinkedIn</span>
                  </Link>
                  <Link
                    href="https://www.strava.com/athletes/104181021"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 text-zinc-600 dark:text-zinc-400 hover:text-orange-500 dark:hover:text-orange-400 transition-all duration-300 hover:scale-105 hover:translate-x-1"
                  >
                    <Activity className="w-4 h-4" />
                    <span>Strava</span>
                  </Link>
                  <Link
                    href="https://hardcover.app/@allenliu/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 text-zinc-600 dark:text-zinc-400 hover:text-purple-500 dark:hover:text-purple-400 transition-all duration-300 hover:scale-105 hover:translate-x-1"
                  >
                    <Book className="w-4 h-4" />
                    <span>My Books</span>
                  </Link>
                  <Link
                    href="mailto:allenliu@princeton.edu"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-all duration-300 hover:scale-105 hover:translate-x-1"
                  >
                    <Mail className="w-4 h-4" />
                    <span>allenliu@princeton.edu</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="md:col-span-2">
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 text-zinc-900 dark:text-zinc-100">
                Hi, I'm Allen!
              </h2>
              <div className="prose prose-xl max-w-none text-zinc-700 dark:text-zinc-300 space-y-6 leading-relaxed">
                <p className="text-lg">
                  I'm Allen — a junior at Princeton University studying Computer
                  Science, Economics, and Philosophy. I'm passionate about
                  technology, literature, and the outdoors, and my studies are
                  driven by curiosity and a desire to understand how things
                  work.
                </p>
                <p className="text-lg">
                  Ever since I built my first program to help my neighbors
                  during the pandemic, I've learned to enjoy building tools that
                  make life simpler and more intuitive, whether through
                  software, data, or design. When I'm not studying or coding,
                  you'll probably find me reading, cycling around campus,
                  exploring nature trails, or sharing food with friends. I've
                  always believed that curiosity and diverse interests lead to
                  better ideas and more creative problem-solving.
                </p>
              </div>

              {/* Currently Reading Widget */}
              <div className="mt-8 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                {isLoadingReading ? (
                  <div className="flex items-center space-x-3 text-zinc-600 dark:text-zinc-400">
                    <div className="w-5 h-5 bg-zinc-300 dark:bg-zinc-700 rounded animate-pulse"></div>
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-32 bg-zinc-300 dark:bg-zinc-700 rounded animate-pulse"></div>
                      <div className="h-4 w-48 bg-zinc-300 dark:bg-zinc-700 rounded animate-pulse"></div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3 text-zinc-600 dark:text-zinc-400">
                    <BookOpen className="w-5 h-5 text-blue-500 flex-shrink-0" />
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="text-sm">
                        {readingData.isReading
                          ? "Currently reading"
                          : "Not reading anything"}
                        :
                      </span>
                      {readingData.bookUrl ? (
                        <a
                          href={readingData.bookUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-zinc-900 dark:text-zinc-100 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300"
                        >
                          {readingData.title}
                        </a>
                      ) : (
                        <span className="font-medium text-zinc-900 dark:text-zinc-100">
                          {readingData.title}
                        </span>
                      )}
                      {readingData.author && (
                        <span className="text-sm">by {readingData.author}</span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Spotify Widget */}
              <div className="mt-6 pt-6 border-t border-zinc-200 dark:border-zinc-800">
                {isLoadingSpotify ? (
                  <div className="flex items-center space-x-3 text-zinc-600 dark:text-zinc-400">
                    <div className="w-5 h-5 bg-zinc-300 dark:bg-zinc-700 rounded animate-pulse"></div>
                    <div className="flex items-center space-x-2">
                      <div className="h-4 w-32 bg-zinc-300 dark:bg-zinc-700 rounded animate-pulse"></div>
                      <div className="h-4 w-48 bg-zinc-300 dark:bg-zinc-700 rounded animate-pulse"></div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center space-x-3 text-zinc-600 dark:text-zinc-400">
                    <Music className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                      <span className="text-sm">
                        {spotifyData.isPlaying
                          ? "Currently listening to"
                          : "Last listened to"}
                        :
                      </span>
                      {spotifyData.songUrl ? (
                        <a
                          href={spotifyData.songUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-medium text-zinc-900 dark:text-zinc-100 hover:text-green-600 dark:hover:text-green-400 transition-all duration-300"
                        >
                          {spotifyData.title}
                        </a>
                      ) : (
                        <span className="font-medium text-zinc-900 dark:text-zinc-100">
                          {spotifyData.title}
                        </span>
                      )}
                      <span className="text-sm">by {spotifyData.artist}</span>
                      {spotifyData.isPlaying && (
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center text-zinc-500 dark:text-zinc-500 text-sm py-8 border-t border-zinc-200 dark:border-zinc-800"
        >
          {isLoadingLastUpdated ? (
            <div className="flex items-center justify-center space-x-2">
              <span>Last updated:</span>
              <div className="h-4 w-32 bg-zinc-300 dark:bg-zinc-700 rounded animate-pulse"></div>
            </div>
          ) : (
            <p>Last updated: {lastUpdated}</p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
