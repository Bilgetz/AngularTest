package com.example.manifest;

import com.example.manifest.serializer.EnumOrientationSerializer;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;

/**
 * The Enum Orientation.
 */
@JsonSerialize(using = EnumOrientationSerializer.class)
public enum EnumOrientation {

	/** The any. */
	ANY("any"),
	/** The natural. */
	NATURAL("natural"),
	/** The landscape. */
	LANDSCAPE("landscape"),
	/** The landscape primary. */
	LANDSCAPE_PRIMARY("landscape-primary"),
	/** The landscape secondary. */
	LANDSCAPE_SECONDARY("landscape-secondary"),
	/** The portrait. */
	PORTRAIT("portrait"),
	/** The portrait primary. */
	PORTRAIT_PRIMARY("portrait-primary"),
	/** The portrait secondary. */
	PORTRAIT_SECONDARY("portrait-secondary");

	/** The value. */
	private String value;

	/**
	 * Instantiates a new orientation.
	 *
	 * @param value
	 *            the value
	 */
	private EnumOrientation(String value) {
		this.value = value;
	}

	/**
	 * Gets the value.
	 *
	 * @return the value
	 */
	public String getValue() {
		return value;
	}

}
