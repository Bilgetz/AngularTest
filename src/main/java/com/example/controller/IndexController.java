package com.example.controller;

import java.util.Locale;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.manifest.Manifest;

/**
 * The Class IndexController.
 */
@Controller
public class IndexController {

	/**
	 * Index.
	 *
	 * @return the string
	 */
	@RequestMapping(value = "/")
	public String index() {
		return "index";
	}

	/**
	 * Index partial.
	 *
	 * @return the string
	 */
	@RequestMapping(value = "/partials", method = { RequestMethod.GET })
	public String indexPartial() {
		return "partials/index";
	}

	/**
	 * Partials comments.
	 *
	 * @return the string
	 */
	// @RequestMapping(value = "/partials/comments")
	// public String partialsComments() {
	// return "partials/comments";
	// }

	@RequestMapping(value = "/manifest.webapp", method = { RequestMethod.GET })
	public @ResponseBody Manifest manifest(HttpServletRequest request, Locale locale) {
		Manifest manifest = new Manifest();
		String path = request.getContextPath();
		manifest.setLang(locale.getLanguage());
		manifest.setLaunch_path(path);
		manifest.getIcons().put("128", "icon128.png");
		manifest.getIcons().put("512", "icon512.png");
		return manifest;
	}

}
