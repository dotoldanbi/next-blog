"use client";

import { useTheme } from "next-themes";
import {
  Button,
  Navbar,
  NavbarToggle,
  NavbarCollapse,
  NavbarLink,
  TextInput,
} from "flowbite-react";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
// ICON
import { AiOutlineSearch } from "react-icons/ai";
import { FaMoon, FaSun } from "react-icons/fa";
// CLERK
import {
  SignedIn,
  SignedOut,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import { dark, light } from "@clerk/themes";

export default function Header() {
  // useTheme : 테마, set테마
  const { theme, setTheme } = useTheme();

  // url path, router 라우팅
  const path = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState("");

  // submit action
  const handleSubmit = (e) => {
    // 프리벤트디폴드
    e.preventDefault();

    const urlParams = new URLSearchParams(searchParams);
    urlParams.set("searchTerm", searchTerm);
    const searchQuery = urlParams.toString();
    router.push(`/search?${searchQuery}`);
  };

  useEffect(() => {
    /*
    ✅ URLSearchParams란?
    URLSearchParams는 URL의 쿼리 문자열(?key=value&key2=value2)을 파싱하고 조작할 수 있는 브라우저 내장 객체입니다.
    new URLSearchParams(searchParams)는 문자열 또는 객체를 받아서 내부적으로 key-value 쌍으로 파싱합니다.

    const searchParams = "?name=John&age=30"; searchParams는 이런 형태
    */

    const urlParams = new URLSearchParams(searchParams);
    const searchTermFromUrl = urlParams.get("searchTerm");
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [searchParams]);

  return (
    <Navbar className="border-b-2 fluid">
      {/* Link는 a태그 사이드렌더링 "next/link"; */}
      <Link
        href="/"
        className="self-center whitespace-nowrap text-sm sm:text-xl font-semibold dark:text-white"
      >
        <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">
          Sahand&apos;s
        </span>
        Blog
      </Link>
      <form onSubmit={handleSubmit}>
        <TextInput
          type="text"
          placeholder="Search..."
          rightIcon={AiOutlineSearch}
          className="hidden lg:inline"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </form>
      <Button className="w-12 h-10 lg:hidden" color="gray" pill>
        <AiOutlineSearch />
      </Button>
      <div className="flex gap-2 md:order-2">
        <Button
          className="w-12 h-10 hidden sm:inline"
          color="gray"
          pill
          onClick={() => setTheme(theme === "light" ? "dark" : "light")}
        >
          {theme === "light" ? <FaSun /> : <FaMoon />}
        </Button>

        <SignedIn>
          <UserButton
            appearance={{
              baseTheme: theme === "light" ? light : dark,
            }}
            userProfileUrl="/dashboard?tab=profile"
          />
        </SignedIn>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <NavbarToggle />
      </div>
      <NavbarCollapse>
        <Link href="/">
          <NavbarLink active={path === "/"} as={"div"}>
            Home
          </NavbarLink>
        </Link>
        <Link href="/about">
          <NavbarLink active={path === "/about"} as={"div"}>
            About
          </NavbarLink>
        </Link>
        <Link href="/projects">
          <NavbarLink active={path === "/projects"} as={"div"}>
            Projects
          </NavbarLink>
        </Link>
      </NavbarCollapse>
    </Navbar>
  );
}
