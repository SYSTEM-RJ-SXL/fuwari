import {
	AUTO_MODE,
	DARK_MODE,
	DEFAULT_THEME,
	LIGHT_MODE,
} from "@constants/constants.ts";
import { expressiveCodeConfig, siteConfig } from "@/config";
import type { LIGHT_DARK_MODE } from "@/types/config";

export function getDefaultHue(): number {
	const fallback = "250";
	const configCarrier = document.getElementById("config-carrier");
	return Number.parseInt(configCarrier?.dataset.hue || fallback, 10);
}

export function getHue(): number {
	const stored = localStorage.getItem("hue");
	return stored ? Number.parseInt(stored, 10) : getDefaultHue();
}

export function setHue(hue: number): void {
	localStorage.setItem("hue", String(hue));
	const r = document.querySelector(":root") as HTMLElement;
	if (!r) {
		return;
	}
	r.style.setProperty("--hue", String(hue));
}

export function applyThemeToDocument(theme: LIGHT_DARK_MODE) {
	// 如果强制使用暗色模式，则忽略其他设置
	if (siteConfig.themeColor.forceDarkMode) {
		document.documentElement.classList.add("dark");
	} else {
		// 否则按照用户设置或系统偏好
		switch (theme) {
			case LIGHT_MODE:
				document.documentElement.classList.remove("dark");
				break;
			case DARK_MODE:
				document.documentElement.classList.add("dark");
				break;
			case AUTO_MODE:
				if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
					document.documentElement.classList.add("dark");
				} else {
					document.documentElement.classList.remove("dark");
				}
				break;
		}
	}

	// Set the theme for Expressive Code
	document.documentElement.setAttribute(
		"data-theme",
		expressiveCodeConfig.theme,
	);
}

export function setTheme(theme: LIGHT_DARK_MODE): void {
	// 如果强制使用暗色模式，则不需要存储主题设置
	if (!siteConfig.themeColor.forceDarkMode) {
		localStorage.setItem("theme", theme);
	}
	applyThemeToDocument(theme);
}

export function getStoredTheme(): LIGHT_DARK_MODE {
	// 如果强制使用暗色模式，则始终返回暗色模式
	if (siteConfig.themeColor.forceDarkMode) {
		return DARK_MODE;
	}
	return (localStorage.getItem("theme") as LIGHT_DARK_MODE) || DEFAULT_THEME;
}
