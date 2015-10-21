package com.example.internationalization;

import java.text.MessageFormat;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.ResourceBundle;

import org.springframework.context.support.ResourceBundleMessageSource;

/**
 * The Class CustomResourceBundleMessageSource.
 */
public class CustomResourceBundleMessageSource extends ResourceBundleMessageSource {

	/** The basenames. */
	private String[] basenames;

	/*
	 * (non-Javadoc)
	 * 
	 * @see org.springframework.context.support.ResourceBundleMessageSource#
	 * setBasenames(java.lang.String[])
	 */
	@Override
	public void setBasenames(String... basenames) {
		super.setBasenames(basenames);
		if (basenames != null) {
			this.basenames = new String[basenames.length];
			for (int i = 0; i < basenames.length; i++) {
				String basename = basenames[i];
				this.basenames[i] = basename.trim();
			}
		} else {
			this.basenames = new String[0];
		}
	}

	/**
	 * Gets the messages.
	 *
	 * @param locale
	 *            the locale
	 * @return the messages
	 */
	public Map<String, String> getMessages(Locale locale) {
		Map<String, String> result = new HashMap<>();
		Object[] args = new Object[0];
		for (String basename : basenames) {
			ResourceBundle bundle = this.getResourceBundle(basename, locale);
			if (bundle != null) {
				for (String key : bundle.keySet()) {
					MessageFormat messageFormat = this.getMessageFormat(bundle, key, locale);
					result.put(key, messageFormat.format(args));
				}
			}
		}

		return result;
	}

}
