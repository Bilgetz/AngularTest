package com.example.controller;

import static com.example.manifest.EnumDisplay.STANDALONE;
import static com.example.manifest.EnumOrientation.LANDSCAPE;

import java.util.Locale;

import javax.servlet.http.HttpServletRequest;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.example.manifest.Icon;
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
	 * Manifest.
	 *
	 * @param request
	 *            the request
	 * @param locale
	 *            the locale
	 * @return the manifest
	 */
	@RequestMapping(value = "/manifest.webapp", method = { RequestMethod.GET })
	public @ResponseBody Manifest manifest(HttpServletRequest request, Locale locale) {
		Manifest manifest = new Manifest();
		manifest.setBackground_color("white");
		manifest.setDisplay(STANDALONE);
		manifest.getIcons().add(new Icon("icon/icon.png", "64x64", "image/png", null));
		manifest.setLang("fr");
		manifest.setOrientation(LANDSCAPE);
		manifest.setPrefer_related_applications(false);
		manifest.setStart_url("./");
		manifest.setScope(request.getContextPath());
		manifest.setShort_name("tes angular");
		return manifest;
	}

}
