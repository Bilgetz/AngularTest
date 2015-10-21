package com.example.controller;

import java.util.Locale;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.example.internationalization.CustomResourceBundleMessageSource;

/**
 * The Class LocalController.
 */
@RestController
public class LocalController {

	/** The bundle. */
	private CustomResourceBundleMessageSource bundle;

	/**
	 * Instantiates a new local controller.
	 *
	 * @param bundle
	 *            the bundle
	 */
	@Autowired
	public LocalController(CustomResourceBundleMessageSource bundle) {
		super();
		this.bundle = bundle;
	}

	/**
	 * Gets the.
	 *
	 * @param local
	 *            the local
	 * @return the locale
	 */
	@RequestMapping(value = "locale", method = RequestMethod.GET)
	public @ResponseBody Locale get(Locale local) {
		return local;
	}

	/**
	 * Gets the avaible.
	 *
	 * @return the avaible
	 */
	@RequestMapping(value = "locales", method = RequestMethod.GET)
	public @ResponseBody Locale[] getAvaible() {
		return new Locale[] { Locale.FRENCH, Locale.ENGLISH };
	}

	/**
	 * Gets the locale.
	 *
	 * @param locale
	 *            the locale
	 * @return the locale
	 */
	@RequestMapping(value = "locales/current", method = RequestMethod.GET)
	public @ResponseBody Map<String, String> getLocale(Locale locale) {
		return bundle.getMessages(locale);
	}

}
